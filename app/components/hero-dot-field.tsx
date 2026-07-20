import {
	addDotToPath,
	createRenderLoop,
	DOT_FALLBACK,
	DOT_SIZE,
	DOT_VAR,
	type DotColor,
	PITCH,
	pushedDot,
	readCssVar,
	setupCanvas,
} from '@/components/ui/dot-field'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

type Anchor = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
type Dot = { bx: number; by: number }

// A few decorative clusters, reactive to the cursor. Placement is either:
//  - `anchor` + offsets: pinned to a corner (used for the ambient edge dots), or
//  - `at: { fx, fy }`: centered at a fraction of the hero (0-1), letting a
//    cluster sit naturally beside the display text or the avatar.
// `minWidth` gates a cluster to a breakpoint (matches theme md/lg tokens).
type Cluster = {
	color: DotColor
	rows: number
	cols: number
	minWidth: number
	anchor?: Anchor
	offsetX?: number
	offsetY?: number
	at?: { fx: number; fy: number }
}

const CLUSTERS: Cluster[] = [
	{
		anchor: 'top-right',
		color: 'sky',
		rows: 5,
		cols: 7,
		offsetX: 40,
		offsetY: 112,
		minWidth: 640,
	},
	{
		anchor: 'bottom-left',
		color: 'sunset',
		rows: 7,
		cols: 5,
		offsetX: 40,
		offsetY: 96,
		minWidth: 1024,
	},
	// Below the "More about me" link in the right column.
	{
		at: { fx: 0.71, fy: 0.78 },
		color: 'sunset',
		rows: 6,
		cols: 8,
		minWidth: 1024,
	},
	// Tucked behind the top of the avatar / hero image.
	{
		at: { fx: 0.5, fy: 0.22 },
		color: 'sky',
		rows: 5,
		cols: 8,
		minWidth: 1024,
	},
]

export function HeroDotField({ className }: Readonly<{ className?: string }>) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useGSAP(
		(_context, contextSafe) => {
			const canvasEl = canvasRef.current
			const containerEl = canvasEl?.parentElement
			const ctxMaybe = canvasEl?.getContext('2d')
			if (!canvasEl || !containerEl || !ctxMaybe || !contextSafe) return
			// Alias to non-null-typed locals so the nested closures narrow.
			const canvas = canvasEl
			const container = containerEl
			const ctx = ctxMaybe

			const colors: Record<DotColor, string> = { ...DOT_FALLBACK }
			const resolveColors = () => {
				colors.sky = readCssVar(DOT_VAR.sky, DOT_FALLBACK.sky)
				colors.sunset = readCssVar(DOT_VAR.sunset, DOT_FALLBACK.sunset)
			}
			resolveColors()

			let width = 0
			let height = 0
			// Dots grouped by color so each group draws in a single batched fill.
			const dotsByColor: Record<DotColor, Dot[]> = { sky: [], sunset: [] }
			const pointer = { x: -9999, y: -9999 }

			const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
			const interactive = canHover.matches && !reduceMotion.matches

			function clusterOrigin(
				cluster: Cluster,
				clusterW: number,
				clusterH: number,
			): [number, number] {
				if (cluster.at) {
					return [
						cluster.at.fx * width - clusterW / 2,
						cluster.at.fy * height - clusterH / 2,
					]
				}
				const offsetX = cluster.offsetX ?? 0
				const offsetY = cluster.offsetY ?? 0
				const ox = cluster.anchor?.endsWith('right')
					? width - offsetX - clusterW
					: offsetX
				const oy = cluster.anchor?.startsWith('bottom')
					? height - offsetY - clusterH
					: offsetY
				return [ox, oy]
			}

			function buildDots() {
				const rect = container.getBoundingClientRect()
				width = rect.width
				height = rect.height
				setupCanvas(canvas, ctx, width, height)
				canvas.style.width = `${width}px`
				canvas.style.height = `${height}px`

				dotsByColor.sky = []
				dotsByColor.sunset = []
				for (const cluster of CLUSTERS) {
					if (window.innerWidth < cluster.minWidth) continue
					const clusterW = (cluster.cols - 1) * PITCH + DOT_SIZE
					const clusterH = (cluster.rows - 1) * PITCH + DOT_SIZE
					const [ox, oy] = clusterOrigin(cluster, clusterW, clusterH)
					const bucket = dotsByColor[cluster.color]
					for (let r = 0; r < cluster.rows; r++) {
						for (let c = 0; c < cluster.cols; c++) {
							bucket.push({ bx: ox + c * PITCH, by: oy + r * PITCH })
						}
					}
				}
			}

			function drawBucket(bucket: Dot[], color: DotColor) {
				if (!bucket.length) return
				ctx.fillStyle = colors[color]
				ctx.beginPath()
				for (const dot of bucket) {
					const [x, y] = pushedDot(dot.bx, dot.by, pointer.x, pointer.y)
					addDotToPath(ctx, x, y)
				}
				ctx.fill()
			}

			function render() {
				ctx.clearRect(0, 0, width, height)
				drawBucket(dotsByColor.sky, 'sky')
				drawBucket(dotsByColor.sunset, 'sunset')
				if (loop.expired()) loop.stop()
			}

			const loop = createRenderLoop(render)

			const xTo = gsap.quickTo(pointer, 'x', { duration: 0.35, ease: 'power3' })
			const yTo = gsap.quickTo(pointer, 'y', { duration: 0.35, ease: 'power3' })

			const handlePointerMove = contextSafe((event: Event) => {
				const rect = container.getBoundingClientRect()
				const { clientX, clientY } = event as PointerEvent
				xTo(clientX - rect.left)
				yTo(clientY - rect.top)
				loop.poke()
			})

			const handlePointerLeave = contextSafe(() => {
				xTo(-9999)
				yTo(-9999)
				loop.poke()
			})

			const resizeObserver = new ResizeObserver(() => {
				buildDots()
				if (!loop.isRunning()) render()
			})

			const themeObserver = new MutationObserver(() => {
				resolveColors()
				if (!loop.isRunning()) render()
			})

			buildDots()
			render()

			if (interactive) {
				container.addEventListener('pointermove', handlePointerMove)
				container.addEventListener('pointerleave', handlePointerLeave)
			}
			resizeObserver.observe(container)
			themeObserver.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ['class'],
			})

			return () => {
				loop.stop()
				container.removeEventListener('pointermove', handlePointerMove)
				container.removeEventListener('pointerleave', handlePointerLeave)
				resizeObserver.disconnect()
				themeObserver.disconnect()
			}
		},
		{ scope: canvasRef },
	)

	return <canvas ref={canvasRef} role="presentation" className={className} />
}
