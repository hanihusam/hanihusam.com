import { motion } from 'motion/react'
import { type Ref } from 'react'

// Standing up gets a little spring in his step; sitting back down doesn't —
// a bounce on the way down read as an extra gesture.
const GROW_SPRING = { type: 'spring', duration: 0.6, bounce: 0.25 } as const
const REST_SPRING = { type: 'spring', duration: 0.4, bounce: 0 } as const
const WAVE_SPRING = { type: 'spring', duration: 0.45, bounce: 0.15 } as const
const INSTANT = { duration: 0 } as const

type Pose = Record<string, number>

// The idle wave: both arms lift together and settle back, while the body
// stays exactly where it is. Only the `grown` pose extends the figure.
//
// The shoulder (`y1`) deliberately stays at its resting 55 rather than the
// grown pose's 35. `grown` can lift the shoulder because the torso rises with
// it (torso top 50 → 30); raising the shoulder alone would float it off a
// body that hasn't moved. Instead each raised hand is the shoulder plus the
// grown pose's own limb vector — (-18, -15) left, (+18, -15) right — so the
// arms match the grown pose's angle and length exactly, just pivoting from
// the lower, unmoved shoulder.
const LEFT_ARM_REST = { y1: 55, x2: 15, y2: 70 }
const LEFT_ARM_RAISED = { y1: 55, x2: 7, y2: 40 }
const RIGHT_ARM_REST = { y1: 55, x2: 35, y2: 70 }
const RIGHT_ARM_RAISED = { y1: 55, x2: 43, y2: 40 }

/**
 * Line-art figure that stands up to full height. Instead of scaling the SVG
 * (which distorts the head), each joint's coordinate is animated between a
 * crouched `rest` pose and a tall `grown` pose — the feet stay planted at
 * y=100 and the head radius never changes, so it reads as the figure
 * literally growing up. The base attributes below are the `grown` pose.
 *
 * Presentational: the `rest`/`grown` variant comes from the height tile's
 * `animate` (fun-facts-section.tsx), and every decision about when to grow
 * or wave lives in useHeightTileMotion.
 *
 * `raised` drives the wave on BOTH arms — and only the arms. The head,
 * torso and legs never move outside of the grow, so the figure raises its
 * hands where it stands rather than stretching upward: growing is the
 * punchline, and the wave must not read as a weaker version of it.
 *
 * Unless grown, each arm holds an explicit `animate` target (raised or
 * resting), so lowering never depends on a parent variant change. While
 * grown, `animate` is undefined and the arms follow the same `grown` variant
 * as every other joint. The tile still pushes its variant to the arms
 * whenever its label changes, so `raised` must be false whenever `grown`
 * flips — useHeightTileMotion guarantees that (a hover spends the wave and
 * lowers the arms).
 *
 * `instant` (reduced motion, or the tile being off screen) makes every pose
 * change a jump cut.
 */
function StickFigure({
	ref,
	className,
	grown,
	raised,
	instant,
}: {
	ref?: Ref<SVGSVGElement>
	className?: string
	grown: boolean
	raised: boolean
	instant: boolean
}) {
	const toRest = instant ? INSTANT : REST_SPRING
	const toGrown = instant ? INSTANT : GROW_SPRING
	const toRaised = instant ? INSTANT : WAVE_SPRING
	const pose = (rest: Pose, grownPose: Pose) => ({
		rest: { ...rest, transition: toRest },
		grown: { ...grownPose, transition: toGrown },
	})
	const arm = (rest: Pose, up: Pose) => {
		if (grown) return undefined
		return raised
			? { ...up, transition: toRaised }
			: { ...rest, transition: toRest }
	}

	return (
		<svg
			ref={ref}
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
					variants={pose({ cy: 35 }, { cy: 15 })}
				/>
				{/* Torso */}
				<motion.line
					x1={25}
					y1={30}
					x2={25}
					y2={70}
					variants={pose({ y1: 50, y2: 80 }, { y1: 30, y2: 70 })}
				/>
				{/* Left leg — foot planted at y=100 */}
				<motion.line
					x1={25}
					y1={70}
					x2={15}
					y2={100}
					variants={pose({ y1: 80 }, { y1: 70 })}
				/>
				{/* Right leg — foot planted at y=100 */}
				<motion.line
					x1={25}
					y1={70}
					x2={35}
					y2={100}
					variants={pose({ y1: 80 }, { y1: 70 })}
				/>
				{/* Left arm — hangs at rest, raises fully when grown, and waves
				    from the resting shoulder. */}
				<motion.line
					x1={25}
					y1={35}
					x2={7}
					y2={20}
					variants={pose(LEFT_ARM_REST, { y1: 35, x2: 7, y2: 20 })}
					animate={arm(LEFT_ARM_REST, LEFT_ARM_RAISED)}
				/>
				{/* Right arm — mirrors the left, so the wave reads as one movement
				    rather than two. */}
				<motion.line
					x1={25}
					y1={35}
					x2={43}
					y2={20}
					variants={pose(RIGHT_ARM_REST, { y1: 35, x2: 43, y2: 20 })}
					animate={arm(RIGHT_ARM_REST, RIGHT_ARM_RAISED)}
				/>
			</g>
		</svg>
	)
}

export { StickFigure }
