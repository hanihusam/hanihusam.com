import { type ReadTimeResults } from 'reading-time'

export type GitHubFile = { path: string; content: string }

export interface ContentMeta {
	slug: string
	views: number
	likes: number
	likesByUser: number
}

export interface SingleContentMeta {
	contentViews: number
	contentLikes: number
	likesByUser: number
}

export type BlogFrontmatter = {
	wordCount: number
	readingTime: ReadTimeResults
	slug: string
	englishOnly?: boolean
	title: string
	description: string
	bannerCloudinaryId: string
	publishedAt: string
	lastUpdated?: string
	tags: Array<string>
	bannerBlurDataUrl?: string
	repost?: string
	meta?: {
		keywords?: Array<string>
		[key as string]: string
	}
}

export type ContentType = 'blog' | 'projects'

export type PickFrontmatter<T extends ContentType> = T extends 'blog'
	? BlogFrontmatter
	: ProjectFrontmatter

export type PickContent<T extends ContentType> = T extends 'blog'
	? BlogType
	: ProjectType

export type InjectedMeta = { views?: number; likes?: number }

export type BlogType = {
	code: string
	frontmatter: BlogFrontmatter
}

export type ProjectFrontmatter = {
	slug: string
	title: string
	publishedAt: string
	lastUpdated?: string
	description: string
	category?: string
	techs: string
	bannerCloudinaryId: string
	link?: string
	github?: string
	youtube?: string
	bannerBlurDataUrl?: string
}

export type ProjectType = {
	code: string
	frontmatter: ProjectFrontmatter
}

export type PageContent<T extends ContentType> = {
	code: string
	frontmatter: PickFrontmatter<T>
}

export type FrontmatterWithTags = BlogFrontmatter
export type FrontmatterWithDate = BlogFrontmatter | ProjectFrontmatter
export type Frontmatter = FrontmatterWithDate
