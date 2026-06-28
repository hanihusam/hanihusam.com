function IconLink({ ref, ...props }: React.ComponentPropsWithRef<'a'>) {
	return (
		<a
			{...props}
			className={`${props.className ?? ''} duration-500 hover:-translate-y-1.5`}
			ref={ref}
		>
			{props.children}
		</a>
	)
}

export { IconLink }
