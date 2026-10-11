import { Grid } from '@/components/grid'
import { H1, Text } from '@/components/typography'
import { ConcentricCircles } from '@/components/ui/concentric-circles'
import { DotGrid } from '@/components/ui/dot-grid'
import { DURATION_SLOWER, EASE_OUT_QUART } from '@/utils/motion'

import { motion, useReducedMotion } from 'motion/react'

export function WorksHero() {
	const shouldReduceMotion = useReducedMotion()

	// Staggered entrance on first mount, matching the Home/About hero pattern.
	// Skipping `initial` under reduced motion was meant to keep SSR content
	// visible, but useReducedMotion() is null on the server, so SSR always
	// ships opacity:0 — see Known gaps in docs/agents/motion.md.
	const fadeUp = (delay: number) =>
		shouldReduceMotion
			? {}
			: {
					initial: { opacity: 0, y: 12 },
					animate: { opacity: 1, y: 0 },
					transition: {
						duration: DURATION_SLOWER,
						ease: EASE_OUT_QUART,
						delay,
					},
				}

	return (
		<div className="relative flex min-h-120 items-center justify-center overflow-hidden pt-32 pb-20 lg:py-0">
			<ConcentricCircles
				accent
				size={485}
				className="absolute top-60 hidden md:-left-60 md:block lg:-left-36"
			/>
			<ConcentricCircles
				size={250}
				ringGap={34}
				className="absolute top-0 -right-32 hidden lg:block"
			/>
			<DotGrid
				color="sky"
				rows={9}
				cols={7}
				className="absolute top-36 left-[80%] md:top-32 lg:left-[62%]"
			/>

			<Grid className="relative">
				<div className="col-span-full flex flex-col items-center justify-center gap-2 text-center">
					<motion.div {...fadeUp(0.1)}>
						<H1>
							Curated <span className="text-sunset-400">Projects</span>
						</H1>
					</motion.div>
					<motion.div {...fadeUp(0.18)}>
						<Text variant="lead">Work that speaks for itself</Text>
					</motion.div>
				</div>
			</Grid>
		</div>
	)
}
