import { clsxm } from '@/utils/clsxm'
import {
	addDotToPath,
	createRenderLoop,
	DOT_FALLBACK,
	DOT_SIZE,
	DOT_VAR,
	type DotColor,
	INFLUENCE,
	MAX_PUSH,
	PITCH,
	pushedDot,
	readCssVar,
	setupCanvas,
} from '@/components/ui/dot-field'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

// The canvas is padded around the grid so dots pushed outward near an edge
// aren't clipped; the wrapper keeps the grid's original footprint.
const PAD = MAX_PUSH + DOT_SIZE + 4

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
}: Readonly<ReactiveDotGridProps>) {
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

			let dotColor = DOT_FALLBACK[color]
			const resolveColor = () => {
				dotColor = readCssVar(DOT_VAR[color], DOT_FALLBACK[color])
			}
			resolveColor()

			setupCanvas(canvas, ctx, canvasW, canvasH)

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

			function render() {
				ctx.clearRect(0, 0, canvasW, canvasH)
				ctx.fillStyle = dotColor
				ctx.beginPath()
				for (const dot of dots) {
					const [x, y] = pushedDot(dot.bx, dot.by, pointer.x, pointer.y)
					addDotToPath(ctx, x, y)
				}
				ctx.fill()
				if (loop.expired()) loop.stop()
			}

			const loop = createRenderLoop(render)

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
					loop.poke()
					wasNear = true
				} else if (wasNear) {
					// Left the neighborhood — ease dots back to rest once.
					xTo(-9999)
					yTo(-9999)
					loop.poke()
					wasNear = false
				}
			})

			const themeObserver = new MutationObserver(() => {
				resolveColor()
				if (!loop.isRunning()) render()
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
				loop.stop()
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
