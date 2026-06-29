import { Text } from '@/components/typography'

import {
	SiApollographql,
	SiBootstrap,
	SiGraphql,
	SiNextdotjs,
	SiReact,
	SiReactrouter,
	SiRedux,
	SiTailwindcss,
	SiTypescript,
} from '@icons-pack/react-simple-icons'
import {
	Arrow,
	Content,
	Provider,
	Root,
	Trigger,
} from '@radix-ui/react-tooltip'

type TechEntry = { label: string; icon: React.ReactNode }

function TechBadge({ slug }: { slug: string }) {
	const abbr = slug.replace(/-/g, '').slice(0, 2).toUpperCase()
	return (
		<span className="flex size-5 items-center justify-center rounded border border-current text-[7px] leading-none font-bold">
			{abbr}
		</span>
	)
}

const techMap: Record<string, TechEntry> = {
	tailwindcss: { label: 'Tailwind CSS', icon: <SiTailwindcss size={20} /> },
	'tailwind css': { label: 'Tailwind CSS', icon: <SiTailwindcss size={20} /> },
	'react-router': { label: 'React Router', icon: <SiReactrouter size={20} /> },
	'react router': { label: 'React Router', icon: <SiReactrouter size={20} /> },
	'apollo-client': {
		label: 'Apollo Client',
		icon: <SiApollographql size={20} />,
	},
	'apollo client': {
		label: 'Apollo Client',
		icon: <SiApollographql size={20} />,
	},
	'react-bootstrap': {
		label: 'React Bootstrap',
		icon: <SiBootstrap size={20} />,
	},
	'react bootstrap': {
		label: 'React Bootstrap',
		icon: <SiBootstrap size={20} />,
	},
	redux: { label: 'Redux', icon: <SiRedux size={20} /> },
	react: { label: 'React', icon: <SiReact size={20} /> },
	typescript: { label: 'TypeScript', icon: <SiTypescript size={20} /> },
	nextjs: { label: 'Next.js', icon: <SiNextdotjs size={20} /> },
	'next-js': { label: 'Next.js', icon: <SiNextdotjs size={20} /> },
	'next.js': { label: 'Next.js', icon: <SiNextdotjs size={20} /> },
	graphql: { label: 'GraphQL', icon: <SiGraphql size={20} /> },
}

type TechIconProps = { tech: string }

export function TechIcon({ tech }: TechIconProps) {
	const slug = tech.trim().toLowerCase()
	const entry = techMap[slug]
	const label = entry?.label ?? slug.replace(/-/g, ' ')
	const icon = entry?.icon ?? <TechBadge slug={slug} />

	return (
		<Provider delayDuration={100}>
			<Root>
				<Trigger asChild>
					<li className="size-5 cursor-default text-(--icon-primary) focus:outline-none">
						{icon}
					</li>
				</Trigger>
				<Content className="TooltipContent" sideOffset={5}>
					<Text
						className="text-neutral-50 capitalize dark:text-neutral-950"
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
