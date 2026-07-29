import { CardLayout } from '@/og/templates/card-layout'

// Card for non-project pages (home, about, works index). Always uses the
// default brand illustration, so the artwork is not a signed parameter.
export function PageCard({
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
