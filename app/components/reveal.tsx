import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'

// Matches the ease-out-quart / duration-slower motion tokens in theme.css.
const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const

type RevealProps = HTMLMotionProps<'div'> & {
	/** Stagger sibling reveals by nudging the start (seconds). */
	delay?: number
}

/**
 * Fades + rises its children into place as they scroll into view (once).
 * Under prefers-reduced-motion it renders statically visible — no transform,
 * no opacity ramp — so nothing is ever hidden from motion-sensitive users.
 */
function Reveal({ delay = 0, children, ...props }: RevealProps) {
	const shouldReduceMotion = useReducedMotion()

	return (
		<motion.div
			initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
			// Reduced motion: force the visible state immediately (no scroll trigger),
			// otherwise the SSR-rendered opacity:0 would persist and hide content.
			animate={shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
			whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{
				duration: shouldReduceMotion ? 0 : 0.5,
				ease: EASE_OUT_QUART,
				delay: shouldReduceMotion ? 0 : delay,
			}}
			{...props}
		>
			{children}
		</motion.div>
	)
}

export { Reveal }
