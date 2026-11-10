import { clsxm } from '@/utils/clsxm'

import { resumeBodyClass, resumeMonoClass, resumeTitleClass } from './styles'

interface ResumeRowProps {
	title: string
	dates: string
	location?: string
	/** The description and bullets under the title. */
	children: React.ReactNode
	/** Positions a HandMark relative to the row. */
	className?: string
}

/** One entry: dates and place on the left, the role or degree on the right. */
export function ResumeRow({
	title,
	dates,
	location,
	children,
	className,
}: ResumeRowProps) {
	return (
		<article
			className={clsxm(
				'flex flex-col gap-4 border-t border-(--border-default) py-8 first:border-t-0 md:flex-row md:gap-12',
				className,
			)}
		>
			<div className="flex shrink-0 flex-col gap-2 md:w-50 lg:w-66">
				<p className={clsxm(resumeMonoClass, 'text-(--text-overline)')}>
					{dates}
				</p>
				{location ? (
					<p className="text-base leading-5 text-(--text-caption)">
						{location}
					</p>
				) : null}
			</div>
			<div
				className={clsxm(resumeBodyClass, 'flex min-w-0 flex-1 flex-col gap-3')}
			>
				<h3 className={resumeTitleClass}>{title}</h3>
				{children}
			</div>
		</article>
	)
}
