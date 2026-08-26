import { Grid } from '@/components/grid'
import { HeroDotField } from '@/components/hero-dot-field'
import { AnchorOrLink } from '@/components/links/anchor-or-link'
import { Display, H3, Text } from '@/components/typography'
import { ButtonLink, LinkButton } from '@/components/ui/button'
import Logo from '@/components/ui/logo'
import { getImageBuilder, getImgProps } from '@/utils/images'
import { DURATION_SLOW, DURATION_SLOWER, EASE_OUT_QUART } from '@/utils/motion'
import ArrowRightIcon from '@/assets/arrow-right-icon'

import { ArrowDownIcon } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'

const displayText = "I'm Han"

export function HeroSection() {
	const shouldReduceMotion = useReducedMotion()

	// Staggered fade+rise on first mount. Under prefers-reduced-motion we skip
	// `initial` so the SSR-visible content is never hidden (same contract as
	// the Reveal component).
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
		<div className="relative bg-(--surface-primary)">
			<HeroDotField className="pointer-events-none absolute inset-0" />
			<Grid className="min-h-screen place-content-center pt-20">
				<Logo className="absolute top-8" />

				<motion.img
					{...(shouldReduceMotion
						? {}
						: {
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								transition: { duration: DURATION_SLOW, ease: EASE_OUT_QUART },
							})}
					className="absolute top-0 right-0 hidden h-auto w-87.5 max-w-2/3 translate-x-[25%] translate-y-[20vh] md:top-auto md:right-auto md:bottom-0 md:left-0 md:block md:w-lg md:translate-x-[-16%] md:translate-y-0 lg:left-1/2 lg:w-3xl lg:-translate-x-1/2"
					{...getImgProps(
						getImageBuilder(
							'bapak2.dev/images/avatar-front_l3oexq',
							'Avatar of Han large',
						),
						{
							widths: [350, 512, 700, 768, 1024, 1536],
							sizes: [
								'(min-width: 1024px) 768px',
								'(min-width: 768px) 512px',
								'350px',
							],
						},
					)}
				/>

				<div className="z-10 col-span-full flex flex-col items-start gap-y-8 self-stretch md:h-[50vh] lg:flex-row lg:items-center">
					<motion.div
						{...fadeUp(0.1)}
						className="flex flex-col justify-end gap-y-8 lg:h-77.5"
					>
						<Display id="heroDisplay">
							{displayText.split('').map((char, i) => (
								<span
									key={i}
									className="inline-block whitespace-pre"
									style={{ '--index': i } as React.CSSProperties}
								>
									{char}
								</span>
							))}
						</Display>
						<ButtonLink
							to="#projects"
							className="hidden self-start md:inline-flex"
							iconRight={
								<>
									<ArrowDownIcon className="col-start-1 row-start-1 translate-y-[-200%] transition-transform duration-(--duration-base) ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:translate-y-0" />
									<ArrowDownIcon className="col-start-1 row-start-1 transition-transform duration-(--duration-fast) ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:translate-y-[200%]" />
								</>
							}
						>
							View My Works
						</ButtonLink>
					</motion.div>
					<motion.div
						{...fadeUp(0.18)}
						className="flex w-full flex-col gap-y-4 md:ml-auto md:w-90 lg:w-100"
					>
						<H3 className="text-(--text-paragraph)">
							A Frontend & UI Engineer based in Yogyakarta, Indonesia.
						</H3>
						<Text variant="lead">
							Engineer who designs. Designer who ships. End to end, with the
							Figma files and commit history to prove it.
						</Text>
						<AnchorOrLink className="hidden md:inline-flex" to="about">
							<LinkButton className="relative inline-flex items-center justify-center gap-1.5 text-(--text-paragraph)">
								More about me
								<ArrowRightIcon />
							</LinkButton>
						</AnchorOrLink>
						<div className="flex w-full gap-x-2 md:hidden">
							<ButtonLink
								to="#projects"
								size="sm"
								iconRight={<ArrowDownIcon />}
							>
								View My Works
							</ButtonLink>
							<ButtonLink to="about" size="sm" variant="ghost">
								More about me
							</ButtonLink>
						</div>
					</motion.div>
				</div>
			</Grid>
		</div>
	)
}
