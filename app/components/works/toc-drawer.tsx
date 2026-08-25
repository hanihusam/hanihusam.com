import * as React from 'react'

import { type HeadingScrollSpy, TocList } from '@/components/works/toc-list'
import { useFloatingNavigationMotion } from '@/hooks/useFloatingNavigationMotion'
import { useIsomorphicLayoutEffect } from '@/utils/helpers'
import { DURATION_BASE, EASE_IN_OUT_QUART } from '@/utils/motion'

import { ListBulletsIcon } from '@phosphor-icons/react'
import {
	animate,
	motion,
	useMotionTemplate,
	useMotionValue,
	useReducedMotion,
} from 'motion/react'
import { Drawer } from 'vaul'

type WorkTocDrawerProps = {
	toc?: HeadingScrollSpy
	activeSection: string | null
	minLevel: number
}

/**
 * Mobile/tablet table of contents. A floating button sits at the bottom-right of
 * the viewport; tapping it opens the TOC as a Vaul bottom-sheet. Hidden at `lg+`,
 * where the sticky aside takes over.
 */
export function WorkTocDrawer({
	toc,
	activeSection,
	minLevel,
}: WorkTocDrawerProps) {
	const [open, setOpen] = React.useState(false)
	const shouldReduceMotion = useReducedMotion()
	const { minimized, reason } = useFloatingNavigationMotion()
	const triggerScale = useMotionValue(1)
	const triggerTransform = useMotionTemplate`scale(${triggerScale})`

	useIsomorphicLayoutEffect(() => {
		triggerScale.stop()
		const target = shouldReduceMotion || !minimized ? 1 : 0.88

		if (shouldReduceMotion || reason === 'route') {
			triggerScale.set(target)
			return
		}

		const controls = animate(triggerScale, target, {
			duration: DURATION_BASE,
			ease: EASE_IN_OUT_QUART,
		})
		return () => controls.stop()
	}, [minimized, reason, shouldReduceMotion, triggerScale])

	if (!toc?.length) return null

	return (
		<Drawer.Root open={open} onOpenChange={setOpen}>
			<div className="toc-enter fixed right-8 bottom-8 z-20 lg:hidden">
				<Drawer.Trigger asChild>
					<motion.button
						type="button"
						aria-label="Open table of contents"
						initial={false}
						style={{
							transform: triggerTransform,
							transformOrigin: '100% 100%',
						}}
						className="grid size-[50px] place-items-center rounded-md border border-(--border-primary) bg-(--surface-primary) text-(--icon-primary) shadow-lg transition-colors hover:bg-(--nav-item-surface-active) focus:outline-none"
					>
						<ListBulletsIcon className="size-5" />
					</motion.button>
				</Drawer.Trigger>
			</div>

			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" />
				<Drawer.Content className="fixed inset-x-0 bottom-0 z-30 flex max-h-[75vh] flex-col rounded-t-lg border-t border-(--border-primary) bg-(--surface-primary) p-4 outline-none">
					<Drawer.Handle className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-(--border-primary)" />
					<Drawer.Title className="sr-only">Table of Contents</Drawer.Title>
					<div className="overflow-y-auto px-2 pb-4">
						<TocList
							toc={toc}
							activeSection={activeSection}
							minLevel={minLevel}
							onItemClick={() => setOpen(false)}
						/>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	)
}
