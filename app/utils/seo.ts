import { type RequestInfo } from '@/utils/helpers'
import { getSocialImage } from '@/utils/images'

const SITE_NAME = 'Hani Husamuddin'

export const DEFAULT_TITLE = 'Hani Husamuddin'
export const DEFAULT_DESCRIPTION =
	'A professional freelancer who could help you solve your software engineer and UI design problem'

// Pulls the request info exposed by the root loader out of a route's meta
// `matches`, so child-route meta functions can build absolute URLs.
export function getRootRequestInfo(
	matches: Array<{ id: string; loaderData?: unknown } | undefined>,
): RequestInfo | undefined {
	const root = matches.find((m) => m?.id === 'root')
	const data = root?.loaderData as { requestInfo?: RequestInfo } | undefined
	return data?.requestInfo
}

// Builds the full set of SEO/social meta descriptors for a page. Pass a
// pre-built `image` (via getSocialImage) or let it generate a generic card.
export function getSocialMetas({
	url,
	title = DEFAULT_TITLE,
	description = DEFAULT_DESCRIPTION,
	image,
	keywords = '',
	ogType = 'website',
}: {
	url: string
	title?: string
	description?: string
	image?: string
	keywords?: string
	ogType?: 'website' | 'article'
}) {
	const socialImage = image ?? getSocialImage({ title, url })

	return [
		{ title },
		{ name: 'description', content: description },
		{ name: 'keywords', content: keywords },
		{ name: 'image', content: socialImage },
		{ property: 'og:url', content: url },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: description },
		{ property: 'og:image', content: socialImage },
		{ property: 'og:type', content: ogType },
		{ property: 'og:site_name', content: SITE_NAME },
		{ name: 'twitter:card', content: 'summary_large_image' },
		{ name: 'twitter:title', content: title },
		{ name: 'twitter:description', content: description },
		{ name: 'twitter:image', content: socialImage },
		{ name: 'twitter:image:alt', content: title },
	]
}
