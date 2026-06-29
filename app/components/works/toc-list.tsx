import { AnchorOrLink } from '@/components/links/anchor-or-link'
import { Text } from '@/components/typography'
import { clsxm } from '@/utils/clsxm'

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
 * Presentational table of contents shared by the desktop sticky aside and the
 * mobile/tablet drawer. Anchor ids (`link-<id>`) match the scroll-into-view
 * logic in the consumer.
 */
export function TocList({
	toc,
	activeSection,
	minLevel,
	onItemClick,
}: TocListProps) {
	return (
		<nav aria-label="Table of contents" className="flex flex-col gap-4">
			<Text variant="overline">Table of Contents</Text>
			<div className="flex flex-col gap-2">
				{toc?.map(({ id, level, text }) => (
					<AnchorOrLink
						key={id}
						to={`#${id}`}
						onClick={onItemClick}
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
