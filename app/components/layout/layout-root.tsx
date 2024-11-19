type LayoutRootProps = {
	children: React.ReactNode
}

function LayoutRoot({ children }: LayoutRootProps) {
	return (
		<div className="relative flex min-h-screen flex-col bg-light dark:bg-dark">
			{children}
		</div>
	)
}

export default LayoutRoot
