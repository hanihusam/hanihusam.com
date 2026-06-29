import { clsxm } from '@/utils/clsxm'

type LayoutRootProps = {
	/** Page background. `secondary` paints the whole page (incl. the global footer) gray. */
	surface?: 'primary' | 'secondary'
	children: React.ReactNode
}

function LayoutRoot({ surface = 'primary', children }: LayoutRootProps) {
	return (
		<div
			className={clsxm(
				// `pb-24 md:pb-0` clears the fixed bottom Navigation on mobile.
				'relative flex min-h-screen flex-col overflow-hidden pb-24 md:pb-0',
				surface === 'secondary'
					? 'bg-(--surface-secondary)'
					: 'bg-(--surface-primary)',
			)}
		>
			{children}
		</div>
	)
}

export default LayoutRoot
