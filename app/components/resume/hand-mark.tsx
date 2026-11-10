import { useRef } from 'react'

import { useMarkDraw } from '@/hooks/useMarkDraw'
import { clsxm } from '@/utils/clsxm'

import { HAND_MARKS, type HandMarkName } from './hand-mark-paths'

interface HandMarkProps {
	name: HandMarkName
	/**
	 * `scroll` (default): draws in once when scrolled onto the stage.
	 * `load`: part of the header's page-load sequence, after `delay`.
	 */
	trigger?: 'scroll' | 'load'
	/** CSS time for `load`, built from the duration tokens. */
	delay?: string
	/** Position and size; the mark is absolutely positioned. */
	className?: string
}

/** A decorative orange pen stroke that draws itself in once (see useMarkDraw). */
export function HandMark({
	name,
	trigger = 'scroll',
	delay = '0ms',
	className,
}: HandMarkProps) {
	const ref = useRef<SVGSVGElement>(null)
	const state = useMarkDraw(ref, trigger === 'scroll')
	const { viewBox, paths } = HAND_MARKS[name]

	return (
		<svg
			ref={ref}
			aria-hidden
			focusable="false"
			viewBox={viewBox}
			preserveAspectRatio="none"
			fill="none"
			data-state={state}
			style={{ '--mark-delay': delay } as React.CSSProperties}
			className={clsxm(
				'group pointer-events-none absolute overflow-visible text-(--text-title-secondary)',
				className,
			)}
		>
			{paths.map((d, index) => {
				const isHead = index > 0
				return (
					<path
						key={d}
						d={d}
						pathLength={1}
						stroke="currentColor"
						strokeWidth={2.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						// One dash the length of the path, then a longer gap so the
						// repeat never shows. Hidden sits just past 1, so the round cap
						// at the start isn't drawn as a dot. An arrow's head follows
						// its shaft.
						className={clsxm(
							'[stroke-dasharray:1_2]',
							trigger === 'scroll'
								? [
										'transition-[stroke-dashoffset] ease-out-quart',
										'group-data-[state=hidden]:transition-none group-data-[state=hidden]:[stroke-dashoffset:1.05]',
										isHead
											? 'delay-(--duration-slow) duration-(--duration-base)'
											: 'duration-(--duration-slower)',
									]
								: [
										'motion-reduce:animate-none',
										isHead
											? 'animate-[markDraw_var(--duration-base)_var(--ease-out-quart)_backwards] [animation-delay:calc(var(--mark-delay)_+_var(--duration-slow))]'
											: 'animate-[markDraw_var(--duration-slower)_var(--ease-out-quart)_backwards] [animation-delay:var(--mark-delay)]',
									],
						)}
					/>
				)
			})}
		</svg>
	)
}
