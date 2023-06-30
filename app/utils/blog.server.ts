import type { ContentType, Frontmatter, PickFrontmatter } from "@/types";

import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { join } from "path";
import readingTime from "reading-time";

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
    op.tags.some((p) => currentFm?.tags.includes(p))
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
