import type { GitHubFile } from "@/types";

import { bundleMDX } from "mdx-bundler";
import type TPQueue from "p-queue";
import readingTime from "reading-time";

function arrayToObj<ItemType extends Record<string, unknown>>(
  array: Array<ItemType>,
  { keyName, valueName }: { keyName: keyof ItemType; valueName: keyof ItemType }
) {
  const obj: Record<string, ItemType[keyof ItemType]> = {};
  for (const item of array) {
    const key = item[keyName];
    if (typeof key !== "string") {
      throw new Error(`${String(keyName)} of item must be a string`);
    }
    const value = item[valueName];
    obj[key] = value;
  }
  return obj;
}

async function compileMdx<FrontmatterType>(
  slug: string,
  githubFiles: Array<GitHubFile>
) {
  const { default: rehypeAutolinkHeadings } = await import(
    "rehype-autolink-headings"
  );
  const { default: rehypePrism } = await import("rehype-prism-plus");
  const { default: rehypeSlug } = await import("rehype-slug");
  const { default: gfm } = await import("remark-gfm");

  const indexRegex = new RegExp(`${slug}\\/index.mdx?$`);
  const indexFile = githubFiles.find(({ path }) => indexRegex.test(path));
  if (!indexFile) return null;

  const rootDir = indexFile.path.replace(/index.mdx?$/, "");
  const relativeFiles: Array<GitHubFile> = githubFiles.map(
    ({ path, content }) => ({
      path: path.replace(rootDir, "./"),
      content,
    })
  );
  const files = arrayToObj(relativeFiles, {
    keyName: "path",
    valueName: "content",
  });

  try {
    const { code, frontmatter } = await bundleMDX({
      source: indexFile.content,
      files,
      mdxOptions(options) {
        options.remarkPlugins = [...(options?.remarkPlugins ?? []), gfm];
        options.rehypePlugins = [
          ...(options?.rehypePlugins ?? []),
          rehypeSlug,
          rehypePrism,
          [
            rehypeAutolinkHeadings,
            {
              properties: {
                className: ["hash-anchor"],
              },
            },
          ],
        ];

        return options;
      },
    });

    return {
      code,
      frontmatter: {
        wordCount: indexFile.content.split(/\s+/gu).length,
        readingTime: readingTime(indexFile.content),
        slug: slug || null,
        ...frontmatter,
      } as FrontmatterType,
    };
  } catch (error: unknown) {
    console.error(`Compilation error for slug: `, slug);
    throw error;
  }
}

let _queue: TPQueue | null = null;
async function getQueue() {
  const { default: PQueue } = await import("p-queue");
  if (_queue) return _queue;

  _queue = new PQueue({
    concurrency: 1,
    throwOnTimeout: true,
    timeout: 1000 * 30,
  });
  return _queue;
}

// We have to use a queue because we can't run more than one of these at a time
// or we'll hit an out of memory error because esbuild uses a lot of memory...
async function queuedCompileMdx<FrontmatterType>(
  ...args: Parameters<typeof compileMdx>
) {
  const queue = await getQueue();
  const result = await queue.add(() => compileMdx<FrontmatterType>(...args));
  return result;
}

export { queuedCompileMdx as compileMdx };
