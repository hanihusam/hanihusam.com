import { ResumePage } from '@/components/resume/resume-page'
import {
	RESUME_CARD_TITLE,
	RESUME_DESCRIPTION,
	RESUME_TITLE,
	resumeLinks,
} from '@/components/resume/route-meta'
import { getUrl } from '@/utils/helpers'
import { getRootRequestInfo, getSocialMetas } from '@/utils/seo'

import { getResumeSocialImage } from '@/og/social-images.server'

import { type Route } from './+types/resume_.upwork'

import { data, type HeadersArgs } from 'react-router'

// The contact-free resume for Upwork proposals: no nav or footer (both show
// Mail and LinkedIn), kept out of search and the sitemap.
export const handle = { paper: true, chrome: false }

export const links: Route.LinksFunction = resumeLinks

export const meta: Route.MetaFunction = ({ loaderData, matches }) => {
	return [
		...getSocialMetas({
			url: getUrl(getRootRequestInfo(matches)),
			title: RESUME_TITLE,
			description: RESUME_DESCRIPTION,
			image: loaderData?.socialImage,
		}),
		{ name: 'robots', content: 'noindex' },
	]
}

// Only a loader here. (`actionHeaders ? … : loaderHeaders` would always pick
// actionHeaders: an empty Headers object counts as true.)
export function headers({ loaderHeaders }: HeadersArgs) {
	return loaderHeaders
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	return data(
		{
			socialImage: getResumeSocialImage({ request, title: RESUME_CARD_TITLE }),
		},
		{
			headers: {
				'Cache-Control': 'private, max-age=3600',
				Vary: 'Cookie',
				'X-Robots-Tag': 'noindex',
			},
		},
	)
}

export default function ResumeUpworkRoute() {
	return <ResumePage variant="upwork" />
}
