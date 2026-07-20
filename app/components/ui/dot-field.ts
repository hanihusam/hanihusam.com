import { gsap } from 'gsap'

export type DotColor = 'sky' | 'sunset'

// Dot styling mirrors DotGrid: 4px rounded squares on an 18px pitch.
export const PITCH = 18
export const DOT_SIZE = 4
export const DOT_RADIUS = 1.344

// Magnetic push: dots within INFLUENCE px of the cursor shove away, up to
// MAX_PUSH px at the center, easing to zero at the edge.
export const INFLUENCE = 130
export const MAX_PUSH = 18

// Keep the render loop alive briefly after the last activity, then stop.
export const KEEP_ALIVE_MS = 700

export const DOT_FALLBACK: Record<DotColor, string> = {
	sky: '#d9e4f2',
	sunset: '#f2bb97',
}
export const DOT_VAR: Record<DotColor, string> = {
	sky: '--color-sky-100',
	sunset: '--color-sunset-200',
}

/** Read a CSS custom property off :root, with a fallback. */
export function readCssVar(name: string, fallback: string) {
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim()
	return value || fallback
}

/** Size a canvas backing store for the device pixel ratio (capped at 2). */
export function setupCanvas(
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	cssWidth: number,
	cssHeight: number,
) {
	const dpr = Math.min(window.devicePixelRatio || 1, 2)
	canvas.width = Math.round(cssWidth * dpr)
	canvas.height = Math.round(cssHeight * dpr)
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

const INFLUENCE_SQ = INFLUENCE * INFLUENCE

/** Position of a dot after the magnetic push away from the pointer. */
export function pushedDot(
	bx: number,
	by: number,
	px: number,
	py: number,
): [number, number] {
	const dx = bx - px
	const dy = by - py
	const dist2 = dx * dx + dy * dy
	if (dist2 >= INFLUENCE_SQ) return [bx, by]
	const dist = Math.sqrt(dist2) || 1
	const push = (1 - dist / INFLUENCE) ** 2 * MAX_PUSH
	return [bx + (dx / dist) * push, by + (dy / dist) * push]
}

/** Add one rounded-square dot to the current canvas path. */
export function addDotToPath(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
) {
	if (ctx.roundRect) ctx.roundRect(x, y, DOT_SIZE, DOT_SIZE, DOT_RADIUS)
	else ctx.rect(x, y, DOT_SIZE, DOT_SIZE)
}

/**
 * A gsap.ticker-backed render loop that self-stops once idle. Call `poke()` on
 * activity to (re)start it and keep it alive for KEEP_ALIVE_MS.
 */
export function createRenderLoop(render: () => void) {
	let running = false
	let keepAliveUntil = 0
	return {
		poke() {
			keepAliveUntil = performance.now() + KEEP_ALIVE_MS
			if (!running) {
				running = true
				gsap.ticker.add(render)
			}
		},
		stop() {
			if (!running) return
			running = false
			gsap.ticker.remove(render)
		},
		isRunning() {
			return running
		},
		expired() {
			return performance.now() > keepAliveUntil
		},
	}
}
