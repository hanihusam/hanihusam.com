import { useRef } from 'react'

import { useMarkDraw } from '@/hooks/useMarkDraw'
import { clsxm } from '@/utils/clsxm'

import { resumeHandClass } from './styles'

/**
 * Han's handwritten sign-off. Decorative, so hidden from screen readers. It
 * writes itself in once when scrolled to, after the closing circle has drawn.
 */
export function Signature({ className }: { className?: string }) {
	const ref = useRef<HTMLSpanElement>(null)
	const state = useMarkDraw(ref)

	return (
		// The observer watches the wrapper: while hidden, the clipped span has no
		// visible area, so it would never count as on screen.
		<span ref={ref} aria-hidden className={className}>
			<span
				data-state={state}
				className={clsxm(
					resumeHandClass,
					'inline-block rotate-6 text-[44px] md:text-[56px] lg:text-[64px] leading-[1.1]',
					'[clip-path:inset(-40%_-10%_-40%_-10%)] transition-[clip-path] delay-(--duration-slower) duration-(--duration-slower) ease-linear',
					'data-[state=hidden]:transition-none data-[state=hidden]:[clip-path:inset(-40%_100%_-40%_-10%)]',
				)}
			>
				Han
			</span>
		</span>
	)
}
