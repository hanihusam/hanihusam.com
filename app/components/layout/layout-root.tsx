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
				// `overflow-x-clip` (not `-hidden`) contains decorative bleed without
				// creating a scroll container, so `position: sticky` still works
				// (e.g. the project-page table of contents).
				'relative flex min-h-screen flex-col overflow-x-clip pb-24 md:pb-0',
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
