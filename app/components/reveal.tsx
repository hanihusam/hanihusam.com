import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'

import {
	DURATION_BASE,
	DURATION_SLOWER,
	EASE_OUT_QUART,
	STAGGER_STEP,
} from '@/utils/motion'

type RevealVariant = 'rise' | 'stagger' | 'settle'

type RevealProps = HTMLMotionProps<'div'> & {
	variant?: RevealVariant
	/** Position within a staggered group; only used by the `stagger` variant. */
	index?: number
	/** Explicit delay override (seconds). Takes precedence over `stagger`'s index math. */
	delay?: number
}

/**
 * Fades its children into place as they scroll into view (once), with three
 * variants for different content types:
 * - `rise` (default): 24px travel, for standalone sections.
 * - `stagger`: same travel, siblings offset by `index * STAGGER_STEP`. For grids.
 * - `settle`: shorter (8px), faster travel. For dense text blocks that
 *   shouldn't feel like they're floating in.
 *
 * Under prefers-reduced-motion it renders statically visible — no transform,
 * no opacity ramp, even when a caller passes its own `transition` — so nothing
 * is ever hidden from motion-sensitive users.
 * `initial` stays unconditional so server and client markup match, and
 * `data-entrance` lets CSS show the server HTML under reduced motion and with
 * JS disabled (see useEntrance).
 */
function Reveal({
	variant = 'rise',
	index = 0,
	delay,
	transition,
	children,
	...props
}: RevealProps) {
	const shouldReduceMotion = useReducedMotion()

	const y = variant === 'settle' ? 8 : 24
	const duration = variant === 'settle' ? DURATION_BASE : DURATION_SLOWER
	const resolvedDelay =
		delay ?? (variant === 'stagger' ? index * STAGGER_STEP : 0)

	return (
		<motion.div
			data-entrance=""
			initial={{ opacity: 0, y }}
			// Reduced motion: force the visible state immediately (no scroll trigger),
			// otherwise the SSR-rendered opacity:0 would persist and hide content.
			animate={shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
			whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			{...props}
			transition={
				shouldReduceMotion
					? { duration: 0 }
					: (transition ?? {
							duration,
							ease: EASE_OUT_QUART,
							delay: resolvedDelay,
						})
			}
		>
			{children}
		</motion.div>
	)
}

export { Reveal }
