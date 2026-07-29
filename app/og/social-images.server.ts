import { removeTrailingSlash } from '@/utils/helpers'

import { OG_ASSETS } from '@/og/constants'
import { getOgImageSecret } from '@/og/secrets.server'
import { buildOgImageUrl } from '@/og/url.server'

// Matches the `url` shown on the card: no protocol, no query string — e.g.
// hanihusam.com/works/curious-me.
function displayUrlFromRequest(request: Request) {
	const url = new URL(request.url)
	return removeTrailingSlash(`${url.host}${url.pathname}`)
}

export function getPageSocialImage({
	request,
	title,
}: {
	request: Request
	title: string
}) {
	const origin = new URL(request.url).origin
	return buildOgImageUrl(
		origin,
		'page',
		{ title, url: displayUrlFromRequest(request) },
		getOgImageSecret(),
	)
}

export function getProjectSocialImage({
	request,
	title,
	featuredImage,
}: {
	request: Request
	title: string
	featuredImage?: string
}) {
	const origin = new URL(request.url).origin
	return buildOgImageUrl(
		origin,
		'project',
		{
			title,
			url: displayUrlFromRequest(request),
			featuredImage: featuredImage ?? OG_ASSETS.defaultArtwork,
		},
		getOgImageSecret(),
	)
}
