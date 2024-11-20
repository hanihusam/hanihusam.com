import { AnchorOrLink } from '@/components/links/anchor-or-link'

import { type Project } from 'contents/projects'

export function ProjectCard({ project }: { project: Project }) {
	return (
		<div className="flex max-w-xl flex-col items-start justify-between">
			<div className="flex items-center gap-x-4 text-xs">
				<a
					href={project.link.href}
					className="bg-gray-50 text-gray-600 hover:bg-gray-100 relative z-10 rounded-full px-3 py-1.5 font-medium"
				>
					{project.link.label}
				</a>
			</div>
			<div className="group relative">
				<h3 className="text-gray-900 group-hover:text-gray-600 mt-3 text-lg font-semibold leading-6">
					<a href={project.link.href}>
						<span className="absolute inset-0" />
						{project.link.label}
					</a>
				</h3>
				<p className="text-gray-600 mt-5 line-clamp-3 text-sm leading-6">
					{project.description}
				</p>
			</div>
			<div className="relative mt-8 flex items-center gap-x-4">
				<img
					src={project.cover}
					alt=""
					className="bg-gray-50 h-10 w-10 rounded-full"
				/>
				<AnchorOrLink href={project.link.href}>
					{project.link.label}
				</AnchorOrLink>
			</div>
		</div>
	)
}
