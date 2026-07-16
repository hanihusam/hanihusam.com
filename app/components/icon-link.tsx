import { clsxm } from '@/utils/clsxm'

function IconLink({ ref, ...props }: React.ComponentPropsWithRef<'a'>) {
	return (
		<a
			{...props}
			className={clsxm(
				props.className,
				'ease-out-quart transition-transform duration-(--duration-base) hover:-translate-y-1.5',
			)}
			ref={ref}
		>
			{props.children}
		</a>
	)
}

export { IconLink }
