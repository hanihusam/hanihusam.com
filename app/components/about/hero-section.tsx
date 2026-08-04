import { Grid } from '@/components/grid'
import { Display, Text } from '@/components/typography'
import { DotGrid } from '@/components/ui/dot-grid'
import { DURATION_SLOWER, EASE_OUT_QUART } from '@/utils/motion'

import { motion, useReducedMotion } from 'motion/react'

export function AboutHero() {
	const shouldReduceMotion = useReducedMotion()

	// Staggered entrance on first mount. Skipping `initial` under reduced motion
	// keeps the SSR-visible content from ever being hidden (same contract as Reveal).
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

	// Avatar slides in from the right. The transform lives on this wrapper, not on
	// the box below — that box uses responsive Tailwind `translate-x-*` utilities
	// which Motion's inline transform would otherwise clobber.
	const slideInFromRight = shouldReduceMotion
		? {}
		: {
				initial: { opacity: 0, x: 48 },
				animate: { opacity: 1, x: 0 },
				transition: { duration: 0.6, ease: EASE_OUT_QUART },
			}

	return (
		<Grid as="section" className="relative pt-40 md:pb-16 lg:pb-40">
			<DotGrid
				color="sunset"
				rows={9}
				cols={7}
				className="absolute top-0 right-0 hidden lg:block"
			/>

			<div className="relative col-span-full flex items-end">
				{/* Floating cutout avatar over a tinted square */}
				<motion.div {...slideInFromRight} className="absolute top-0 right-0">
					<div className="relative flex aspect-square w-100 translate-x-[28%] -translate-y-1/3 items-center justify-center overflow-visible rounded-2xl border-(--border-primary) bg-sky-50 md:translate-x-[40%] md:translate-y-0 lg:translate-x-0 dark:bg-sky-900">
						<img
							src="/images/avatar-side.png"
							alt="Portrait of Han"
							width={512}
							height={512}
							className="absolute top-1/2 left-1/2 flex max-w-none shrink-0 -translate-x-1/2 -translate-y-1/2"
						/>
					</div>
				</motion.div>

				<div className="relative z-1 mt-82 flex flex-col gap-6 md:gap-12">
					<motion.div {...fadeUp(0.1)}>
						<Display>Hi there! I&apos;m Han.</Display>
					</motion.div>

					<motion.div
						{...fadeUp(0.18)}
						className="flex flex-col gap-4 md:max-w-[60%]"
					>
						<Text variant="lead" as="p">
							I started building on the web in 2018 and haven&apos;t stopped
							since.
						</Text>
						<Text variant="lead" as="p">
							I&apos;ve worked as a frontend engineer and UI designer across
							companies and industries, leading frontend teams, building design
							systems, and shipping production interfaces for clients from all
							over the world.
						</Text>
						<Text variant="lead" as="p">
							Besides freelancing, I&apos;m building{' '}
							<a
								href="https://coverse.gumroad.com/"
								className="underlined text-sunset-400 font-medium"
							>
								Coverse
							</a>
							, a studio specializing in layout and deck templates, from
							Yogyakarta, Indonesia.
						</Text>
					</motion.div>
				</div>
			</div>
		</Grid>
	)
}
