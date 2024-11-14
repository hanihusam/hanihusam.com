import * as React from 'react'

import TOCLink from '@/components/links/toc-link'

import { H4 } from './typography'

export type HeadingScrollSpy = Array<{
	id: string
	level: number
	text: string
}>

type TableOfContentsProps = {
	toc?: HeadingScrollSpy
	activeSection: string | null
	minLevel: number
}

export default function TableOfContents({
	toc,
	activeSection,
	minLevel,
}: TableOfContentsProps) {
	//#region  //*=========== Scroll into view ===========
	const lastPosition = React.useRef<number>(0)

	React.useEffect(() => {
		const container = document.getElementById('toc-container')
		const activeLink = document.getElementById(`link-${activeSection}`)

		if (container && activeLink) {
			// Get container properties
			const cTop = container.scrollTop
			const cBottom = cTop + container.clientHeight

			// Get activeLink properties
			const lTop = activeLink.offsetTop - container.offsetTop
			const lBottom = lTop + activeLink.clientHeight

			// Check if in view
			const isTotal = lTop >= cTop && lBottom <= cBottom

			const isScrollingUp = lastPosition.current > window.scrollY
			lastPosition.current = window.scrollY

			if (!isTotal) {
				// Scroll by the whole clientHeight
				const offset = 25
				const top = isScrollingUp
					? lTop - container.clientHeight + offset
					: lTop - offset

				container.scrollTo({ top, behavior: 'smooth' })
			}
		}
	}, [activeSection])
	//#endregion  //*======== Scroll into view ===========

	return (
		<div
			id="toc-container"
			className="hidden max-h-[calc(100vh-9rem-113px)] overflow-auto pb-4 lg:block"
		>
			<H4 variant="secondary">Table of Contents</H4>
			<div className="mt-6 flex flex-col space-y-3">
				{toc
					? toc.map(({ id, level, text }) => (
							<TOCLink
								id={id}
								key={id}
								activeSection={activeSection}
								level={level}
								minLevel={minLevel}
								text={text}
							/>
					  ))
					: null}
			</div>
		</div>
	)
}
