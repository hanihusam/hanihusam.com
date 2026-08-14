import { useRef } from 'react'

import { TRACE_SEGMENTS } from '@/components/about/skate-trace-paths'
import { useSkateTrace } from '@/hooks/useSkateTrace'

/**
 * The skate photo plus its traced swoosh. `hani-drop-clean.png` is a *clean*
 * cutout with no swoosh baked in — see skate-trace-paths.ts for provenance —
 * so the drawn overlay doesn't double up against one already in the raster.
 *
 * The trace was authored at 246×314 against this exact cutout, so the overlay
 * lines up with no manual nudging.
 *
 * The swoosh draws itself as the tile scrolls past; the whole scene lives in
 * useSkateTrace.
 */
export function SkateTrace() {
	const scope = useRef<HTMLDivElement>(null)

	useSkateTrace(scope)

	return (
		<div
			ref={scope}
			className="relative -mb-14 w-full max-w-61.25 translate-x-[8%] self-end md:-mb-10 md:max-w-75 md:translate-x-[7%]"
		>
			<img
				src="/images/hani-drop-clean.png"
				alt="Han skateboarding"
				width={600}
				height={766}
				className="w-full"
			/>

			<svg
				aria-hidden
				viewBox="0 0 246 314"
				fill="none"
				className="pointer-events-none absolute inset-0 h-full w-full"
			>
				{TRACE_SEGMENTS.map((segment) => (
					<path
						key={segment.d}
						data-trace-segment
						data-from={segment.from}
						d={segment.d}
						stroke="var(--skate-trace-stroke)"
						strokeWidth={4}
						strokeLinecap="round"
					/>
				))}
			</svg>
		</div>
	)
}
