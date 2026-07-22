import * as React from 'react'

import { Grid } from '@/components/grid'
import { ProjectCard } from '@/components/projects/project-card'
import { Reveal } from '@/components/reveal'
import { Spacer } from '@/components/spacer'
import { Paragraph } from '@/components/typography'
import { Button } from '@/components/ui/button'
import { FilterTag } from '@/components/ui/filter-tag'
import { CallToAction } from '@/components/works/cta-section'
import { WorksHero } from '@/components/works/hero-section'
import { clsxm } from '@/utils/clsxm'
import { getSignedSocialImage } from '@/utils/cloudinary.server'
import { getUrl } from '@/utils/helpers'
import { getContentMdxListItems } from '@/utils/mdx.server'
import { useUpdateQueryStringValueWithoutNavigation } from '@/utils/misc'
import { getRootRequestInfo, getSocialMetas } from '@/utils/seo'
import { getServerTimeHeader } from '@/utils/timing.server'

import { type Route } from './+types/works._index'

import { PlusIcon } from '@phosphor-icons/react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { data, type HeadersArgs, useSearchParams } from 'react-router'

// One spring family for the whole filtered grid, so entrance, exit, and the
// reflow of surviving cards all move with the same character instead of
// fighting each other. Exit is quicker so removed cards get out of the way
// before the reflow finishes.
const CARD_SPRING = { type: 'spring', duration: 0.5, bounce: 0.2 } as const
const CARD_EXIT_SPRING = {
	type: 'spring',
	duration: 0.35,
	bounce: 0.15,
} as const

const PAGE_TITLE = 'Works | Hani Husamuddin'
const PAGE_DESCRIPTION =
	'A selection of projects and case studies by Hani Husamuddin, spanning software engineering and product design.'

export const meta: Route.MetaFunction = ({ loaderData, matches }) => {
	return getSocialMetas({
		url: getUrl(getRootRequestInfo(matches)),
		title: PAGE_TITLE,
		description: PAGE_DESCRIPTION,
		image: loaderData?.socialImage,
	})
}

export function headers({ actionHeaders, loaderHeaders }: HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders
}

function toTags(techs: string) {
	return techs
		.split(',')
		.map((tech) => tech.trim().toLowerCase())
		.filter(Boolean)
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const timings = {}
	const projects = await getContentMdxListItems('projects', {
		request,
		timings,
	})

	const tags = new Set<string>()
	for (const project of projects) {
		for (const tag of toTags(project.techs)) {
			tags.add(tag)
		}
	}

	return data(
		{
			projects,
			tags: Array.from(tags),
			socialImage: getSignedSocialImage({ request, title: PAGE_TITLE }),
		},
		{
			headers: {
				'Cache-Control': 'private, max-age=3600',
				Vary: 'Cookie',
				'Server-Timing': getServerTimeHeader(timings),
			},
		},
	)
}

const PAGE_SIZE = 5

export default function WorksIndex({ loaderData }: Route.ComponentProps) {
	const { projects, tags } = loaderData

	const [searchParams] = useSearchParams()
	const [selectedTags, setSelectedTags] = React.useState<Set<string>>(
		() => new Set(searchParams.get('tags')?.split(',').filter(Boolean) ?? []),
	)

	useUpdateQueryStringValueWithoutNavigation(
		'tags',
		Array.from(selectedTags).join(','),
	)

	const [indexToShow, setIndexToShow] = React.useState(PAGE_SIZE)
	React.useEffect(() => {
		setIndexToShow(PAGE_SIZE)
	}, [selectedTags])

	function toggleTag(tag: string) {
		setSelectedTags((prev) => {
			const next = new Set(prev)
			if (next.has(tag)) {
				next.delete(tag)
			} else {
				next.add(tag)
			}
			return next
		})
	}

	const matchingProjects = React.useMemo(() => {
		if (selectedTags.size === 0) return projects
		return projects.filter((project) =>
			toTags(project.techs).some((tag) => selectedTags.has(tag)),
		)
	}, [projects, selectedTags])

	// Tags that still yield results given the current selection, so we can
	// disable the rest without hiding the user's active picks.
	const visibleTags =
		selectedTags.size === 0
			? new Set(tags)
			: new Set(matchingProjects.flatMap((project) => toTags(project.techs)))

	const visibleProjects = matchingProjects.slice(0, indexToShow)
	const hasMoreProjects = indexToShow < matchingProjects.length

	return (
		<React.Fragment>
			<WorksHero />

			<div className="bg-(--surface-secondary)">
				<Spacer size="lg" />

				{tags.length > 0 ? (
					<Grid>
						<Reveal className="col-span-full flex flex-col gap-6">
							<Paragraph prose={false}>Search projects by tags</Paragraph>
							<div className="flex flex-wrap gap-3">
								{tags.map((tag) => {
									const selected = selectedTags.has(tag)

									return (
										<FilterTag
											key={tag}
											tag={tag}
											selected={selected}
											onChange={() => toggleTag(tag)}
											disabled={!visibleTags.has(tag) ? !selected : false}
										/>
									)
								})}
							</div>
						</Reveal>
					</Grid>
				) : null}

				<Spacer size="lg" />

				<MotionConfig reducedMotion="user">
					<Grid className="gap-6">
						<AnimatePresence mode="popLayout">
							{visibleProjects.map((project, idx) => (
								<Reveal
									key={project.slug}
									layout
									transition={{
										default: { ...CARD_SPRING, delay: idx * 0.08 },
										layout: CARD_SPRING,
									}}
									exit={{
										opacity: 0,
										scale: 0.96,
										transition: CARD_EXIT_SPRING,
									}}
									className="col-span-full"
								>
									<ProjectCard
										className={clsxm({
											'lg:flex-row-reverse': idx % 2 !== 0,
										})}
										project={project}
									/>
								</Reveal>
							))}
						</AnimatePresence>
					</Grid>
				</MotionConfig>

				{hasMoreProjects ? (
					<>
						<Spacer size="lg" />
						<Grid>
							<div className="col-span-full flex justify-center">
								<Button
									variant="ghost"
									iconLeft={<PlusIcon />}
									onClick={() => setIndexToShow((i) => i + PAGE_SIZE)}
								>
									Load more projects
								</Button>
							</div>
						</Grid>
					</>
				) : null}

				<Spacer size="lg" />
			</div>

			<Reveal>
				<CallToAction />
			</Reveal>
		</React.Fragment>
	)
}
