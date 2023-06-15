import type { ContentType, Frontmatter, PickFrontmatter } from "@/types";

import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import { join } from "path";
import readingTime from "reading-time";

export async function getFiles(type: ContentType) {
  return readdirSync(join(process.cwd(), "contents", type));
}

export async function getFileBySlug(type: ContentType, slug: string) {
  const { default: rehypeAutolinkHeadings } = await import(
    "rehype-autolink-headings"
  );
  const { default: rehypePrism } = await import("rehype-prism-plus");
  const { default: rehypeSlug } = await import("rehype-slug");
  const { default: gfm } = await import("remark-gfm");
  const source = slug
    ? readFileSync(join(process.cwd(), "contents", type, `${slug}.mdx`), "utf8")
    : readFileSync(join(process.cwd(), "contents", `${type}.mdx`), "utf8");

  try {
    const { code, frontmatter } = await bundleMDX({
      source,
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
        wordCount: source.split(/\s+/gu).length,
        readingTime: readingTime(source),
        slug: slug || null,
        ...frontmatter,
      },
    };
  } catch (error: unknown) {
    console.error(`Compilation error for slug: `, slug);
    throw error;
  }
}

export async function getAllFilesFrontmatter<T extends ContentType>(type: T) {
  const files = readdirSync(join(process.cwd(), "contents", type));

  return files.reduce((allPosts: Array<PickFrontmatter<T>>, postSlug) => {
    const source = readFileSync(
      join(process.cwd(), "contents", type, postSlug),
      "utf8"
    );
    const { data } = matter(source);

    const res = [
      {
        ...(data as PickFrontmatter<T>),
        slug: postSlug.replace(".mdx", ""),
        readingTime: readingTime(source),
      },
      ...allPosts,
    ];
    return res;
  }, []);
}

export async function getRecommendations(currSlug: string) {
  const frontmatters = await getAllFilesFrontmatter("blog");

  // Get current frontmatter
  const currentFm = frontmatters.find((fm) => fm.slug === currSlug);

  // Remove currentFm and Bahasa Posts, then randomize order
  const otherFms = frontmatters
    .filter((fm) => !fm.slug.startsWith("id-") && fm.slug !== currSlug)
    .sort(() => Math.random() - 0.5);

  // Find with similar tags
  const recommendations = otherFms.filter((op) =>
    op.tags.split(",").some((p) => currentFm?.tags.split(",").includes(p))
  );

  // Populate with random recommendations if not enough
  const threeRecommendations =
    recommendations.length >= 3
      ? recommendations
      : [
          ...recommendations,
          ...otherFms.filter(
            (fm) => !recommendations.some((r) => r.slug === fm.slug)
          ),
        ];

  // Only return first three
  return threeRecommendations.slice(0, 3);
}

/**
 * Get and order frontmatters by specified array
 */
export function getFeatured<T extends Frontmatter>(
  contents: Array<T>,
  features: string[]
) {
  // override as T because there is no typechecking on the features array
  return features.map(
    (feat) => contents.find((content) => content.slug === feat) as T
  );
}
