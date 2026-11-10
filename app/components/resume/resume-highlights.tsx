import { clsxm } from '@/utils/clsxm'

import { resumeHighlights } from './content'
import { resumeMonoClass, resumeTitleClass } from './styles'

export function ResumeHighlights() {
	return (
		<ol
			aria-label="Highlights"
			className="flex flex-col gap-4 pb-16 lg:flex-row lg:gap-6 lg:pb-20"
		>
			{resumeHighlights.map((highlight, index) => (
				<li
					key={highlight}
					className="flex flex-1 flex-col gap-4 border-l border-(--border-default) pr-6 pl-4"
				>
					<span
						aria-hidden
						className={clsxm(resumeMonoClass, 'text-(--text-caption)')}
					>
						{String(index + 1).padStart(2, '0')}
					</span>
					<p className={resumeTitleClass}>{highlight}</p>
				</li>
			))}
		</ol>
	)
}
