import { CardLayout } from '@/og/templates/card-layout'

// Card for `works/$slug`, where the artwork is the project's own banner
// resolved from the `featuredImage` Cloudinary id in the signed params.
export function ProjectCard({
	title,
	url,
	background,
	avatar,
	artwork,
}: {
	title: string
	url: string
	background: string
	avatar: string
	artwork: string
}) {
	return (
		<CardLayout
			title={title}
			url={url}
			background={background}
			avatar={avatar}
			artwork={artwork}
		/>
	)
}
