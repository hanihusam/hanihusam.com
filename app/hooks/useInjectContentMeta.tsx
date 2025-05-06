import * as React from 'react'

import {
	type ContentMeta,
	type ContentType,
	type InjectedMeta,
	type PickFrontmatter,
} from '@/types'
import { cleanBlogPrefix } from '@/utils/clean-blog-prefix'
import { pickContentMeta } from '@/utils/content-meta'

import { PrismaClient } from '@prisma/client'
import { useFetcher } from 'react-router'

const prismaClient = new PrismaClient()

export async function loader() {
	const _content = await prismaClient.contentMeta.findMany({
		include: {
			_count: {
				select: {
					views: true,
					likes: true,
				},
			},
		},
	})

	const content = _content.map((meta) => ({
		slug: meta.slug,
		views: meta._count.views,
		likes: meta._count.likes,
	}))

	// Sort alphabetically
	content.sort((a, b) => a.slug.localeCompare(b.slug))

	return content
}

export default function useInjectContentMeta<T extends ContentType>(
	type: T,
	frontmatter: Array<PickFrontmatter<T>>,
) {
	const { data: contentMeta, state } = useFetcher<Array<ContentMeta>>()
	const isLoading = state === 'loading' || state === 'submitting'
	const meta = React.useMemo(
		() => pickContentMeta(contentMeta, type),
		[contentMeta, type],
	)

	type PopulatedContent = Array<PickFrontmatter<T> & InjectedMeta>

	const [populatedContent, setPopulatedContent] =
		React.useState<PopulatedContent>(() => [...frontmatter] as PopulatedContent)

	React.useEffect(() => {
		if (meta) {
			const mapped = frontmatter.map((fm) => {
				const views = meta.find(
					(meta) => meta.slug === cleanBlogPrefix(fm.slug),
				)?.views
				const likes = meta.find(
					(meta) => meta.slug === cleanBlogPrefix(fm.slug),
				)?.likes
				return { ...fm, views, likes }
			})

			setPopulatedContent(mapped)
		}
	}, [meta, isLoading, frontmatter])

	return populatedContent
}
