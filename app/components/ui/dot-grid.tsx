import { useId } from 'react'

type DotColor = 'sky' | 'sunset'

interface DotGridProps {
	rows?: number
	cols?: number
	color?: DotColor
	className?: string
}

// Design tokens from Figma: ~4px rounded-square dots on an ~18px pitch.
const DOT_SIZE = 4
const DOT_RADIUS = 1.344
const PITCH = 18

const dotFill: Record<DotColor, string> = {
	sky: 'var(--color-sky-100)',
	sunset: 'var(--color-sunset-200)',
}

/** Decorative grid of brand-tinted dots, rendered as a single inline SVG. */
export function DotGrid({
	rows = 6,
	cols = 7,
	color = 'sky',
	className,
}: DotGridProps) {
	const patternId = useId()
	const width = (cols - 1) * PITCH + DOT_SIZE
	const height = (rows - 1) * PITCH + DOT_SIZE

	return (
		<svg
			aria-hidden
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			fill="none"
			className={className}
		>
			<defs>
				<pattern
					id={patternId}
					width={PITCH}
					height={PITCH}
					patternUnits="userSpaceOnUse"
				>
					<rect
						width={DOT_SIZE}
						height={DOT_SIZE}
						rx={DOT_RADIUS}
						fill={dotFill[color]}
					/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${patternId})`} />
		</svg>
	)
}
