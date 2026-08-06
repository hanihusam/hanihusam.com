import {
	motion,
	useReducedMotion,
	useInView,
	type HTMLMotionProps,
} from 'motion/react'
import { useRef } from 'react'

import { CatPeekBody, CatPeekPaws } from '@/components/about/cat-peek'
import { SkateTrace } from '@/components/about/skate-trace'
import {
	HOVER_INTENT_DELAY,
	StickFigure,
} from '@/components/about/stick-figure'
import { Grid } from '@/components/grid'
import { useHoverIntent } from '@/hooks/useHoverIntent'
import { clsxm } from '@/utils/clsxm'
import { Paragraph } from '@/components/typography'

/**
 * Bento tile. `area` is the responsive `grid-area` utility for this tile.
 * Tiles are fluid grid cells; illustrations inside are positioned with
 * percentage offsets taken from the Figma frames so they stay exact while
 * scaling with the tile.
 */
function Tile({
	area,
	className,
	children,
	...motionProps
}: {
	area: string
	className?: string
	children: React.ReactNode
} & HTMLMotionProps<'div'>) {
	return (
		<motion.div
			className={clsxm(
				'bg-(--surface-secondary) relative rounded-2xl p-5',
				area,
				className,
			)}
			{...motionProps}
		>
			{children}
		</motion.div>
	)
}

/** Centered body copy used inside the tiles. */
function Fact({
	className,
	children,
}: {
	className?: string
	children: React.ReactNode
}) {
	return (
		<Paragraph className={clsxm('text-center', className)}>
			{children}
		</Paragraph>
	)
}

export function FunFactsSection() {
	const shouldReduceMotion = useReducedMotion()
	const heightHover = useHoverIntent(HOVER_INTENT_DELAY)
	const heightTileRef = useRef<HTMLDivElement>(null)
	// Idle sway only runs while the tile is actually on screen — no reason to
	// keep an infinite loop ticking somewhere the reader has scrolled past.
	const heightTileInView = useInView(heightTileRef)

	return (
		<Grid as="section">
			<div
				data-bento-grid
				className={clsxm(
					'grid col-span-full gap-4 lg:gap-5',
					// Mobile
					"grid-cols-2 [grid-template-areas:'married_top10'_'hani_hani'_'cat_height'_'skate_skate'_'desk_desk']",
					// Tablet — 3 columns at Figma ratios
					"md:grid-cols-10 md:grid-rows-[max(262px)_max(98px)_max(350px)_1fr] md:[grid-template-areas:'married_married_married_married_top10_top10_top10_hani_hani_hani'_'skate_skate_skate_skate_skate_skate_skate_hani_hani_hani'_'skate_skate_skate_skate_skate_skate_skate_cat_cat_cat'_'desk_desk_desk_desk_desk_desk_height_height_height_height']",
					// Desktop — 4 columns at Figma ratios; height sits in one row,
					// leaving the cell beneath it empty (matching the design)
					"lg:grid-cols-12 lg:grid-rows-[max(262px)_max(5vh)_max(98px)_1fr] lg:[grid-template-areas:'married_married_married_top10_top10_hani_hani_hani_skate_skate_skate_skate'_'desk_desk_desk_desk_desk_hani_hani_hani_skate_skate_skate_skate'_'desk_desk_desk_desk_desk_height_height_height_skate_skate_skate_skate'_'desk_desk_desk_desk_desk_height_height_height_cat_cat_cat_cat']",
				)}
			>
				{/* Married — ring stacks on mobile, tucks into the corner at md+ */}
				<Tile
					area="[grid-area:married]"
					className="flex flex-col items-center justify-end"
				>
					<img
						src="/images/ring-marriage.png"
						alt=""
						width={165}
						height={159}
						className="absolute -top-10 left-0 w-full max-w-41.25"
					/>
					<Fact className="-mt-12">
						Married at 23. Dad at 24. People say I went to college and got a
						family as a bonus. They&apos;re not wrong. I was graduating while
						holding my wife&apos;s hand.
					</Fact>
				</Tile>

				{/* Top 10 — shield stacks on mobile, pokes out the top at md+ */}
				<Tile
					area="[grid-area:top10]"
					className="flex flex-col items-center justify-end gap-3 md:gap-0"
				>
					<img
						src="/images/ten-shield.png"
						alt=""
						width={125}
						height={163}
						className="max-w-31.25 md:mb-5"
					/>
					<Fact>
						Top 10 graduate at my university. Finished in under 4 years with a
						3.63 GPA. I&apos;m still not entirely sure how.
					</Fact>
				</Tile>

				{/* Hani — name lettering above the copy */}
				<Tile
					area="[grid-area:hani]"
					className="flex flex-col items-center justify-center gap-4"
				>
					<img
						src="/images/hani-letter.png"
						alt="Hani"
						width={170}
						className="w-full max-w-42.5"
					/>
					<Fact>
						My first name, Hani, is typically a woman&apos;s name in Indonesia.
						I&apos;ve been called &quot;mbak&quot; (Miss) on emails, calls, and
						chat more times than I can count. The confusion usually resolves
						itself once they see my face.
					</Fact>
				</Tile>

				{/* Skateboard — copy on top, photo filling the lower area */}
				<Tile
					area="[grid-area:skate]"
					className="relative flex flex-col items-center justify-center"
				>
					<Fact className="md:mt-8">
						Started skateboarding at 30. Also gym. Also running. All at the same
						time, all after 30. I rotate between them through the week. Turns
						out it&apos;s never too late to be a complete beginner at something.
						I&apos;m still very much a beginner.
					</Fact>
					<SkateTrace />
				</Tile>

				{/* Desk — photo banner up top, copy beneath */}
				<Tile
					area="[grid-area:desk]"
					className="flex flex-col items-center justify-center gap-4 overflow-hidden px-2 pt-2"
				>
					<img
						src="/images/keyboard-desk.jpg"
						alt="Han's desk with a mechanical keyboard and no mouse"
						width={1200}
						height={900}
						className="aspect-video w-full rounded-xl object-cover"
					/>
					<Fact className="w-[90%]">
						I have never worked in an office. Not once. I started freelancing
						straight out of university, no onboarding, no desk, no office ID
						card. It&apos;s made me unusually self-directed, and occasionally,
						unusually anxious.
					</Fact>
				</Tile>

				{/* Height — figure beside the copy */}
				<Tile
					ref={heightTileRef}
					area="[grid-area:height]"
					initial={shouldReduceMotion ? undefined : 'rest'}
					animate={
						shouldReduceMotion
							? undefined
							: heightHover.active
								? 'grown'
								: 'rest'
					}
					onHoverStart={
						shouldReduceMotion ? undefined : heightHover.onHoverStart
					}
					onHoverEnd={shouldReduceMotion ? undefined : heightHover.onHoverEnd}
					className="flex flex-col-reverse items-center justify-center gap-5 md:max-h-46 md:flex-row md:justify-center"
				>
					<StickFigure
						className="self-center overflow-visible text-(--text-paragraph) md:max-h-25 md:self-end"
						idle={
							!shouldReduceMotion && !heightHover.active && heightTileInView
						}
					/>
					<Fact>
						I am 180 cm tall. Above average for an Indonesian. I&apos;m told
						this is my most notable achievement.
					</Fact>
				</Tile>

				{/* Cat — leans out from behind this card's bottom-right corner.
				    Three paint layers in DOM order: body (occluded by the card),
				    the card itself, then the paws in front of it. */}
				<CatPeekBody />

				<Tile
					area="[grid-area:cat]"
					className="flex flex-col items-center justify-center lg:flex-row"
				>
					<img
						src="/images/cat-front.png"
						alt=""
						width={139}
						height={139}
						className="pointer-events-none -mt-9 lg:hidden"
					/>
					<Fact>
						A cat person. Allergic to cats. I owned two for years anyway. Turns
						out love is stronger than histamines, until it isn&apos;t. These
						days I just admire from a safe distance whenever one walks by.
					</Fact>
				</Tile>

				<CatPeekPaws />
			</div>
		</Grid>
	)
}
