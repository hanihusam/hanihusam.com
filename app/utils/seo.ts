import { type RequestInfo } from '@/utils/helpers'

import { OG_CANVAS } from '@/og/constants'

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

// Builds the full set of SEO/social meta descriptors for a page. `image` is
// built server-only (it needs the OG signing secret) via `getPageSocialImage`
// / `getProjectSocialImage` in the route's loader and threaded through
// loaderData — `meta()` itself runs on the client too during navigations, so
// it must never touch the secret directly. `image` is omitted only when the
// root loader itself has thrown (ErrorBoundary render) and there is no
// loaderData to read it from.
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
	return [
		{ title },
		{ name: 'description', content: description },
		{ name: 'keywords', content: keywords },
		{ property: 'og:url', content: url },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: description },
		{ property: 'og:type', content: ogType },
		{ property: 'og:site_name', content: SITE_NAME },
		{ name: 'twitter:card', content: 'summary_large_image' },
		{ name: 'twitter:title', content: title },
		{ name: 'twitter:description', content: description },
		...(image
			? [
					{ name: 'image', content: image },
					{ property: 'og:image', content: image },
					{ property: 'og:image:width', content: String(OG_CANVAS.width) },
					{ property: 'og:image:height', content: String(OG_CANVAS.height) },
					{ property: 'og:image:type', content: 'image/png' },
					{ property: 'og:image:alt', content: title },
					{ name: 'twitter:image', content: image },
					{ name: 'twitter:image:alt', content: title },
				]
			: []),
	]
}
