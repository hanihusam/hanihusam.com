import { Grid } from '@/components/grid'
import { Header } from '@/components/header'
import { Reveal } from '@/components/reveal'
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
			<Reveal variant="settle">
				<Header title={title} subTitle={subTitle} cta={cta} ctaUrl="/works" />
			</Reveal>
			<Spacer size="lg" />
			<Grid className="gap-6">
				{posts.map((project, idx) => (
					<Reveal
						key={project.slug}
						variant="stagger"
						index={idx}
						className={clsxm('col-span-full', { 'hidden lg:block': idx >= 2 })}
					>
						<ProjectCard
							className={clsxm({ 'lg:flex-row-reverse': idx % 2 === 0 })}
							project={project}
						/>
					</Reveal>
				))}
			</Grid>
		</>
	)
}
