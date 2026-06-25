import {
  type ContentType,
  type GitHubFile,
  type PageContent,
  type ProjectFrontmatter,
} from "@/types";

import { cache, cachified } from "./cache.server";
import { compileMdx } from "./complie-mdx.server";
import { downloadDirList, downloadMdxFileOrDirectory } from "./github.server";
import { getBlurDataUrl } from "./images";
import { typedBoolean } from "./misc";
import { type Timings } from "./timing.server";

type CachifiedOptions = {
  forceFresh?: boolean | string;
  request?: Request;
  ttl?: number;
  timings?: Timings;
};

const defaultTTL = 1000 * 60 * 60 * 24 * 14;
const defaultStaleWhileRevalidate = 1000 * 60 * 60 * 24 * 30;

const checkCompiledValue = (value: unknown) =>
  typeof value === "object" &&
  (value === null || ("code" in value && "frontmatter" in value));

async function compileMdxCached({
  contentDir,
  slug,
  files,
  options,
}: {
  contentDir: ContentType;
  slug: string;
  files: Array<GitHubFile>;
  options: CachifiedOptions;
}) {
  const key = `${contentDir}:${slug}:compiled`;
  const page = await cachified({
    cache,
    ttl: defaultTTL,
    staleWhileRevalidate: defaultStaleWhileRevalidate,
    ...options,
    key,
    checkValue: checkCompiledValue,
    getFreshValue: async () => {
      const compiledPage = await compileMdx<ProjectFrontmatter>(slug, files);
      if (compiledPage) {
        if (
          compiledPage.frontmatter.bannerCloudinaryId &&
          !compiledPage.frontmatter.bannerBlurDataUrl
        ) {
          try {
            compiledPage.frontmatter.bannerBlurDataUrl = await getBlurDataUrl(
              compiledPage.frontmatter.bannerCloudinaryId,
            );
          } catch (error: unknown) {
            console.error(
              "oh no, there was an error getting the blur image data url",
              error,
            );
          }
        }

        return compiledPage;
      } else {
        return null;
      }
    },
  });
  // if there's no page, remove it from the cache
  if (!page) {
    void cache.delete(key);
  }
  return page;
}

export async function downloadMdxFilesCached(
  contentDir: ContentType,
  slug: string,
  options: CachifiedOptions,
) {
  const { forceFresh, ttl = defaultTTL, request, timings } = options;
  const key = `${contentDir}:${slug}:downloaded`;
  const downloaded = await cachified({
    cache,
    request,
    timings,
    ttl,
    staleWhileRevalidate: defaultStaleWhileRevalidate,
    forceFresh,
    key,
    checkValue: (value: unknown) => {
      if (typeof value !== "object") {
        return `value is not an object`;
      }
      if (value === null) {
        return `value is null`;
      }

      const download = value as Record<string, unknown>;
      if (!Array.isArray(download.files)) {
        return `value.files is not an array`;
      }
      if (typeof download.entry !== "string") {
        return `value.entry is not a string`;
      }

      return true;
    },
    getFreshValue: async () =>
      downloadMdxFileOrDirectory(`${contentDir}/${slug}`),
  });
  // if there aren't any files, remove it from the cache
  if (!downloaded.files.length) {
    void cache.delete(key);
  }
  return downloaded;
}

const getDirListKey = (contentDir: string) => `${contentDir}:dir-list`;

async function getMdxPage(
  {
    contentDir,
    slug,
  }: {
    contentDir: ContentType;
    slug: string;
  },
  options: CachifiedOptions,
): Promise<PageContent | null> {
  const { forceFresh, ttl = defaultTTL, request, timings } = options;
  const key = `mdx-page:${contentDir}:${slug}:compiled`;
  try {
    const page = await cachified({
      key,
      cache,
      request,
      timings,
      ttl,
      staleWhileRevalidate: defaultStaleWhileRevalidate,
      forceFresh,
      checkValue: checkCompiledValue,
      getFreshValue: async () => {
        const pageFiles = await downloadMdxFilesCached(
          contentDir,
          slug,
          options,
        );
        const compiledPage = await compileMdxCached({
          contentDir,
          slug,
          ...pageFiles,
          options,
        }).catch((err) => {
          console.error(`Failed to get a fresh value for mdx:`, {
            contentDir,
            slug,
          });
          return Promise.reject(err);
        });
        return compiledPage;
      },
    });
    if (!page) {
      // if there's no page, let's remove it from the cache
      void cache.delete(key);
    }
    return page;
  } catch (error: unknown) {
    console.error(
      `mdx: failed to load page ${contentDir}/${slug}, returning null`,
      error,
    );
    void cache.delete(key);
    return null;
  }
}

async function getMdxDirList(contentDir: string, options?: CachifiedOptions) {
  const { forceFresh, ttl = defaultTTL, request, timings } = options ?? {};
  const key = getDirListKey(contentDir);
  return cachified({
    cache,
    request,
    timings,
    ttl,
    staleWhileRevalidate: defaultStaleWhileRevalidate,
    forceFresh,
    key,
    checkValue: (value: unknown) => Array.isArray(value),
    getFreshValue: async () => {
      const fullContentDirPath = `contents/${contentDir}`;
      try {
        return (await downloadDirList(fullContentDirPath))
          .filter(
            ({ name, type }) =>
              type === "dir" || name.endsWith(".mdx") || name.endsWith(".md"),
          )
          .map(({ name, path }) => ({
            name,
            slug: path
              .replace(/\\/g, "/")
              .replace(`${fullContentDirPath}/`, "")
              .replace(/\.mdx?$/, ""),
          }))
          .filter(({ name }) => name !== "README.md");
      } catch (error: unknown) {
        console.error(
          `mdx: failed to fetch dir list for ${contentDir}, returning empty`,
          error,
        );
        return [];
      }
    },
  });
}

async function getMdxPagesInDirectory(
  contentDir: ContentType,
  options: CachifiedOptions,
) {
  const dirList = await getMdxDirList(contentDir, options);

  // our octokit throttle plugin will make sure we don't hit the rate limit
  const pageDatas = await Promise.all(
    dirList.map(async ({ slug }) => {
      return {
        ...(await downloadMdxFilesCached(contentDir, slug, options)),
        slug,
      };
    }),
  );

  const pages = await Promise.all(
    pageDatas.map((pageData) =>
      compileMdxCached({ contentDir, ...pageData, options }),
    ),
  );
  return pages.filter(typedBoolean);
}

/**
 * This is useful for when you don't want to send all the code for a page to the client.
 */
function mapFromMdxPageToMdxListItem(page: PageContent) {
  const { code, ...mdxListItem } = page;
  return mdxListItem.frontmatter;
}

async function getContentMdxListItems(
  type: ContentType,
  options: CachifiedOptions,
) {
  const { request, forceFresh, ttl = defaultTTL, timings } = options;
  const key = `${type}:mdx-list-items`;
  return cachified({
    cache,
    request,
    timings,
    ttl,
    staleWhileRevalidate: defaultStaleWhileRevalidate,
    forceFresh,
    key,
    getFreshValue: async () => {
      let pages = await getMdxPagesInDirectory(type, options);

      pages = pages.sort((a, z) => {
        const aTime = new Date(a.frontmatter.publishedAt ?? "").getTime();
        const zTime = new Date(z.frontmatter.publishedAt ?? "").getTime();
        return aTime > zTime ? -1 : aTime === zTime ? 0 : 1;
      });

      return pages.map((page) => mapFromMdxPageToMdxListItem(page));
    },
  });
}

export { getContentMdxListItems, getMdxDirList, getMdxPage };
export type { CachifiedOptions };
