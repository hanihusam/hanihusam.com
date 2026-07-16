import ArrowRightIcon from '@/assets/arrow-right-icon'
import { BlurrableImage } from '@/components/blurrable-image'
import { H3, Paragraph } from '@/components/typography'
import { ButtonLink } from '@/components/ui/button'
import { type ProjectFrontmatter } from '@/types'
import { clsxm } from '@/utils/clsxm'
import { getImageBuilder, getImgProps } from '@/utils/images'

import { TechIcon } from './tech-icon'

import { SiGithub } from '@icons-pack/react-simple-icons'
import { LinkIcon } from '@phosphor-icons/react'

type ProjectCardProps = {
	project: ProjectFrontmatter
} & React.ComponentPropsWithoutRef<'div'>

export function ProjectCard({ project, className }: ProjectCardProps) {
	return (
		<div
			className={clsxm(
				'flex h-full flex-col gap-4 lg:flex-row lg:gap-8',
				className,
			)}
		>
			<div className="relative aspect-video shrink-0 lg:aspect-square lg:h-full">
				{project.bannerSquareCloudinaryId ? (
					<figure className="pointer-events-none isolate z-1 hidden h-full overflow-hidden rounded-xl bg-(--surface-thumbnail) lg:block lg:aspect-square">
						<BlurrableImage
							key={project.bannerSquareCloudinaryId}
							blurDataUrl={project.bannerSquareBlurDataUrl}
							className="aspect-square overflow-hidden rounded-xl"
							img={
								<img
									title={project.title}
									{...getImgProps(
										getImageBuilder(
											project.bannerSquareCloudinaryId,
											`image-${project.title}`,
										),
										{
											widths: [284, 568],
											sizes: ['284px'],
											transformations: {
												resize: {
													type: 'fill',
													aspectRatio: '1:1',
												},
											},
										},
									)}
									className="focus-ring motion-safe:ease w-full object-cover object-center will-change-transform motion-safe:transition-transform motion-safe:duration-(--duration-base) motion-safe:group-hover:scale-105"
									loading="lazy"
								/>
							}
						/>
					</figure>
				) : null}
				{project.bannerLandscapeCloudinaryId ? (
					<figure className="pointer-events-none isolate z-1 aspect-video overflow-hidden rounded-xl bg-(--surface-thumbnail) lg:hidden">
						<BlurrableImage
							key={project.bannerLandscapeCloudinaryId}
							blurDataUrl={project.bannerBlurDataUrl}
							className="aspect-video overflow-hidden rounded-xl"
							img={
								<img
									title={project.title}
									{...getImgProps(
										getImageBuilder(
											project.bannerLandscapeCloudinaryId,
											`image-${project.title}`,
										),
										{
											widths: [280, 560, 840, 1100],
											sizes: [
												'(max-width:639px) 80vw',
												'(min-width:640px) 40vw',
											],
											transformations: {
												resize: {
													type: 'fill',
													aspectRatio: '16:9',
												},
											},
										},
									)}
									className="focus-ring motion-safe:ease w-full object-cover object-center will-change-transform motion-safe:transition-transform motion-safe:duration-(--duration-base) motion-safe:group-hover:scale-105"
									loading="lazy"
								/>
							}
						/>
					</figure>
				) : null}
			</div>
			<div className="grow rounded-xl border border-(--border-primary) p-6 lg:p-8">
				<H3>{project.title}</H3>
				<Paragraph className="mt-6">{project.description}</Paragraph>
				<ul className="mt-6 flex items-center gap-2">
					{(typeof project.techs === 'string'
						? project.techs.split(',')
						: []
					).map((tech) => (
						<TechIcon key={tech.trim()} tech={tech} />
					))}
				</ul>
				<div className="mt-10 flex w-full flex-wrap items-center justify-between gap-4">
					<ButtonLink
						to={`/works/${project.slug}`}
						iconRight={<ArrowRightIcon />}
					>
						View Project
					</ButtonLink>
					<div className="flex items-center gap-4">
						{project.github ? (
							<a
								href={project.github}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 text-base leading-(--paragraph-leading) text-(--text-paragraph) transition-colors hover:text-(--text-link)"
							>
								<SiGithub size={16} />
								Repository
							</a>
						) : null}
						{project.link ? (
							<a
								href={project.link}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 text-base leading-(--paragraph-leading) text-(--text-paragraph) transition-colors hover:text-(--text-link)"
							>
								<LinkIcon className="size-4" />
								Open Live Site
							</a>
						) : null}
					</div>
				</div>
			</div>
		</div>
	)
}
