import { Grid } from '@/components/grid'
import { Header } from '@/components/header'
import { Spacer } from '@/components/spacer'
import { clsxm } from '@/utils/clsxm'

import { type Project } from 'contents/projects'

type ProjectectionProps = {
	title: string
	subTitle: string
	cta: string
	projects: Project[]
}

export function ProjectSection({
	title,
	subTitle,
	cta,
	projects,
}: ProjectectionProps) {
	return (
		<>
			<Header
				title={title}
				subTitle={subTitle}
				cta={cta}
				ctaUrl="/projects"
				reverse
			/>
			<Spacer size="2xs" />
			<Grid className="gap-10">
				{projects.map((project, idx) => (
					<div
						key={idx}
						className={clsxm('col-span-4', {
							'hidden lg:block': idx >= 2,
						})}
					>
						{project.name}
					</div>
				))}
			</Grid>
		</>
	)
}
