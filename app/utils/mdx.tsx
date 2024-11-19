import * as React from 'react'

import { CloudinaryImg } from '@/components/blog/cloudinary-img'
import { ThemedBlogImage } from '@/components/blog/themed-blog-image'
import { AnchorOrLink } from '@/components/links/anchor-or-link'
import {
	type ContentType,
	type GitHubFile,
	type PageContent,
	type PickFrontmatter,
} from '@/types'

import { cache, cachified } from './cache.server'
import { compileMdx } from './complie-mdx.server'
import { downloadDirList, downloadMdxFileOrDirectory } from './github.server'
import { getBlurDataUrl } from './images'
import { typedBoolean } from './misc'
import { Themed } from './theme-provider'
import { type Timings } from './timing.server'

import { LRUCache } from 'lru-cache'
import * as mdxBundler from 'mdx-bundler/client/index.js'

type CachifiedOptions = {
	forceFresh?: boolean | string
	request?: Request
	ttl?: number
	timings?: Timings
}

const defaultTTL = 1000 * 60 * 60 * 24 * 14
const defaultStaleWhileRevalidate = 1000 * 60 * 60 * 24 * 30

const checkCompiledValue = (value: unknown) =>
	typeof value === 'object' &&
	(value === null || ('code' in value && 'frontmatter' in value))

async function compileMdxCached<T extends ContentType>({
	contentDir,
	slug,
	files,
	options,
}: {
	contentDir: T
	slug: string
	files: Array<GitHubFile>
	options: CachifiedOptions
}) {
	const key = `${contentDir}:${slug}:compiled`
	const page = await cachified({
		cache,
		ttl: defaultTTL,
		staleWhileRevalidate: defaultStaleWhileRevalidate,
		...options,
		key,
		checkValue: checkCompiledValue,
		getFreshValue: async () => {
			const compiledPage = await compileMdx<PickFrontmatter<T>>(slug, files)
			if (compiledPage) {
				if (
					compiledPage.frontmatter.bannerCloudinaryId &&
					!compiledPage.frontmatter.bannerBlurDataUrl
				) {
					try {
						compiledPage.frontmatter.bannerBlurDataUrl = await getBlurDataUrl(
							compiledPage.frontmatter.bannerCloudinaryId,
						)
					} catch (error: unknown) {
						console.error(
							'oh no, there was an error getting the blur image data url',
							error,
						)
					}
				}

				return compiledPage
			} else {
				return null
			}
		},
	})
	// if there's no page, remove it from the cache
	if (!page) {
		void cache.delete(key)
	}
	return page
}

export async function downloadMdxFilesCached(
	contentDir: ContentType,
	slug: string,
	options: CachifiedOptions,
) {
	const { forceFresh, ttl = defaultTTL, request, timings } = options
	const key = `${contentDir}:${slug}:downloaded`
	const downloaded = await cachified({
		cache,
		request,
		timings,
		ttl,
		staleWhileRevalidate: defaultStaleWhileRevalidate,
		forceFresh,
		key,
		checkValue: (value: unknown) => {
			if (typeof value !== 'object') {
				return `value is not an object`
			}
			if (value === null) {
				return `value is null`
			}

			const download = value as Record<string, unknown>
			if (!Array.isArray(download.files)) {
				return `value.files is not an array`
			}
			if (typeof download.entry !== 'string') {
				return `value.entry is not a string`
			}

			return true
		},
		getFreshValue: async () =>
			downloadMdxFileOrDirectory(`${contentDir}/${slug}`),
	})
	// if there aren't any files, remove it from the cache
	if (!downloaded.files.length) {
		void cache.delete(key)
	}
	return downloaded
}

const getDirListKey = (contentDir: string) => `${contentDir}:dir-list`

async function getMdxPage<T extends ContentType>(
	{
		contentDir,
		slug,
	}: {
		contentDir: T
		slug: string
	},
	options: CachifiedOptions,
): Promise<PageContent<T> | null> {
	const { forceFresh, ttl = defaultTTL, request, timings } = options
	const key = `mdx-page:${contentDir}:${slug}:compiled`
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
			const pageFiles = await downloadMdxFilesCached(contentDir, slug, options)
			const compiledPage = await compileMdxCached({
				contentDir,
				slug,
				...pageFiles,
				options,
			}).catch((err) => {
				console.error(`Failed to get a fresh value for mdx:`, {
					contentDir,
					slug,
				})
				return Promise.reject(err)
			})
			return compiledPage
		},
	})
	if (!page) {
		// if there's no page, let's remove it from the cache
		void cache.delete(key)
	}
	return page
}

async function getMdxDirList(contentDir: string, options?: CachifiedOptions) {
	const { forceFresh, ttl = defaultTTL, request, timings } = options ?? {}
	const key = getDirListKey(contentDir)
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
			const fullContentDirPath = `contents/${contentDir}`
			const dirList = (await downloadDirList(fullContentDirPath))
				.map(({ name, path }) => ({
					name,
					slug: path
						.replace(/\\/g, '/')
						.replace(`${fullContentDirPath}/`, '')
						.replace(/\.mdx$/, ''),
				}))
				.filter(({ name }) => name !== 'README.md')

			return dirList
		},
	})
}

async function getMdxPagesInDirectory<T extends ContentType>(
	contentDir: T,
	options: CachifiedOptions,
) {
	const dirList = await getMdxDirList(contentDir, options)

	// our octokit throttle plugin will make sure we don't hit the rate limit
	const pageDatas = await Promise.all(
		dirList.map(async ({ slug }) => {
			return {
				...(await downloadMdxFilesCached(contentDir, slug, options)),
				slug,
			}
		}),
	)

	const pages = await Promise.all(
		pageDatas.map((pageData) =>
			compileMdxCached({ contentDir, ...pageData, options }),
		),
	)
	return pages.filter(typedBoolean)
}

/**
 * This is useful for when you don't want to send all the code for a page to the client.
 */
function mapFromMdxPageToMdxListItem<T extends ContentType>(
	page: PageContent<T>,
) {
	const { code, ...mdxListItem } = page
	return mdxListItem.frontmatter
}

async function getContentMdxListItems<T extends ContentType>(
	type: T,
	options: CachifiedOptions,
) {
	const { request, forceFresh, ttl = defaultTTL, timings } = options
	const key = `${type}:mdx-list-items`
	return cachified({
		cache,
		request,
		timings,
		ttl,
		staleWhileRevalidate: defaultStaleWhileRevalidate,
		forceFresh,
		key,
		getFreshValue: async () => {
			let pages = await getMdxPagesInDirectory(type, options)

			pages = pages.sort((a, z) => {
				const aTime = new Date(a.frontmatter.publishedAt ?? '').getTime()
				const zTime = new Date(z.frontmatter.publishedAt ?? '').getTime()
				return aTime > zTime ? -1 : aTime === zTime ? 0 : 1
			})

			return pages.map((page) => mapFromMdxPageToMdxListItem<typeof type>(page))
		},
	})
}

const mdxComponents = {
	a: AnchorOrLink,
	Themed,
	ThemedBlogImage,
	CloudinaryImg,
}
/**
 * This should be rendered within a useMemo
 * @param code the code to get the component from
 * @returns the component
 */
function getMdxComponent(code: string) {
	const Component = mdxBundler.getMDXComponent(code)

	function HNHMdxComponent({
		components,
		...rest
	}: Parameters<typeof Component>['0']) {
		return (
			<Component components={{ ...mdxComponents, ...components }} {...rest} />
		)
	}

	return HNHMdxComponent
}

// This exists so we don't have to call new Function for the given code
// for every request for a given blog post/mdx file.
const mdxComponentCache = new LRUCache<
	string,
	ReturnType<typeof getMdxComponent>
>({
	max: 1000,
})

function useMdxComponent(code: string) {
	return React.useMemo(() => {
		if (mdxComponentCache.has(code)) {
			return mdxComponentCache.get(code)!
		}
		const component = getMdxComponent(code)
		mdxComponentCache.set(code, component)
		return component
	}, [code])
}

export { getContentMdxListItems, getMdxDirList, getMdxPage, useMdxComponent }
export type { CachifiedOptions }
