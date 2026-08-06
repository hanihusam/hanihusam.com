import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

const figureSpring = { type: 'spring', duration: 0.6, bounce: 0.25 } as const

// How long the pointer has to stay on the tile before it counts as a real
// hover — see useHoverIntent. A sweep across the bento never dwells this
// long, so it never triggers; only an intentional pause does.
const HOVER_INTENT_DELAY = 150

// The idle wave: both arms lift together and settle back, while the body
// stays exactly where it is. Only the hover-triggered `grown` pose extends
// the figure.
//
// The shoulder (`y1`) deliberately stays at its resting 55 rather than the
// grown pose's 35. `grown` can lift the shoulder because the torso rises with
// it (torso top 50 → 30); raising the shoulder alone would float it off a
// body that hasn't moved. Instead each raised hand is the shoulder plus the
// grown pose's own limb vector — (-18, -15) left, (+18, -15) right — so the
// arms match the hover pose's angle and length exactly, just pivoting from
// the lower, unmoved shoulder.
const WAVE_LEFT_REST = { y1: 55, x2: 15, y2: 70 }
const WAVE_LEFT_RAISED = { y1: 55, x2: 7, y2: 40 }
const WAVE_RIGHT_REST = { y1: 55, x2: 35, y2: 70 }
const WAVE_RIGHT_RAISED = { y1: 55, x2: 43, y2: 40 }
const WAVE_TRANSITION = {
	type: 'spring',
	duration: 0.45,
	bounce: 0.15,
} as const
const WAVE_REST_MS = 2500
const WAVE_RAISED_MS = 550

/**
 * Toggles between resting and raised on a timer while `active`, holding at
 * rest longer than it holds raised so the gesture reads as occasional rather
 * than metronomic.
 *
 * This drives the wave with a plain boolean + spring instead of a Motion
 * keyframes array with `repeat: Infinity`, which was the first approach and
 * looked right in isolation but broke the moment the animation had to
 * restart from a value that didn't match its first keyframe (exactly what
 * happens right after the hover-triggered grow lets go). Keyframes handle
 * that case for CSS-backed motion values; they do not for raw SVG attributes
 * like the `y1`/`x2`/`y2` these arms animate. A two-point target with a
 * spring has no such case to handle — springs retarget correctly from
 * wherever the value already is, which is the same mechanism `figureSpring`
 * already relies on elsewhere in this file.
 */
function useWave(active: boolean) {
	const [raised, setRaised] = useState(false)

	useEffect(() => {
		if (!active) {
			setRaised(false)
			return
		}
		let timer: ReturnType<typeof setTimeout>
		const scheduleRaise = () => {
			timer = setTimeout(() => {
				setRaised(true)
				timer = setTimeout(() => {
					setRaised(false)
					scheduleRaise()
				}, WAVE_RAISED_MS)
			}, WAVE_REST_MS)
		}
		scheduleRaise()
		return () => clearTimeout(timer)
	}, [active])

	return raised
}

/**
 * Line-art figure that stands up to full height on hover. Instead of scaling
 * the SVG (which distorts the head), each joint's coordinate is animated
 * between a crouched `rest` pose and a tall `grown` pose — the feet stay
 * planted at y=100 and the head radius never changes, so it reads as the
 * figure literally growing up. The `rest`/`grown` variant is set by an
 * ancestor's `animate` prop (see the height tile in `fun-facts-section.tsx`,
 * which drives it through `useHoverIntent`); the base attributes below are
 * the `grown` pose, so reduced motion shows the figure standing tall with no
 * animation.
 *
 * `idle` drives a periodic wave on BOTH arms — and only the arms. The head,
 * torso and legs never move outside of the hover-triggered grow, so the
 * figure raises its hands where it stands rather than stretching upward.
 * That separation is the whole point: growing is what hover means here, and
 * the idle gesture must not read as a weaker version of it.
 *
 * It's implemented by giving each arm an explicit `animate` target that
 * overrides its inherited `rest`/`grown` variant while `idle` is true; when
 * `idle` is false the `animate` prop is `undefined` and both arms fall back
 * to the same ancestor-driven variant every other joint uses, unchanged. The
 * two states are mutually exclusive by construction — the caller only sets
 * `idle` while NOT hovering — so the wave and the grow never fight over
 * these elements.
 */
function StickFigure({
	className,
	idle,
}: {
	className?: string
	idle: boolean
}) {
	const raised = useWave(idle)

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
				{/* Left arm — hangs at rest, raises fully when grown, and joins the
				    idle wave while resting. See `idle` above. */}
				<motion.line
					x1={25}
					y1={35}
					x2={7}
					y2={20}
					variants={{
						rest: { y1: 55, x2: 15, y2: 70 },
						grown: { y1: 35, x2: 7, y2: 20 },
					}}
					animate={
						idle ? (raised ? WAVE_LEFT_RAISED : WAVE_LEFT_REST) : undefined
					}
					transition={idle ? WAVE_TRANSITION : figureSpring}
				/>
				{/* Right arm — mirrors the left, raising with it so the idle gesture
				    reads as one movement rather than two. */}
				<motion.line
					x1={25}
					y1={35}
					x2={43}
					y2={20}
					variants={{
						rest: { y1: 55, x2: 35, y2: 70 },
						grown: { y1: 35, x2: 43, y2: 20 },
					}}
					animate={
						idle ? (raised ? WAVE_RIGHT_RAISED : WAVE_RIGHT_REST) : undefined
					}
					transition={idle ? WAVE_TRANSITION : figureSpring}
				/>
			</g>
		</svg>
	)
}

export { HOVER_INTENT_DELAY, StickFigure }
