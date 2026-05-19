/**
 * Remove `id-` prefix
 */
export const cleanBlogPrefix = (slug: string) => {
  if (slug.slice(0, 3) === "id-") {
    return slug.slice(3);
  } else {
    return slug;
  }
};
