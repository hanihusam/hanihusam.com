import * as React from 'react'

const IconLink = React.forwardRef<
	HTMLAnchorElement,
	JSX.IntrinsicElements['a']
>(function IconLink(props, ref) {
	return (
		<a
			{...props}
			className={`${props.className ?? ''} duration-500 hover:-translate-y-1.5`}
			ref={ref}
		>
			{props.children}
		</a>
	)
})

export { IconLink }
