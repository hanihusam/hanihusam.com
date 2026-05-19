import { getFromLocalStorage } from "@/utils/misc";

export const isProd = process.env.NODE_ENV === "production";

/**
 * Get content meta from the database
 * @see useContentMeta.tsx
 */
export const contentMetaFlag = isProd;

/**
 * Increment content views
 * @see blog.$slug.tsx
 */
export const incrementMetaFlag =
  isProd && getFromLocalStorage("incrementMetaFlag") !== "false";
