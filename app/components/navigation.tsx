import { SubstackLogo } from '@/components/writing/substack-logo'

import NavigationItem from './ui/navigation-item'
import ThemeSwitcher from './ui/theme-switcher'

import { HouseIcon, WrenchIcon, UserCircleIcon } from '@phosphor-icons/react'
import { useLocation, matchPath } from 'react-router'
import { clsxm } from '@/utils/clsxm'

const links = [
	{
		href: '/',
		label: 'Home',
		icon: HouseIcon,
		key: 'Home',
	},
	{
		href: '/works',
		label: 'Projects',
		icon: WrenchIcon,
	},
	{
		href: '/about',
		label: 'About',
		icon: UserCircleIcon,
	},
	{
		href: 'https://bapak2dev.substack.com/',
		label: 'Substack',
		icon: SubstackLogo,
	},
]
const indicatorPositions = [
	'translate-x-0',
	'translate-x-10',
	'translate-x-20',
] as const

export function Navigation() {
	const { pathname } = useLocation()

	const activeIndex = links.findIndex(
		({ href }) =>
			href.startsWith('/') &&
			matchPath({ path: href, end: href === '/' }, pathname),
	)

	return (
		<nav className="fixed inset-x-0 bottom-8 z-20 mx-auto flex w-fit items-center rounded-md border border-(--border-primary) bg-(--surface-primary) shadow-lg transition-colors">
			<span
				aria-hidden
				className={clsxm(
					'pointer-events-none absolute top-1 left-1 size-9 rounded-md',
					'bg-(--nav-item-surface-active) transition-transform',
					'duration-(--duration-base) ease-in-out-quart',
					activeIndex === -1 && 'opacity-0',
					activeIndex !== -1 && indicatorPositions[activeIndex],
				)}
			/>
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

			<ThemeSwitcher />
		</nav>
	)
}
