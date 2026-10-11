import { useInView, useReducedMotion } from 'motion/react'
import {
	useEffect,
	useRef,
	useState,
	useSyncExternalStore,
	type RefObject,
} from 'react'

import { useHoverIntent } from '@/hooks/useHoverIntent'
import { SCROLL_STAGE_INSET } from '@/utils/motion'

// How long the pointer has to stay on the tile before it counts as a real
// hover. A sweep across the bento never dwells this long; a pause does.
const HOVER_INTENT_DELAY = 150

// Touch has no hover, so the figure stands up on its own once it's fully on
// stage — after a beat, so the reader sees him crouched first.
const TOUCH_GROW_DELAY = 300

// The figure, not the tile, has to be in view: it sits in the tile's lower
// part (below the copy on phones), so "half the tile" can still mean none of
// the figure. Fully inside the stage clears the bottom nav and the top blur.
const FIGURE_ON_STAGE = {
	amount: 'all',
	margin: `-${SCROLL_STAGE_INSET}px 0px -${SCROLL_STAGE_INSET}px 0px`,
} as const

// The idle wave on hover devices: a short invitation, not a loop. Two waves,
// starting after the reader has had a moment with the tile, all inside ~4s.
const WAVE_COUNT = 2
const WAVE_DELAY_MS = 1200
const WAVE_RAISED_MS = 550
const WAVE_GAP_MS = 900

const CAN_HOVER = '(hover: hover) and (pointer: fine)'

function subscribeCanHover(onChange: () => void) {
	const query = window.matchMedia(CAN_HOVER)
	query.addEventListener('change', onChange)
	return () => query.removeEventListener('change', onChange)
}

function getCanHover() {
	return window.matchMedia(CAN_HOVER).matches
}

function getServerCanHover() {
	return false
}

/**
 * Touch: grows once the figure has been on stage for TOUCH_GROW_DELAY, and
 * only resets once the tile is fully off screen, so it never shrinks in
 * front of the reader and replays on the next pass.
 */
function useTouchGrow(trigger: boolean, onScreen: boolean) {
	const [grown, setGrown] = useState(false)

	useEffect(() => {
		if (!trigger) return
		const timer = setTimeout(() => setGrown(true), TOUCH_GROW_DELAY)
		return () => clearTimeout(timer)
	}, [trigger])

	useEffect(() => {
		if (onScreen) return
		const timer = setTimeout(() => setGrown(false), 0)
		return () => clearTimeout(timer)
	}, [onScreen])

	return grown
}

/**
 * Hover devices: WAVE_COUNT waves once the figure is on stage, then still.
 * The run is spent as soon as the first wave lifts or the reader hovers
 * (they found the interaction), and only re-arms once the tile is fully off
 * screen. Driven by a boolean + spring rather than a keyframes
 * loop: springs retarget from wherever the arms already are, which keyframes
 * on raw SVG attributes do not.
 */
function useFiniteWave(
	trigger: boolean,
	onScreen: boolean,
	interrupted: boolean,
) {
	const [raised, setRaised] = useState(false)
	const spent = useRef(false)

	useEffect(() => {
		if (!onScreen) spent.current = false
	}, [onScreen])

	useEffect(() => {
		if (interrupted) spent.current = true
		if (!trigger || interrupted || spent.current) return

		let remaining = WAVE_COUNT
		let timer: ReturnType<typeof setTimeout>
		const scheduleRaise = (delay: number) => {
			timer = setTimeout(() => {
				spent.current = true
				setRaised(true)
				timer = setTimeout(() => {
					setRaised(false)
					remaining -= 1
					if (remaining > 0) scheduleRaise(WAVE_GAP_MS)
				}, WAVE_RAISED_MS)
			}, delay)
		}
		scheduleRaise(WAVE_DELAY_MS)

		return () => {
			clearTimeout(timer)
			setRaised(false)
		}
	}, [trigger, interrupted])

	return raised
}

/**
 * Motion brief — height bento tile (about)
 *
 * Verdict:    animate. The grow is the tile's punchline ("I am 180 cm tall");
 *             the wave is a one-off invitation to find it.
 * Trigger:    hover devices: hover, after a HOVER_INTENT_DELAY dwell (see
 *             useHoverIntent). Touch devices (no fine, hovering pointer): the
 *             figure being fully on stage (inside SCROLL_STAGE_INSET of both
 *             viewport edges) for TOUCH_GROW_DELAY. Reduced motion: none.
 * Frequency:  once per pass over the tile.
 * Purpose:    the figure stands up next to the copy about his height — the
 *             joke lands as motion. The wave tells hover users there is
 *             something to find, then gets out of the way.
 *
 * Enter:      `rest` → `grown`: joints move to the standing pose.
 * Exit:       `grown` → `rest`, mirroring it.
 * Wave:       both arms only, from the resting shoulder, WAVE_COUNT times
 *             once the figure is on stage. Re-arms only once the tile is
 *             fully off screen; a hover spends it. Touch gets no wave —
 *             standing up already raises the arms.
 * Origin:     feet planted at y=100; each joint's coordinates move, the head
 *             radius never changes (stick-figure.tsx). No transform-origin.
 * Easing:     springs only. Grow 0.6s, bounce 0.25 — a little spring in his
 *             step (~0.6 units of overshoot). Return 0.4s, no bounce: exits
 *             are shorter and simpler, and a bounce on the way down read as
 *             an extra gesture. Wave raise 0.45s, bounce 0.15; wave lower
 *             uses the return spring.
 * Duration:   grow settles in ~0.65s, return in ~0.4s. Wave run: raise at
 *             1.2s, lower 1.75s, raise 2.65s, lower 3.2s, still by ~3.6s —
 *             inside WCAG 2.2.2's 5s.
 * Interrupt:  springs retarget from the current pose. Leaving mid-wave
 *             lowers the arms: they always hold an explicit target unless
 *             grown, so nothing is left raised by an inherited variant that
 *             didn't change.
 *
 * Reduced motion: standing tall, set instantly after hydration (instant
 *             transitions), no hover, no wave. The server ships `rest` and
 *             `initial` is always `rest`, so hydration never mismatches.
 * Off screen: the touch reset happens while the tile is fully off screen,
 *             so it's a jump cut too — coming back quickly never shows the
 *             tail of a crouch before the regrow.
 * SSR / no-JS: the crouched `rest` pose.
 * Stack:      Motion variants on the tile, propagated to the figure's SVG
 *             attributes. `canHover` comes from useSyncExternalStore (false
 *             on the server) so the first client render matches SSR.
 *
 * Open risk:  hybrid devices report `hover: hover` and get the hover path
 *             even when used by touch. useReducedMotion() is read once, so a
 *             mid-visit preference change applies on the next load. A
 *             viewport shorter than the figure plus both insets (~290px at
 *             md, ~350px on phones) never puts it on stage, so it stays
 *             crouched with no wave there.
 */
function useHeightTileMotion(
	tileRef: RefObject<HTMLElement | null>,
	figureRef: RefObject<SVGSVGElement | null>,
) {
	const instant = useReducedMotion() === true
	const canHover = useSyncExternalStore(
		subscribeCanHover,
		getCanHover,
		getServerCanHover,
	)
	const hover = useHoverIntent(HOVER_INTENT_DELAY)
	// The figure on stage starts things; the tile fully off screen re-arms
	// them, so nothing resets while the reader can still see it.
	const onStage = useInView(figureRef, FIGURE_ON_STAGE)
	const onScreen = useInView(tileRef)

	const touchGrown = useTouchGrow(!instant && !canHover && onStage, onScreen)
	const grown = instant || (canHover ? hover.active : touchGrown)
	const raised = useFiniteWave(!instant && canHover && onStage, onScreen, grown)
	const hoverable = canHover && !instant

	return {
		grown,
		raised,
		instant: instant || !onScreen,
		onHoverStart: hoverable ? hover.onHoverStart : undefined,
		onHoverEnd: hoverable ? hover.onHoverEnd : undefined,
	}
}

export { useHeightTileMotion }
