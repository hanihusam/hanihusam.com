import { clsxm } from '@/utils/clsxm'

import { resumeMonoClass } from './styles'

interface ResumeKeysProps {
	label: string
	items: readonly string[]
}

/** "Tools Figma Storybook": a mono label and boxed keys (Figma component Key). */
export function ResumeKeys({ label, items }: ResumeKeysProps) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<span className={clsxm(resumeMonoClass, 'text-(--text-label)')}>
				{label}
			</span>
			<ul role="list" className="contents">
				{items.map((item) => (
					<li
						key={item}
						className={clsxm(
							resumeMonoClass,
							'rounded-[4px] border border-(--text-label) px-2 py-1 text-(--text-label)',
						)}
					>
						{item}
					</li>
				))}
			</ul>
		</div>
	)
}
