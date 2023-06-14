import type { ReadTimeResults } from "reading-time";

export interface ContentMeta {
  slug: string;
  views: number;
  likes: number;
  likesByUser: number;
}

export interface SingleContentMeta {
  contentViews: number;
  contentLikes: number;
  likesByUser: number;
  devtoViews?: number;
}

export type BlogFrontmatter = {
  wordCount: number;
  readingTime: ReadTimeResults;
  slug: string;
  englishOnly?: boolean;
  title: string;
  description: string;
  bannerCloudinaryId: string;
  publishedAt: string;
  lastUpdated?: string;
  tags: string;
  repost?: string;
};

export type ContentType = "blog" | "projects";

export type PickFrontmatter<T extends ContentType> = T extends "blog"
  ? BlogFrontmatter
  : ProjectFrontmatter;

export type InjectedMeta = { views?: number; likes?: number };

export type BlogType = {
  code: string;
  frontmatter: BlogFrontmatter;
};

export type ProjectFrontmatter = {
  slug: string;
  title: string;
  publishedAt: string;
  lastUpdated?: string;
  description: string;
  category?: string;
  techs: string;
  bannerCloudinaryId: string;
  link?: string;
  github?: string;
  youtube?: string;
};

export type ProjectType = {
  code: string;
  frontmatter: ProjectFrontmatter;
};

export type FrontmatterWithTags = BlogFrontmatter;
export type FrontmatterWithDate = BlogFrontmatter | ProjectFrontmatter;
export type Frontmatter = ProjectFrontmatter | BlogFrontmatter;
