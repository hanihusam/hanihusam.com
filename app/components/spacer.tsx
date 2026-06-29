const spacerSizes = {
	sm: 'h-6 lg:h-8',
	md: 'h-10 lg:h-12',
	lg: 'h-16 lg:h-20',
}

function Spacer({
	size,
	id,
	className = '',
}: {
	size: keyof typeof spacerSizes
	/**
	 * Optional id for the spacer element. This can be used to create anchor links to specific sections of the page.
	 */
	id?: string
	className?: string
}) {
	return <div id={id} className={`${className} ${spacerSizes[size]}`} />
}

export { Spacer }
