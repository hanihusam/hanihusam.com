import { motion } from 'motion/react'
import { useRef } from 'react'

import { BentoFact } from '@/components/about/bento-fact'
import { BENTO_TILE_CLASS } from '@/components/about/bento-tile'
import { StickFigure } from '@/components/about/stick-figure'
import { useHeightTileMotion } from '@/hooks/useHeightTileMotion'
import { clsxm } from '@/utils/clsxm'

/**
 * The height tile: a stick figure that stands up next to "180 cm tall". It's
 * its own component so the hover, in-view and wave state useHeightTileMotion
 * holds re-renders this tile only, not the whole bento.
 */
export function HeightTile() {
	const tileRef = useRef<HTMLDivElement>(null)
	const figureRef = useRef<SVGSVGElement>(null)
	const height = useHeightTileMotion(tileRef, figureRef)

	return (
		<motion.div
			ref={tileRef}
			// Always `rest` first: it's the pose the server ships, so hydration
			// matches even when reduced motion jumps straight to `grown`.
			initial="rest"
			animate={height.grown ? 'grown' : 'rest'}
			onHoverStart={height.onHoverStart}
			onHoverEnd={height.onHoverEnd}
			className={clsxm(
				BENTO_TILE_CLASS,
				'[grid-area:height] flex flex-col-reverse items-center justify-center gap-5 md:max-h-46 md:flex-row md:justify-center',
			)}
		>
			<StickFigure
				ref={figureRef}
				className="self-center overflow-visible text-(--text-paragraph) md:max-h-25 md:self-end"
				grown={height.grown}
				raised={height.raised}
				instant={height.instant}
			/>
			<BentoFact>
				I am 180 cm tall. Above average for an Indonesian. I&apos;m told this is
				my most notable achievement.
			</BentoFact>
		</motion.div>
	)
}
