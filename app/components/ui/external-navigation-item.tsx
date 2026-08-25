import { AnchorOrLink } from '@/components/links/anchor-or-link'
import { Text } from '@/components/typography'
import { clsxm } from '@/utils/clsxm'

import {
	Arrow,
	Content,
	Provider,
	Root,
	Trigger,
} from '@radix-ui/react-tooltip'
import { type ReactNode } from 'react'

type ExternalNavigationItemProps = {
	label: string
	href: string
	children: ReactNode
	className?: string
}

function ExternalNavigationItem({
	label,
	href,
	children,
	className,
}: ExternalNavigationItemProps) {
	return (
		<Provider delayDuration={100}>
			<Root>
				<Trigger asChild>
					<AnchorOrLink
						aria-label={label}
						href={href}
						className={clsxm(
							'group relative z-10 grid size-10 place-items-center',
							'rounded-md focus:outline-none',
							className,
						)}
					>
						<span
							className={clsxm(
								'relative text-(--nav-item-icon-default)',
								'transition-[color,transform] duration-(--duration-fast) ease-hover',
								'group-hover:text-(--nav-item-icon-hover)',
								'group-focus-visible:text-(--nav-item-icon-active)',
								'group-active:scale-[0.97] motion-reduce:transform-none',
							)}
						>
							{children}
						</span>
					</AnchorOrLink>
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

export { ExternalNavigationItem }
