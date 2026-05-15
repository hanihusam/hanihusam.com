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
				<Trigger>
					<NavLink
						to={href}
						className={({ isActive }) =>
							clsxm(
								'my-1 mr-1 grid size-9 place-items-center rounded-md transition-colors hover:bg-(--nav-item-surface-active) focus:bg-(--nav-item-surface-active)',
								className,
								{
									'bg-(--nav-item-surface-active)': isActive,
								},
							)
						}
					>
						{children}
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
