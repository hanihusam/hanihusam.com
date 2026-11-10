import { useId } from 'react'

import { clsxm } from '@/utils/clsxm'

import { resumeMonoClass, resumeTitleClass } from './styles'

interface ResumeSectionProps {
	number: string
	title: string
	children: React.ReactNode
	className?: string
}

/** A numbered section ("01 Experience") over a 2px ink rule. */
export function ResumeSection({
	number,
	title,
	children,
	className,
}: ResumeSectionProps) {
	const headingId = useId()

	return (
		<section
			aria-labelledby={headingId}
			className={clsxm('flex flex-col py-16 lg:py-20', className)}
		>
			<div className="flex items-baseline gap-4 border-b-2 border-(--text-title-primary) pb-4">
				<span
					aria-hidden
					className={clsxm(resumeMonoClass, 'text-(--text-caption)')}
				>
					{number}
				</span>
				<h2 id={headingId} className={resumeTitleClass}>
					{title}
				</h2>
			</div>
			{children}
		</section>
	)
}
