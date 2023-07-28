import type { CachifiedOptions } from "./mdx";
import { getContentMdxListItems } from "./mdx";

/**
 * Get and order frontmatters by specified array
 */
export async function getBlogsFeatured(
  features: string[],
  options: CachifiedOptions
) {
  const { request, timings } = options;
  const contents = await getContentMdxListItems("blog", { request, timings });
  // override as T because there is no typechecking on the features array
  return features.map((feat) =>
    contents.find((content) => content.slug === feat)
  ) as typeof contents;
}
