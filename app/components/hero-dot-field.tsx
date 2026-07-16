import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

// Visual tokens matched to DotGrid (rounded-square dots) and
// ConcentricCircles (thin rings). A slightly larger pitch than DotGrid's 18px
// keeps the full-bleed field airy and the redraw cheap.
const PITCH = 22
const DOT_SIZE = 4
const DOT_RADIUS = 1.344

// Magnetic push: dots within INFLUENCE px of the cursor are shoved away, up to
// MAX_PUSH px at the center, easing to zero at the edge.
const INFLUENCE = 150
const MAX_PUSH = 24

// Ripple: a concentric ring pair spawns every RIPPLE_SPAWN_DIST px of travel
// and expands to RIPPLE_MAX px while fading out.
const RIPPLE_SPAWN_DIST = 80
const RIPPLE_MAX = 200
const RIPPLE_INNER_RATIO = 0.55
const RIPPLE_DURATION = 0.9

// Keep the render loop alive briefly after the last activity so the grid can
// relax back to rest, then stop to save CPU.
const KEEP_ALIVE_MS = 700

type Dot = { bx: number; by: number }
type Ripple = { x: number; y: number; r: number; alpha: number }

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
			// Alias to non-null-typed locals so the nested render/handlers narrow.
			const canvas = canvasEl
			const container = containerEl
			const ctx = ctxMaybe

			const colors = { dot: '#b3c9e5', ripple: '#ec9e6a' }
			const resolveColors = () => {
				colors.dot = readVar('--color-sky-200', '#b3c9e5')
				colors.ripple = readVar('--color-sunset-300', '#ec9e6a')
			}
			resolveColors()

			let width = 0
			let height = 0
			let dots: Dot[] = []
			const pointer = { x: -9999, y: -9999 }
			const ripples: Ripple[] = []
			let lastRipple = { x: 0, y: 0 }

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

				dots = []
				// Inset by half a pitch so the field is centered with even margins.
				const cols = Math.floor(width / PITCH)
				const rows = Math.floor(height / PITCH)
				const offsetX = (width - (cols - 1) * PITCH) / 2
				const offsetY = (height - (rows - 1) * PITCH) / 2
				for (let r = 0; r < rows; r++) {
					for (let c = 0; c < cols; c++) {
						dots.push({ bx: offsetX + c * PITCH, by: offsetY + r * PITCH })
					}
				}
			}

			function drawDot(x: number, y: number) {
				const half = DOT_SIZE / 2
				if (ctx.roundRect) {
					ctx.roundRect(x - half, y - half, DOT_SIZE, DOT_SIZE, DOT_RADIUS)
				} else {
					ctx.rect(x - half, y - half, DOT_SIZE, DOT_SIZE)
				}
			}

			function render() {
				ctx.clearRect(0, 0, width, height)

				// All dots share one color, so batch them into a single fill.
				ctx.fillStyle = colors.dot
				ctx.beginPath()
				const infl2 = INFLUENCE * INFLUENCE
				for (const dot of dots) {
					let { bx: x, by: y } = dot
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

				// Concentric ripple rings.
				if (ripples.length) {
					ctx.strokeStyle = colors.ripple
					ctx.lineWidth = 1
					for (const ripple of ripples) {
						ctx.globalAlpha = ripple.alpha
						ctx.beginPath()
						ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2)
						ctx.stroke()
						ctx.beginPath()
						ctx.arc(
							ripple.x,
							ripple.y,
							ripple.r * RIPPLE_INNER_RATIO,
							0,
							Math.PI * 2,
						)
						ctx.stroke()
					}
					ctx.globalAlpha = 1
				}

				if (performance.now() > keepAliveUntil && ripples.length === 0) {
					stopLoop()
				}
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

			const spawnRipple = contextSafe((x: number, y: number) => {
				const ripple: Ripple = { x, y, r: 6, alpha: 0.5 }
				ripples.push(ripple)
				gsap.to(ripple, {
					r: RIPPLE_MAX,
					alpha: 0,
					duration: RIPPLE_DURATION,
					ease: 'power2.out',
					onComplete: () => {
						const i = ripples.indexOf(ripple)
						if (i !== -1) ripples.splice(i, 1)
					},
				})
			})

			const handlePointerMove = contextSafe((event: Event) => {
				const rect = container.getBoundingClientRect()
				const { clientX, clientY } = event as PointerEvent
				const px = clientX - rect.left
				const py = clientY - rect.top
				xTo(px)
				yTo(py)
				const rdx = px - lastRipple.x
				const rdy = py - lastRipple.y
				if (rdx * rdx + rdy * rdy > RIPPLE_SPAWN_DIST * RIPPLE_SPAWN_DIST) {
					lastRipple = { x: px, y: py }
					spawnRipple(px, py)
				}
				poke()
			})

			const handlePointerEnter = contextSafe((event: Event) => {
				const rect = container.getBoundingClientRect()
				const { clientX, clientY } = event as PointerEvent
				lastRipple = { x: clientX - rect.left, y: clientY - rect.top }
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
				container.addEventListener('pointerenter', handlePointerEnter)
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
				container.removeEventListener('pointerenter', handlePointerEnter)
				container.removeEventListener('pointerleave', handlePointerLeave)
				resizeObserver.disconnect()
				themeObserver.disconnect()
			}
		},
		{ scope: canvasRef },
	)

	return <canvas ref={canvasRef} aria-hidden className={className} />
}
