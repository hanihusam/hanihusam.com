import { Text } from '@/components/typography'
import { clsxm } from '@/utils/clsxm'

import {
	Arrow,
	Content,
	Provider,
	Root,
	Trigger,
} from '@radix-ui/react-tooltip'
import { NavLink } from 'react-router'

type NavigationItemProps = {
	label: string
	href: string
	children: React.ReactNode
	className?: string
}

export default function NavigationItem({
	label,
	href,
	className,
	children,
}: NavigationItemProps) {
	return (
		<Provider delayDuration={100}>
			<Root>
				<Trigger asChild>
					<NavLink
						to={href}
						className={clsxm(
							'group relative z-10 my-1 mr-1 grid size-9 place-items-center',
							'rounded-md focus:outline-none',
							className,
						)}
					>
						<span
							className={clsxm(
								'relative text-(--nav-item-icon-default)',
								'transition-colors duration-(--duration-fast) ease-hover',
								'group-hover:text-(--nav-item-icon-hover)',
								'group-focus-visible:text-(--nav-item-icon-active)',
								'group-aria-[current=page]:text-(--nav-item-icon-active)',
								'[.group[aria-current=page]:not(:hover):not(:focus-visible)_&]:delay-(--duration-base)',
							)}
						>
							{children}
						</span>
					</NavLink>
				</Trigger>
				<Content className="TooltipContent" sideOffset={5}>
					<Text
						className="text-neutral-50 dark:text-neutral-950"
						variant="label"
					>
						{label}
					</Text>
					<Arrow className="TooltipArrow" />
				</Content>
			</Root>
		</Provider>
	)
}
