import { Grid } from '@/components/grid'
import { Header } from '@/components/header'
import { Spacer } from '@/components/spacer'
import { type InjectedMeta, type ProjectFrontmatter } from '@/types'
import { clsxm } from '@/utils/clsxm'

import { ProjectCard } from '../projects/project-card'

type Posts = ProjectFrontmatter & InjectedMeta

type ProjectSectionProps = {
	title: string
	subTitle: string
	cta: string
	posts: Posts[]
}

export function ProjectSection({
	title,
	subTitle,
	cta,
	posts,
}: ProjectSectionProps) {
	if (posts.length === 0) return null

	return (
		<>
			<Header title={title} subTitle={subTitle} cta={cta} ctaUrl="/works" />
			<Spacer size="lg" />
			<Grid className="gap-6">
				{posts.map((project, idx) => (
					<ProjectCard
						key={project.slug}
						className={clsxm('col-span-full', {
							'lg:flex-row-reverse': idx % 2 === 0,
							'hidden lg:flex': idx >= 2,
						})}
						project={project}
					/>
				))}
			</Grid>
		</>
	)
}
