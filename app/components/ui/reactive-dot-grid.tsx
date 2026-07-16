import { clsxm } from '@/utils/clsxm'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

type DotColor = 'sky' | 'sunset'

// Dot styling mirrors DotGrid exactly: 4px rounded squares on an 18px pitch.
const PITCH = 18
const DOT_SIZE = 4
const DOT_RADIUS = 1.344

// Magnetic push: dots within INFLUENCE px of the cursor shove away, up to
// MAX_PUSH px at the center, easing to zero at the edge.
const INFLUENCE = 130
const MAX_PUSH = 18
// The canvas is padded around the grid so dots pushed outward near an edge
// aren't clipped; the wrapper keeps the grid's original footprint.
const PAD = MAX_PUSH + DOT_SIZE + 4

const KEEP_ALIVE_MS = 700

const FALLBACK: Record<DotColor, string> = { sky: '#d9e4f2', sunset: '#f2bb97' }
const VAR: Record<DotColor, string> = {
	sky: '--color-sky-100',
	sunset: '--color-sunset-200',
}

function readVar(name: string, fallback: string) {
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim()
	return value || fallback
}

interface ReactiveDotGridProps {
	rows?: number
	cols?: number
	color?: DotColor
	className?: string
}

/**
 * Drop-in reactive replacement for DotGrid: same rows/cols/color/className, but
 * rendered on a canvas whose dots magnetically push away from the cursor (GSAP
 * quickTo easing) when it comes near. Falls back to a static grid under
 * prefers-reduced-motion or on non-hover pointers.
 */
export function ReactiveDotGrid({
	rows = 6,
	cols = 7,
	color = 'sky',
	className,
}: ReactiveDotGridProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const gridW = (cols - 1) * PITCH + DOT_SIZE
	const gridH = (rows - 1) * PITCH + DOT_SIZE
	const canvasW = gridW + PAD * 2
	const canvasH = gridH + PAD * 2

	useGSAP(
		(_context, contextSafe) => {
			const canvasEl = canvasRef.current
			const ctxMaybe = canvasEl?.getContext('2d')
			if (!canvasEl || !ctxMaybe || !contextSafe) return
			const canvas = canvasEl
			const ctx = ctxMaybe

			let dotColor = FALLBACK[color]
			const resolveColor = () => {
				dotColor = readVar(VAR[color], FALLBACK[color])
			}
			resolveColor()

			const dpr = Math.min(window.devicePixelRatio || 1, 2)
			canvas.width = Math.round(canvasW * dpr)
			canvas.height = Math.round(canvasH * dpr)
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

			const dots: { bx: number; by: number }[] = []
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					dots.push({ bx: PAD + c * PITCH, by: PAD + r * PITCH })
				}
			}

			const pointer = { x: -9999, y: -9999 }
			const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
			const interactive = canHover.matches && !reduceMotion.matches

			function drawDot(x: number, y: number) {
				if (ctx.roundRect) {
					ctx.roundRect(x, y, DOT_SIZE, DOT_SIZE, DOT_RADIUS)
				} else {
					ctx.rect(x, y, DOT_SIZE, DOT_SIZE)
				}
			}

			function render() {
				ctx.clearRect(0, 0, canvasW, canvasH)
				ctx.fillStyle = dotColor
				ctx.beginPath()
				const infl2 = INFLUENCE * INFLUENCE
				for (const dot of dots) {
					let x = dot.bx
					let y = dot.by
					const dx = dot.bx - pointer.x
					const dy = dot.by - pointer.y
					const dist2 = dx * dx + dy * dy
					if (dist2 < infl2) {
						const dist = Math.sqrt(dist2) || 1
						const force = 1 - dist / INFLUENCE
						const push = force * force * MAX_PUSH
						x = dot.bx + (dx / dist) * push
						y = dot.by + (dy / dist) * push
					}
					drawDot(x, y)
				}
				ctx.fill()

				if (performance.now() > keepAliveUntil) stopLoop()
			}

			let running = false
			let keepAliveUntil = 0
			function startLoop() {
				if (running) return
				running = true
				gsap.ticker.add(render)
			}
			function stopLoop() {
				if (!running) return
				running = false
				gsap.ticker.remove(render)
			}
			function poke() {
				keepAliveUntil = performance.now() + KEEP_ALIVE_MS
				startLoop()
			}

			const xTo = gsap.quickTo(pointer, 'x', { duration: 0.35, ease: 'power3' })
			const yTo = gsap.quickTo(pointer, 'y', { duration: 0.35, ease: 'power3' })

			let wasNear = false
			const handlePointerMove = contextSafe((event: Event) => {
				const { clientX, clientY } = event as PointerEvent
				const rect = canvas.getBoundingClientRect()
				const lx = clientX - rect.left
				const ly = clientY - rect.top
				const near =
					lx > -INFLUENCE &&
					lx < canvasW + INFLUENCE &&
					ly > -INFLUENCE &&
					ly < canvasH + INFLUENCE
				if (near) {
					xTo(lx)
					yTo(ly)
					poke()
					wasNear = true
				} else if (wasNear) {
					// Left the neighborhood — ease dots back to rest once.
					xTo(-9999)
					yTo(-9999)
					poke()
					wasNear = false
				}
			})

			const themeObserver = new MutationObserver(() => {
				resolveColor()
				if (!running) render()
			})

			render()
			if (interactive) {
				window.addEventListener('pointermove', handlePointerMove, {
					passive: true,
				})
			}
			themeObserver.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ['class'],
			})

			return () => {
				stopLoop()
				window.removeEventListener('pointermove', handlePointerMove)
				themeObserver.disconnect()
			}
		},
		{ scope: canvasRef, dependencies: [color, rows, cols] },
	)

	return (
		<div
			aria-hidden
			className={clsxm('pointer-events-none', className)}
			style={{ width: gridW, height: gridH }}
		>
			<canvas
				ref={canvasRef}
				className="absolute"
				style={{ top: -PAD, left: -PAD, width: canvasW, height: canvasH }}
			/>
		</div>
	)
}
