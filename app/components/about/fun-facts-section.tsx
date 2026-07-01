import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import { Grid } from '@/components/grid'
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

const figureSpring = { type: 'spring', duration: 0.6, bounce: 0.25 } as const

/**
 * Line-art figure that stands up to full height on hover. Instead of scaling
 * the SVG (which distorts the head), each joint's coordinate is animated
 * between a crouched `rest` pose and a tall `grown` pose — the feet stay
 * planted at y=100 and the head radius never changes, so it reads as the
 * figure literally growing up. The variant is driven by the parent tile's
 * `whileHover`; the base attributes below are the `grown` pose, so reduced
 * motion shows the figure standing tall with no animation.
 */
function StickFigure({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden
			viewBox="0 0 50 100"
			fill="none"
			width={80}
			height={160}
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			preserveAspectRatio="xMidYMid meet"
		>
			<g
				stroke="currentColor"
				strokeWidth={3}
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				{/* Head — only its vertical position moves; radius stays fixed. */}
				<motion.circle
					cx={25}
					cy={15}
					r={15}
					transition={figureSpring}
					variants={{ rest: { cy: 35 }, grown: { cy: 15 } }}
				/>
				{/* Torso */}
				<motion.line
					x1={25}
					y1={30}
					x2={25}
					y2={70}
					transition={figureSpring}
					variants={{ rest: { y1: 50, y2: 80 }, grown: { y1: 30, y2: 70 } }}
				/>
				{/* Left leg — foot planted at y=100 */}
				<motion.line
					x1={25}
					y1={70}
					x2={15}
					y2={100}
					transition={figureSpring}
					variants={{ rest: { y1: 80 }, grown: { y1: 70 } }}
				/>
				{/* Right leg — foot planted at y=100 */}
				<motion.line
					x1={25}
					y1={70}
					x2={35}
					y2={100}
					transition={figureSpring}
					variants={{ rest: { y1: 80 }, grown: { y1: 70 } }}
				/>
				{/* Left arm — hangs down at rest, sweeps up into a raise when grown. */}
				<motion.line
					x1={25}
					y1={35}
					x2={7}
					y2={20}
					transition={figureSpring}
					variants={{
						rest: { y1: 55, x2: 15, y2: 70 },
						grown: { y1: 35, x2: 7, y2: 20 },
					}}
				/>
				{/* Right arm — hangs down at rest, sweeps up into a raise when grown. */}
				<motion.line
					x1={25}
					y1={35}
					x2={43}
					y2={20}
					transition={figureSpring}
					variants={{
						rest: { y1: 55, x2: 35, y2: 70 },
						grown: { y1: 35, x2: 43, y2: 20 },
					}}
				/>
			</g>
		</svg>
	)
}

export function FunFactsSection() {
	const shouldReduceMotion = useReducedMotion()

	return (
		<Grid as="section">
			<div
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
					<img
						src="/images/hani-drop.png"
						alt="Han skateboarding"
						width="100%"
						className="-mb-14 w-full max-w-61.25 translate-x-[8%] self-end md:-mb-10 md:max-w-75 md:translate-x-[7%]"
					/>
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
					area="[grid-area:height]"
					initial={shouldReduceMotion ? undefined : 'rest'}
					animate={shouldReduceMotion ? undefined : 'rest'}
					whileHover={shouldReduceMotion ? undefined : 'grown'}
					className="flex flex-col-reverse items-center justify-center gap-5 md:max-h-46 md:flex-row"
				>
					<StickFigure className="translate-y-8 overflow-visible text-(--text-paragraph) md:max-h-25" />
					<Fact>
						I am 180 cm tall. Above average for an Indonesian. I&apos;m told
						this is my most notable achievement.
					</Fact>
				</Tile>

				{/* Cat — copy with a cat peeking past the bottom-right corner */}
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
					<img
						src="/images/cat-peek.png"
						alt=""
						width={139}
						height={139}
						className="pointer-events-none -right-26 bottom-2 hidden lg:absolute lg:block"
					/>
				</Tile>
			</div>
		</Grid>
	)
}
