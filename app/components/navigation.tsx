import { clsxm } from '@/utils/clsxm'
import { Theme, useTheme } from '@/utils/theme-provider'

import NavigationItem from './ui/navigation-item'

import {
	BookmarkIcon,
	HomeIcon,
	WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

const links = [
	{
		href: '/',
		label: 'Home',
		icon: HomeIcon,
		key: 'Home',
	},
	{
		href: '/projects',
		label: 'Projects',
		icon: WrenchScrewdriverIcon,
	},
	{
		href: '/writing',
		label: 'Writing',
		icon: BookmarkIcon,
	},
]

export function Navigation() {
	return (
		<nav className="fixed bottom-8 left-1/2 z-20 flex border-separate translate-x-[-50%] items-center rounded-md border border-(--border-primary) bg-(--surface-primary) shadow-lg transition-colors">
			{links.map((link, idx) => (
				<NavigationItem
					className={idx === 0 ? 'ml-1' : ''}
					key={link.href}
					href={link.href}
					label={link.label}
				>
					<link.icon className="h-5 w-5" />
				</NavigationItem>
			))}

			<div className="h-11 w-px bg-(--border-primary) transition-colors" />

			<NavigationItem className="ml-1" href="/colophon" label="Colophon">
				<BookmarkIcon className="h-5 w-5" />
			</NavigationItem>
		</nav>
	)
}
