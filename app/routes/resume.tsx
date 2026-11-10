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

import { type Route } from './+types/resume'

import { data, type HeadersArgs } from 'react-router'

export const handle = { paper: true }

export const links: Route.LinksFunction = resumeLinks

export const meta: Route.MetaFunction = ({ loaderData, matches }) => {
	return getSocialMetas({
		url: getUrl(getRootRequestInfo(matches)),
		title: RESUME_TITLE,
		description: RESUME_DESCRIPTION,
		image: loaderData?.socialImage,
	})
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
			},
		},
	)
}

export default function ResumeRoute() {
	return <ResumePage variant="site" />
}
