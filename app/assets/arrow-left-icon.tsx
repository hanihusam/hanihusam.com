import { clsxm } from '@/utils/clsxm'

export default function ArrowLeftIcon({
	className,
	...props
}: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			className={clsxm('-ms-1.25 inline align-baseline', className)}
			width="10"
			height="10"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			{...props}
		>
			<path
				d="M9.5 5.5h-7"
				className="ease-hover opacity-0 transition-opacity duration-(--duration-slow) group-hover:opacity-100"
			/>
			<path
				d="M8.5 1.5l-4 4 4 4"
				className="ease-hover transition-transform duration-(--duration-slow) group-hover:-translate-x-0.75"
			/>
		</svg>
	)
}
