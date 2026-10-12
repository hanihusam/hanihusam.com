import { useReducedMotion, type Transition } from 'motion/react'

import { DURATION_SLOWER, EASE_OUT_QUART } from '@/utils/motion'

type EntranceFrom = { opacity: number; x?: number; y?: number }

/**
 * Props for a one-time mount entrance: `<motion.div {...enter(from, t)}>`.
 *
 * `initial` never branches on `useReducedMotion()`, which is null on the
 * server and read once on the client, so server and client always render the
 * same markup. Under reduced motion the transition collapses to zero and the
 * finished state lands as soon as the component hydrates.
 *
 * The server still ships the hidden `initial` so the entrance can play on a
 * hard load. `data-entrance` lets CSS force those elements visible under
 * reduced motion (`app.css`) and with JS disabled (`no-script.css`), so
 * neither case depends on JS.
 */
function useEntrance() {
	const shouldReduceMotion = useReducedMotion()

	const enter = (from: EntranceFrom, transition: Transition) => ({
		'data-entrance': '',
		initial: from,
		animate: {
			opacity: 1,
			...(from.x === undefined ? {} : { x: 0 }),
			...(from.y === undefined ? {} : { y: 0 }),
		},
		transition: shouldReduceMotion ? { duration: 0 } : transition,
	})

	// The staggered fade+rise shared by the home, about and works heroes.
	const fadeUp = (delay: number) =>
		enter(
			{ opacity: 0, y: 12 },
			{ duration: DURATION_SLOWER, ease: EASE_OUT_QUART, delay },
		)

	return { enter, fadeUp }
}

export { useEntrance }
