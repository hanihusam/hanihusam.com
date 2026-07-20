import { clsxm } from '@/utils/clsxm'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

interface ConcentricCirclesProps {
	/** Rendered width/height in px. */
	size?: number
	/** Distance between rings in px. */
	ringGap?: number
	/** Render a brand-colored dot at the center. */
	accent?: boolean
	className?: string
}

const ACCENT_RADIUS = 12
const TAU = Math.PI * 2
// Points sampled around each ring path.
const SEGMENTS = 84

// Ocean pulse: rings ripple outward from the center and fade, one after another,
// like slow waves. A faint angular undulation keeps their edges alive.
const RIPPLE_SPEED = 0.11 // ripple cycles per second (slow)
const PEAK_OPACITY = 0.5 // ring opacity at the crest of its fade
const UNDULATE_AMP = 1.5
const UNDULATE_LOBES = 3
const UNDULATE_SPEED = 0.2

// The cursor strikes the waves with directional force: near the cursor the
// ripple is shoved along the cursor's motion (a crack — bulge ahead, trough
// behind), plus a small radial presence. The force builds from cursor velocity
// and decays as it slows.
const BULGE = 8 // gentle radial presence where the cursor sits
const BULGE_SIGMA = 60
const FORCE_SCALE = 1.15 // px pushed per unit of eased force
const FORCE_GAIN = 1 // cursor velocity → force
const FORCE_DECAY = 0.86 // per-frame force fade as the cursor slows
const MAX_FORCE = 46
const PROXIMITY = 240
const AGITATION_EASE = 0.08
const CURSOR_EASE = 0.16

/** Perfect-circle path, used for the SSR / reduced-motion fallback. */
function circlePath(c: number, r: number) {
	return `M ${c - r} ${c} A ${r} ${r} 0 1 0 ${c + r} ${c} A ${r} ${r} 0 1 0 ${c - r} ${c} Z`
}

/** Decorative concentric water ripples with an optional center dot. */
export function ConcentricCircles({
	size = 485,
	ringGap = 60,
	accent = false,
	className,
}: ConcentricCirclesProps) {
	const svgRef = useRef<SVGSVGElement>(null)

	const center = size / 2
	const ringCount = Math.floor(center / ringGap)
	const radii = Array.from({ length: ringCount }, (_, i) => (i + 1) * ringGap)
	const maxRadius = radii.at(-1) ?? center

	useGSAP(
		(_context, contextSafe) => {
			const svg = svgRef.current
			if (!svg || !contextSafe) return

			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
			if (reduceMotion.matches) return

			const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
			const paths = Array.from(
				svg.querySelectorAll<SVGPathElement>('[data-ring]'),
			)
			if (!paths.length) return
			const count = paths.length

			let t = 0
			let basePhase = 0
			let agitation = 0
			let agitationTarget = 0
			// Eased cursor position (local SVG coords) so the bulge trails the mouse.
			let curX = center
			let curY = center
			let targetX = center
			let targetY = center
			// Directional force from cursor velocity (local px), decaying each frame.
			let forceX = 0
			let forceY = 0
			let prevX = 0
			let prevY = 0
			let hasPrev = false

			// One expanding ripple, deformed near the cursor. `progress` 0→1 grows the
			// ring from the center outward; the bulge bends the arc passing the wood.
			function buildPath(progress: number, ringIndex: number) {
				const currentR = progress * maxRadius
				let d = ''
				for (let k = 0; k < SEGMENTS; k++) {
					const a = (k / SEGMENTS) * TAU
					const cos = Math.cos(a)
					const sin = Math.sin(a)
					const baseX = center + currentR * cos
					const baseY = center + currentR * sin
					const dx = baseX - curX
					const dy = baseY - curY
					// Falloff: how strongly this point feels the cursor.
					const g =
						agitation *
						Math.exp(-(dx * dx + dy * dy) / (2 * BULGE_SIGMA * BULGE_SIGMA))
					const r =
						currentR +
						UNDULATE_AMP *
							Math.sin(UNDULATE_LOBES * a + t * UNDULATE_SPEED + ringIndex) +
						BULGE * g
					// Directional shove along the cursor's motion — the crack.
					const x = center + r * cos + forceX * g * FORCE_SCALE
					const y = center + r * sin + forceY * g * FORCE_SCALE
					d += `${k === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `
				}
				return d + 'Z'
			}

			function render(_time: number, deltaTime: number) {
				const dt = deltaTime / 1000
				t += dt
				basePhase = (basePhase + dt * RIPPLE_SPEED) % 1
				agitation += (agitationTarget - agitation) * AGITATION_EASE
				curX += (targetX - curX) * CURSOR_EASE
				curY += (targetY - curY) * CURSOR_EASE
				// Force fades as the cursor slows, so the crack recovers back to flow.
				forceX *= FORCE_DECAY
				forceY *= FORCE_DECAY
				paths.forEach((path, i) => {
					// Rings ride the same wave a step apart → evenly spaced ripples.
					const p = (basePhase + i / count) % 1
					path.setAttribute('d', buildPath(p, i))
					// sin() fades each ripple in from the center and out at the edge.
					path.style.opacity = String(Math.sin(p * Math.PI) * PEAK_OPACITY)
				})
			}

			let running = false
			function start() {
				if (running) return
				running = true
				gsap.ticker.add(render)
			}
			function stop() {
				if (!running) return
				running = false
				gsap.ticker.remove(render)
			}

			const io = new IntersectionObserver((entries) => {
				if (entries.some((e) => e.isIntersecting)) start()
				else stop()
			})
			io.observe(svg)

			const clampForce = (v: number) =>
				Math.max(-MAX_FORCE, Math.min(MAX_FORCE, v))

			const handlePointerMove = contextSafe((event: Event) => {
				const { clientX, clientY } = event as PointerEvent
				const rect = svg.getBoundingClientRect()
				// Map viewport point into the SVG's local coordinate space.
				const localX = ((clientX - rect.left) / rect.width) * size
				const localY = ((clientY - rect.top) / rect.height) * size
				targetX = localX
				targetY = localY
				// Force = latest cursor velocity in local space → the strike direction.
				if (hasPrev) {
					forceX = clampForce((localX - prevX) * FORCE_GAIN)
					forceY = clampForce((localY - prevY) * FORCE_GAIN)
				}
				prevX = localX
				prevY = localY
				hasPrev = true
				// Agitation from proximity to the box, so off-screen-anchored rings
				// still respond near their visible part.
				const nx = Math.max(rect.left, Math.min(clientX, rect.right))
				const ny = Math.max(rect.top, Math.min(clientY, rect.bottom))
				const dist = Math.hypot(clientX - nx, clientY - ny)
				agitationTarget = Math.max(0, 1 - dist / PROXIMITY)
			})

			if (canHover.matches) {
				window.addEventListener('pointermove', handlePointerMove, {
					passive: true,
				})
			}

			return () => {
				stop()
				io.disconnect()
				window.removeEventListener('pointermove', handlePointerMove)
			}
		},
		{ scope: svgRef, dependencies: [size, ringGap, accent] },
	)

	return (
		<svg
			ref={svgRef}
			aria-hidden
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			fill="none"
			className={className}
		>
			{radii.map((r) => (
				<path
					key={r}
					data-ring="true"
					d={circlePath(center, r)}
					stroke="var(--border-primary)"
					strokeWidth={1}
				/>
			))}

			<circle
				cx={center}
				cy={center}
				r={ACCENT_RADIUS}
				fill={clsxm(
					accent ? 'var(--color-sunset-400)' : 'var(--color-sky-500)',
				)}
			/>
		</svg>
	)
}
