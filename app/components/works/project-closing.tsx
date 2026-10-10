import ArrowLeftIcon from '@/assets/arrow-left-icon'
import { AnchorOrLink } from '@/components/links/anchor-or-link'
import { Paragraph } from '@/components/typography'
import { ButtonLink } from '@/components/ui/button'

interface ProjectClosingProps {
	projectTitle: string
	projectSlug: string
}

export function ProjectClosing({
	projectTitle,
	projectSlug,
}: ProjectClosingProps) {
	const subject = encodeURIComponent(`Project inquiry — ${projectTitle}`)

	return (
		<div className="mt-5 flex w-full flex-col items-start gap-4 pt-7">
			<div className="h-px w-full bg-(--border-primary)" />
			<div className="flex w-full flex-wrap items-start gap-2 py-4">
				<Paragraph prose={false} className="text-lg leading-7">
					Have something you’d like to build together?
				</Paragraph>
				<AnchorOrLink
					href={`mailto:me@hanihusam.com?subject=${subject}`}
					className="text-lg leading-7 text-(--text-title-secondary) hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--text-title-secondary)"
					data-umami-event="case-study-inquiry-click"
					data-umami-event-page="project"
					data-umami-event-project={projectSlug}
				>
					Let’s talk
				</AnchorOrLink>
			</div>
			<ButtonLink
				to="/works"
				variant="ghost"
				size="sm"
				iconLeft={<ArrowLeftIcon />}
			>
				Back to the list
			</ButtonLink>
		</div>
	)
}
