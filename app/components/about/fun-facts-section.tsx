import { BentoFact } from '@/components/about/bento-fact'
import { BentoTile } from '@/components/about/bento-tile'
import { CatPeekBody, CatPeekPaws } from '@/components/about/cat-peek'
import { HeightTile } from '@/components/about/height-tile'
import { SkateTrace } from '@/components/about/skate-trace'
import { Grid } from '@/components/grid'
import { clsxm } from '@/utils/clsxm'

export function FunFactsSection() {
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
				<BentoTile
					area="[grid-area:married]"
					className="flex flex-col items-center justify-end"
				>
					<img
						src="/images/ring-marriage.png"
						alt=""
						width={165}
						height={165}
						loading="lazy"
						decoding="async"
						className="absolute -top-10 left-0 w-full max-w-41.25"
					/>
					<BentoFact className="-mt-12">
						Married at 23. Dad at 24. People say I went to college and got a
						family as a bonus. They&apos;re not wrong. I was graduating while
						holding my wife&apos;s hand.
					</BentoFact>
				</BentoTile>

				{/* Top 10 — shield stacks on mobile, pokes out the top at md+ */}
				<BentoTile
					area="[grid-area:top10]"
					className="flex flex-col items-center justify-end gap-3 md:gap-0"
				>
					<img
						src="/images/ten-shield.png"
						alt=""
						width={125}
						height={163}
						loading="lazy"
						decoding="async"
						className="max-w-31.25 md:mb-5"
					/>
					<BentoFact>
						Top 10 graduate at my university. Finished in under 4 years with a
						3.63 GPA. I&apos;m still not entirely sure how.
					</BentoFact>
				</BentoTile>

				{/* Hani — name lettering above the copy */}
				<BentoTile
					area="[grid-area:hani]"
					className="flex flex-col items-center justify-center gap-4"
				>
					<img
						src="/images/hani-letter.png"
						alt="Hani"
						width={186}
						height={67}
						loading="lazy"
						decoding="async"
						className="w-full max-w-42.5"
					/>
					<BentoFact>
						My first name, Hani, is typically a woman&apos;s name in Indonesia.
						I&apos;ve been called &quot;mbak&quot; (Miss) on emails, calls, and
						chat more times than I can count. The confusion usually resolves
						itself once they see my face.
					</BentoFact>
				</BentoTile>

				{/* Skateboard — copy on top, photo filling the lower area */}
				<BentoTile
					area="[grid-area:skate]"
					className="relative flex flex-col items-center justify-center"
				>
					<BentoFact className="md:mt-8">
						Started skateboarding at 30. Also gym. Also running. All at the same
						time, all after 30. I rotate between them through the week. Turns
						out it&apos;s never too late to be a complete beginner at something.
						I&apos;m still very much a beginner.
					</BentoFact>
					<SkateTrace />
				</BentoTile>

				{/* Desk — photo banner up top, copy beneath */}
				<BentoTile
					area="[grid-area:desk]"
					className="flex flex-col items-center justify-center gap-4 overflow-hidden px-2 pt-2"
				>
					<img
						src="/images/keyboard-desk.webp"
						alt="Han's desk with a mechanical keyboard and no mouse"
						width={900}
						height={1200}
						loading="lazy"
						decoding="async"
						className="aspect-video w-full rounded-xl object-cover"
					/>
					<BentoFact className="w-[90%]">
						I have never worked in an office. Not once. I started freelancing
						straight out of university, no onboarding, no desk, no office ID
						card. It&apos;s made me unusually self-directed, and occasionally,
						unusually anxious.
					</BentoFact>
				</BentoTile>

				{/* Height — figure that stands up beside the copy */}
				<HeightTile />

				{/* Cat — leans out from behind this card's bottom-right corner.
				    Three paint layers in DOM order: body (occluded by the card),
				    the card itself, then the paws in front of it. */}
				<CatPeekBody />

				<BentoTile
					area="[grid-area:cat]"
					className="flex flex-col items-center justify-center lg:flex-row"
				>
					<img
						src="/images/cat-front.png"
						alt=""
						width={139}
						height={139}
						loading="lazy"
						decoding="async"
						className="pointer-events-none -mt-9 lg:hidden"
					/>
					<BentoFact>
						A cat person. Allergic to cats. I owned two for years anyway. Turns
						out love is stronger than histamines, until it isn&apos;t. These
						days I just admire from a safe distance whenever one walks by.
					</BentoFact>
				</BentoTile>

				<CatPeekPaws />
			</div>
		</Grid>
	)
}
