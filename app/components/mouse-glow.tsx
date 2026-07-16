import { clsxm } from '@/utils/clsxm'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

/**
 * Cursor-following radial gradient, eased with GSAP's quickTo.
 * Tracks pointer position over its parent element (which must be
 * `position: relative`) and writes it to `--mouse-x`/`--mouse-y` (0-100)
 * for the gradient to read.
 */
export function MouseGlow({ className }: { className?: string }) {
	const glowRef = useRef<HTMLDivElement>(null)

	useGSAP(
		(_context, contextSafe) => {
			const glow = glowRef.current
			const container = glow?.parentElement
			if (!glow || !container || !contextSafe) return

			const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
			if (!canHover.matches || reduceMotion.matches) return

			const xTo = gsap.quickTo(glow, '--mouse-x', {
				duration: 0.6,
				ease: 'power3',
			})
			const yTo = gsap.quickTo(glow, '--mouse-y', {
				duration: 0.6,
				ease: 'power3',
			})

			const handlePointerMove = contextSafe((event: Event) => {
				const rect = container.getBoundingClientRect()
				const { clientX, clientY } = event as PointerEvent
				xTo(((clientX - rect.left) / rect.width) * 100)
				yTo(((clientY - rect.top) / rect.height) * 100)
			})

			const handlePointerEnter = contextSafe(() => {
				gsap.to(glow, { opacity: 1, duration: 0.4, ease: 'power2.out' })
			})

			const handlePointerLeave = contextSafe(() => {
				gsap.to(glow, { opacity: 0, duration: 0.6, ease: 'power2.out' })
			})

			container.addEventListener('pointermove', handlePointerMove)
			container.addEventListener('pointerenter', handlePointerEnter)
			container.addEventListener('pointerleave', handlePointerLeave)

			return () => {
				container.removeEventListener('pointermove', handlePointerMove)
				container.removeEventListener('pointerenter', handlePointerEnter)
				container.removeEventListener('pointerleave', handlePointerLeave)
			}
		},
		{ scope: glowRef },
	)

	return (
		<div
			ref={glowRef}
			aria-hidden
			className={clsxm(
				'pointer-events-none absolute inset-0 opacity-0 mix-blend-multiply',
				className,
			)}
			style={
				{
					'--mouse-x': 50,
					'--mouse-y': 50,
					backgroundImage:
						'radial-gradient(600px circle at calc(var(--mouse-x) * 1%) calc(var(--mouse-y) * 1%), color-mix(in oklab, var(--color-sunset-300) 55%, transparent), transparent 55%), radial-gradient(440px circle at calc(var(--mouse-x) * 1%) calc(var(--mouse-y) * 1%), color-mix(in oklab, var(--color-sky-300) 40%, transparent), transparent 50%)',
				} as React.CSSProperties
			}
		/>
	)
}
