import { AnchorOrLink } from '@/components/links/anchor-or-link'
import { Text } from '@/components/typography'
import { clsxm } from '@/utils/clsxm'

import { useReducedMotion } from 'motion/react'
import { type MouseEvent } from 'react'

export type HeadingScrollSpy = Array<{
	id: string
	level: number
	text: string
}>

type TocListProps = {
	toc?: HeadingScrollSpy
	activeSection: string | null
	minLevel: number
	onItemClick?: () => void
}

/**
 * Table of contents shared by the desktop sticky aside and mobile/tablet
 * drawer. Hash links scroll explicitly so cross-route restoration can remain
 * immediate without removing smooth same-page navigation.
 */
export function TocList({
	toc,
	activeSection,
	minLevel,
	onItemClick,
}: TocListProps) {
	const shouldReduceMotion = useReducedMotion()

	function handleItemClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
		onItemClick?.()
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		) {
			return
		}

		const heading = document.getElementById(id)
		if (!heading) return

		event.preventDefault()
		window.history.replaceState(window.history.state, '', `#${id}`)
		heading.scrollIntoView({
			behavior: shouldReduceMotion ? 'auto' : 'smooth',
			block: 'start',
		})
	}

	return (
		<nav aria-label="Table of contents" className="flex flex-col gap-4">
			<Text variant="overline">Table of Contents</Text>
			<div className="flex flex-col gap-2">
				{toc?.map(({ id, level, text }) => (
					<AnchorOrLink
						key={id}
						href={`#${id}`}
						onClick={(event) => handleItemClick(event, id)}
						style={{ marginLeft: (level - minLevel) * 12 }}
						className={clsxm(
							'text-xs leading-(--label-leading) tracking-[0.8px] transition-colors',
							'hover:text-(--text-title-secondary) focus:outline-none focus-visible:text-(--text-title-secondary)',
							activeSection === id
								? 'text-(--text-title-secondary)'
								: 'text-(--text-label)',
						)}
					>
						{text}
					</AnchorOrLink>
				))}
			</div>
		</nav>
	)
}
