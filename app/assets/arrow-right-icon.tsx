import { clsxm } from '@/utils/clsxm'

export default function ArrowRightIcon({
	className,
	...props
}: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			className={clsxm('-me-1.25 inline align-baseline', className)}
			width="10"
			height="10"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			{...props}
		>
			<path
				d="M0.5 5.5h7"
				className="ease-hover opacity-0 transition-opacity duration-(--duration-slow) group-hover:opacity-100"
			/>
			<path
				d="M1.5 1.5l4 4-4 4"
				className="ease-hover transition-transform duration-(--duration-slow) group-hover:translate-x-0.75"
			/>
		</svg>
	)
}
