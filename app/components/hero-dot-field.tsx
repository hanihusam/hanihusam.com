import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

// Dot styling matched to DotGrid: 4px rounded squares on an 18px pitch.
const PITCH = 18
const DOT_SIZE = 4
const DOT_RADIUS = 1.344

// Magnetic push: dots within INFLUENCE px of the cursor are shoved away, up to
// MAX_PUSH px at the center, easing to zero at the edge.
const INFLUENCE = 130
const MAX_PUSH = 18

// Keep the render loop alive briefly after the last activity so the clusters
// can relax back to rest, then stop to save CPU.
const KEEP_ALIVE_MS = 700

type DotColor = 'sky' | 'sunset'
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

const FALLBACK: Record<DotColor, string> = {
	sky: '#d9e4f2',
	sunset: '#f2bb97',
}

function readVar(name: string, fallback: string) {
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim()
	return value || fallback
}

export function HeroDotField({ className }: { className?: string }) {
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

			const colors: Record<DotColor, string> = { ...FALLBACK }
			const resolveColors = () => {
				colors.sky = readVar('--color-sky-100', FALLBACK.sky)
				colors.sunset = readVar('--color-sunset-200', FALLBACK.sunset)
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

			function buildDots() {
				const rect = container.getBoundingClientRect()
				width = rect.width
				height = rect.height
				const dpr = Math.min(window.devicePixelRatio || 1, 2)
				canvas.width = Math.round(width * dpr)
				canvas.height = Math.round(height * dpr)
				canvas.style.width = `${width}px`
				canvas.style.height = `${height}px`
				ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

				dotsByColor.sky = []
				dotsByColor.sunset = []
				for (const cluster of CLUSTERS) {
					if (window.innerWidth < cluster.minWidth) continue
					const clusterW = (cluster.cols - 1) * PITCH + DOT_SIZE
					const clusterH = (cluster.rows - 1) * PITCH + DOT_SIZE
					let ox: number
					let oy: number
					if (cluster.at) {
						ox = cluster.at.fx * width - clusterW / 2
						oy = cluster.at.fy * height - clusterH / 2
					} else {
						const offsetX = cluster.offsetX ?? 0
						const offsetY = cluster.offsetY ?? 0
						ox = cluster.anchor?.endsWith('right')
							? width - offsetX - clusterW
							: offsetX
						oy = cluster.anchor?.startsWith('bottom')
							? height - offsetY - clusterH
							: offsetY
					}
					const bucket = dotsByColor[cluster.color]
					for (let r = 0; r < cluster.rows; r++) {
						for (let c = 0; c < cluster.cols; c++) {
							bucket.push({ bx: ox + c * PITCH, by: oy + r * PITCH })
						}
					}
				}
			}

			function drawDot(x: number, y: number) {
				if (ctx.roundRect) {
					ctx.roundRect(x, y, DOT_SIZE, DOT_SIZE, DOT_RADIUS)
				} else {
					ctx.rect(x, y, DOT_SIZE, DOT_SIZE)
				}
			}

			function render() {
				ctx.clearRect(0, 0, width, height)
				const infl2 = INFLUENCE * INFLUENCE

				for (const color of ['sky', 'sunset'] as DotColor[]) {
					const bucket = dotsByColor[color]
					if (!bucket.length) continue
					ctx.fillStyle = colors[color]
					ctx.beginPath()
					for (const dot of bucket) {
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
				}

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

			const handlePointerMove = contextSafe((event: Event) => {
				const rect = container.getBoundingClientRect()
				const { clientX, clientY } = event as PointerEvent
				xTo(clientX - rect.left)
				yTo(clientY - rect.top)
				poke()
			})

			const handlePointerLeave = contextSafe(() => {
				xTo(-9999)
				yTo(-9999)
				poke()
			})

			const resizeObserver = new ResizeObserver(() => {
				buildDots()
				if (!running) render()
			})

			const themeObserver = new MutationObserver(() => {
				resolveColors()
				if (!running) render()
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
				stopLoop()
				container.removeEventListener('pointermove', handlePointerMove)
				container.removeEventListener('pointerleave', handlePointerLeave)
				resizeObserver.disconnect()
				themeObserver.disconnect()
			}
		},
		{ scope: canvasRef },
	)

	return <canvas ref={canvasRef} aria-hidden className={className} />
}
