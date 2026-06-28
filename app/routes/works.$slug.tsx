import * as React from 'react'

import { Spacer } from '@/components/spacer'
import { H1, Text } from '@/components/typography'
import { ButtonLink } from '@/components/ui/button'
import { ConcentricCircles } from '@/components/ui/concentric-circles'
import { DotGrid } from '@/components/ui/dot-grid'
import { Tag } from '@/components/ui/tag'
import { WorkTocDrawer } from '@/components/works/toc-drawer'
import { type HeadingScrollSpy, TocList } from '@/components/works/toc-list'
import { incrementMetaFlag } from '@/constants/env'
import useScrollSpy from '@/hooks/useScrollSpy'
import {
	getContentViews,
	incrementLikes,
	incrementViews,
} from '@/utils/blog.server'
import { useMdxComponent } from '@/utils/mdx'
import { getMdxPage } from '@/utils/mdx.server'
import { getSessionId } from '@/utils/session.server'
import { getServerTimeHeader } from '@/utils/timing.server'

import { type Route } from './+types/works.$slug'

import { SiGithub } from '@icons-pack/react-simple-icons'
import { ArrowLeftIcon, ArrowSquareOutIcon } from '@phosphor-icons/react'
import { data, useFetcher } from 'react-router'

export async function action({ params, request }: Route.ActionArgs) {
	if (!params.slug) {
		throw new Error('params.slug is not defined')
	}
	const formData = await request.formData()
	const intent = formData.get('intent')
	const sessionId = getSessionId(request)
	const { slug } = params

	switch (intent) {
		case 'mark-as-read': {
			if (!incrementMetaFlag) {
				await incrementViews({ slug, sessionId })
				return { success: true }
			}
			return null
		}
		// Kept for a future "like" UI — the server side stays wired up.
		case 'like-post': {
			return await incrementLikes({ slug, sessionId })
		}
		default: {
			throw new Error(`Unknown intent: ${intent}`)
		}
	}
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	if (!params.slug) {
		throw new Error('params.slug is not defined')
	}
	const timings = {}
	const sessionId = getSessionId(request)

	const meta = await getContentViews({ slug: params.slug, sessionId })
	const page = await getMdxPage(
		{ contentDir: 'projects', slug: params.slug },
		{ request, timings },
	)

	const headers = {
		'Cache-Control': 'private, max-age=3600',
		Vary: 'Cookie',
		'Server-Timing': getServerTimeHeader(timings),
	}

	if (!page) {
		throw data(null, { status: 404, headers })
	}

	return data({ page, meta }, { status: 200, headers })
}

function useOnRead({
	parentElRef,
	time,
	onRead,
}: {
	parentElRef: React.RefObject<HTMLDivElement | null>
	time: number | undefined
	onRead: () => void
}) {
	React.useEffect(() => {
		const parentEl = parentElRef.current
		if (!parentEl || !time) return

		const visibilityEl = document.createElement('div')

		let scrolledTheMain = false
		const observer = new IntersectionObserver((entries) => {
			const isVisible = entries.some(
				(entry) => entry.target === visibilityEl && entry.isIntersecting,
			)
			if (isVisible) {
				scrolledTheMain = true
				maybeMarkAsRead()
				observer.disconnect()
				visibilityEl.remove()
			}
		})

		let startTime = new Date().getTime()
		let timeoutTime = time * 0.6
		let timerId: ReturnType<typeof setTimeout>
		let timerFinished = false

		function startTimer() {
			timerId = setTimeout(() => {
				timerFinished = true
				document.removeEventListener('visibilitychange', handleVisibilityChange)
				maybeMarkAsRead()
			}, timeoutTime)
		}

		function handleVisibilityChange() {
			if (document.hidden) {
				clearTimeout(timerId)
				const timeElapsedSoFar = new Date().getTime() - startTime
				timeoutTime = timeoutTime - timeElapsedSoFar
			} else {
				startTime = new Date().getTime()
				startTimer()
			}
		}

		function maybeMarkAsRead() {
			if (timerFinished && scrolledTheMain) {
				cleanup()
				onRead()
			}
		}

		parentEl.append(visibilityEl)
		observer.observe(visibilityEl)
		startTimer()
		document.addEventListener('visibilitychange', handleVisibilityChange)

		function cleanup() {
			document.removeEventListener('visibilitychange', handleVisibilityChange)
			clearTimeout(timerId)
			observer.disconnect()
			visibilityEl.remove()
		}
		return cleanup
	}, [time, onRead, parentElRef])
}

export default function WorksSlug({ loaderData }: Route.ComponentProps) {
	const { page } = loaderData
	const { frontmatter, code } = page
	const Component = useMdxComponent(code)

	//#region  //*=========== Read/view post ===========
	const markAsRead = useFetcher()
	const markAsReadRef = React.useRef(markAsRead)

	React.useEffect(() => {
		markAsReadRef.current = markAsRead
	}, [markAsRead])

	const readMarker = React.useRef<HTMLDivElement>(null)

	useOnRead({
		parentElRef: readMarker,
		time: frontmatter.readingTime?.time,
		onRead: React.useCallback(() => {
			markAsReadRef.current.submit(
				{ intent: 'mark-as-read' },
				{ method: 'POST' },
			)
		}, []),
	})
	//#endregion  //*=========== Read/view post ===========

	//#region  //*=========== Scrollspy ===========
	const activeSection = useScrollSpy()

	const [toc, setToc] = React.useState<HeadingScrollSpy>()
	const minLevel =
		toc?.reduce((min, item) => (item.level < min ? item.level : min), 10) ?? 0

	React.useEffect(() => {
		const headings = document.querySelectorAll(
			'.prose h1, .prose h2, .prose h3',
		)
		const headingArr: HeadingScrollSpy = []
		headings.forEach((heading) => {
			headingArr.push({
				id: heading.id,
				level: +heading.tagName.replace('H', ''),
				text: heading.textContent + '',
			})
		})
		setToc(headingArr)
	}, [frontmatter.slug])
	//#endregion  //*======== Scrollspy ===========

	const techs = frontmatter.techs
		? frontmatter.techs
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean)
		: []

	return (
		<main className="relative grow overflow-hidden">
			<DotGrid
				color="sunset"
				rows={8}
				cols={8}
				className="pointer-events-none absolute top-12 right-[6%] hidden md:block"
			/>
			<ConcentricCircles
				accent
				size={263}
				ringGap={34}
				className="pointer-events-none absolute top-64 -left-34 hidden md:block"
			/>

			<div className="relative mx-auto w-full max-w-(--container-site) px-6 sm:px-8">
				{/* ─── Project info ─────────────────────────────────────────── */}
				<div className="flex flex-col gap-10 py-12 lg:py-20">
					<div>
						<ButtonLink
							to="/works"
							variant="ghost"
							size="md"
							iconLeft={<ArrowLeftIcon />}
						>
							Back to the list
						</ButtonLink>
					</div>

					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-3">
							<H1>{frontmatter.title}</H1>
							<Text as="p" variant="lead" className="max-w-3xl">
								{frontmatter.description}
							</Text>
						</div>

						<div className="flex flex-col gap-4">
							{frontmatter.role ? (
								<div className="flex items-center gap-2">
									<Text
										variant="label"
										className="tracking-[1.6px] text-(--text-paragraph) uppercase"
									>
										Role:
									</Text>
									<Text variant="overline" className="normal-case">
										{frontmatter.role}
									</Text>
								</div>
							) : null}

							<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
								{techs.length > 0 ? (
									<div className="flex flex-wrap items-center gap-2">
										{techs.map((tech) => (
											<Tag key={tech}>{tech}</Tag>
										))}
									</div>
								) : null}

								{frontmatter.github || frontmatter.link ? (
									<div className="flex flex-wrap items-center gap-6">
										{frontmatter.github ? (
											<a
												href={frontmatter.github}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-1.5 text-base text-(--text-paragraph) transition-colors hover:text-(--text-link)"
											>
												<SiGithub size={20} />
												Repository
											</a>
										) : null}
										{frontmatter.link ? (
											<a
												href={frontmatter.link}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-1.5 text-base text-(--text-paragraph) transition-colors hover:text-(--text-link)"
											>
												<ArrowSquareOutIcon className="size-5" />
												Open Live Site
											</a>
										) : null}
									</div>
								) : null}
							</div>
						</div>
					</div>
				</div>

				{/* ─── Content + Table of contents ─────────────────────────── */}
				<div
					ref={readMarker}
					className="pb-20 lg:grid lg:grid-cols-[minmax(0,800px)_250px] lg:gap-16"
				>
					<article className="prose prose-light dark:prose-dark wrap-break-words w-full">
						<Component />
					</article>

					<aside className="hidden lg:block">
						<div className="sticky top-24">
							<TocList
								toc={toc}
								activeSection={activeSection}
								minLevel={minLevel}
							/>
						</div>
					</aside>
				</div>
			</div>

			<WorkTocDrawer
				toc={toc}
				activeSection={activeSection}
				minLevel={minLevel}
			/>

			<Spacer size="sm" />
		</main>
	)
}
