import { type ReadTimeResults } from "reading-time";

export type SubstackPost = {
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  coverImage: string | null;
  readingTime: ReadTimeResults;
  coverBlurDataUrl?: string;
};

export type GitHubFile = { path: string; content: string };

export type ContentType = "projects";

export type InjectedMeta = { views?: number; likes?: number };

export type ProjectFrontmatter = {
  wordCount?: number;
  readingTime?: ReadTimeResults;
  slug: string;
  title: string;
  publishedAt: string;
  lastUpdated?: string;
  description: string;
  category?: string;
  role?: string;
  techs: string;
  bannerCloudinaryId: string;
  link?: string;
  github?: string;
  bannerBlurDataUrl?: string;
};

export type PageContent = {
  code: string;
  frontmatter: ProjectFrontmatter;
};
