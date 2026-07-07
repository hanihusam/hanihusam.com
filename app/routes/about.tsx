import * as React from 'react'

import { AboutCta } from '@/components/about/cta-section'
import { FunFactsSection } from '@/components/about/fun-facts-section'
import { AboutHero } from '@/components/about/hero-section'
import { SubstackSection } from '@/components/home/substack-section'
import { Spacer } from '@/components/spacer'
import { getSignedSocialImage } from '@/utils/cloudinary.server'
import { getUrl } from '@/utils/helpers'
import { getRootRequestInfo, getSocialMetas } from '@/utils/seo'
import { getFeaturedSubstackPosts } from '@/utils/substack.server'

import { type Route } from './+types/about'

import { data, type HeadersArgs } from 'react-router'

const PAGE_TITLE = 'About | Hani Husamuddin'
const PAGE_DESCRIPTION =
	'Get to know Hani Husamuddin — a frontend engineer and UI designer from Yogyakarta, Indonesia. Currently, crafting interfaces by intersecting design and code.'

export const meta: Route.MetaFunction = ({ loaderData, matches }) => {
	return getSocialMetas({
		url: getUrl(getRootRequestInfo(matches)),
		title: PAGE_TITLE,
		description: PAGE_DESCRIPTION,
		image: loaderData?.socialImage,
	})
}

export function headers({ actionHeaders, loaderHeaders }: HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const substackPosts = await getFeaturedSubstackPosts(3)

	return data(
		{
			substackPosts,
			socialImage: getSignedSocialImage({ request, title: PAGE_TITLE }),
		},
		{
			headers: {
				'Cache-Control': 'private, max-age=3600',
				Vary: 'Cookie',
			},
		},
	)
}

export default function AboutRoute({ loaderData }: Route.ComponentProps) {
	const { substackPosts } = loaderData

	return (
		<React.Fragment>
			<AboutHero />

			<Spacer size="lg" />
			<FunFactsSection />

			<Spacer size="lg" />
			<Spacer size="lg" />
			<SubstackSection
				title="Things I wrote about."
				subTitle="From personal essays to engineering notes, in Bahasa and English."
				cta="Read on Substack"
				posts={substackPosts}
			/>

			<Spacer size="lg" />
			<AboutCta />
		</React.Fragment>
	)
}

export function ErrorBoundary() {
	return (
		<div className="error-container">
			Something unexpected went wrong. Sorry about that.
		</div>
	)
}
