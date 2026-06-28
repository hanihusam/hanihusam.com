import { type SubstackPost } from '@/types'
import { getFetchBlurDataUrl } from '@/utils/images'

import { XMLParser } from 'fast-xml-parser'
import readingTime from 'reading-time'

const FEED_URL = 'https://bapak2dev.substack.com/feed'
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

const parser = new XMLParser({ ignoreAttributes: false })

let cache: { data: SubstackPost[]; expires: number } | null = null

export async function getFeaturedSubstackPosts(
	limit = 3,
): Promise<SubstackPost[]> {
	if (cache && cache.expires > Date.now()) {
		return cache.data.slice(0, limit)
	}

	try {
		const res = await fetch(FEED_URL, {
			headers: { 'user-agent': 'hanihusam.com' },
		})
		if (!res.ok) throw new Error(`Substack feed ${res.status}`)

		const posts = await enrichWithBlur(parseFeed(await res.text()))
		cache = { data: posts, expires: Date.now() + CACHE_TTL }
		return posts.slice(0, limit)
	} catch (error) {
		console.error('Substack feed failed:', error)
		return cache ? cache.data.slice(0, limit) : []
	}
}

function parseFeed(xml: string): SubstackPost[] {
	const parsed = parser.parse(xml)
	const items = parsed?.rss?.channel?.item ?? []
	const list = Array.isArray(items) ? items : [items]

	return list.map(function toPost(item): SubstackPost {
		const content = stripHtml(item['content:encoded'] ?? item.description ?? '')

		return {
			title: item.title ?? '',
			url: item.link ?? '',
			publishedAt: item.pubDate ?? '',
			excerpt: stripHtml(item.description ?? '').slice(0, 160),
			coverImage: item.enclosure?.['@_url'] ?? null,
			readingTime: readingTime(content),
		}
	})
}

// Substack covers are remote URLs, so we generate the blur placeholder through
// Cloudinary's fetch delivery (mirrors how blog banners get bannerBlurDataUrl).
async function enrichWithBlur(posts: SubstackPost[]): Promise<SubstackPost[]> {
	return Promise.all(
		posts.map(async (post) => {
			if (!post.coverImage) return post

			try {
				return {
					...post,
					coverBlurDataUrl: await getFetchBlurDataUrl(post.coverImage),
				}
			} catch {
				return post
			}
		}),
	)
}

function stripHtml(input: string): string {
	return input.replace(/<[^<>]*>/g, '').trim()
}
