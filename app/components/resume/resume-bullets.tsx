import { clsxm } from '@/utils/clsxm'

import { resumeBodyClass } from './styles'

export function ResumeBullets({ children }: { children: React.ReactNode }) {
	return (
		<ul
			className={clsxm(
				resumeBodyClass,
				'list-disc ps-6 marker:text-(--text-paragraph)',
			)}
		>
			{children}
		</ul>
	)
}
