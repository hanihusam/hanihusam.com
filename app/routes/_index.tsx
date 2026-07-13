import * as React from 'react'

import { HeroSection } from '@/components/home/hero-section'
import { ProjectSection } from '@/components/home/project-section'
import { SubstackSection } from '@/components/home/substack-section'
import { Spacer } from '@/components/spacer'
import { getSignedSocialImage } from '@/utils/cloudinary.server'
import { getUrl } from '@/utils/helpers'
import { getContentMdxListItems } from '@/utils/mdx.server'
import { getRootRequestInfo, getSocialMetas } from '@/utils/seo'
import { getFeaturedSubstackPosts } from '@/utils/substack.server'

import { type Route } from './+types/_index'

import { data, type HeadersArgs } from 'react-router'

const PAGE_TITLE = 'Frontend & UI Engineer — Hani Husamuddin'
const PAGE_DESCRIPTION =
	'Personal website and online portfolio of Hani Husamuddin, a frontend engineer and UI designer from Yogyakarta, Indonesia. Currently, crafting interfaces by intersecting design and code.'

export const meta: Route.MetaFunction = ({ loaderData, matches }) => {
	return getSocialMetas({
		url: getUrl(getRootRequestInfo(matches)),
		title: PAGE_TITLE,
		description: PAGE_DESCRIPTION,
		image: loaderData?.socialImage,
	})
}

export const handle = { surface: 'secondary' as const }

export function headers({ actionHeaders, loaderHeaders }: HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const [substackPosts, projects] = await Promise.all([
		getFeaturedSubstackPosts(3),
		getContentMdxListItems('projects', { request }),
	])

	return data(
		{
			substackPosts,
			projects: projects.slice(0, 3),
			socialImage: getSignedSocialImage({
				request,
				title: 'Crafting interfaces by intersecting design and code.',
			}),
		},
		{
			headers: {
				'Cache-Control': 'private, max-age=3600',
				Vary: 'Cookie',
			},
		},
	)
}

export default function IndexRoute({ loaderData }: Route.ComponentProps) {
	const { substackPosts, projects } = loaderData

	return (
		<React.Fragment>
			<HeroSection />

			<Spacer id="projects" size="lg" />
			<Spacer size="lg" />
			<ProjectSection
				title="Featured Projects"
				subTitle="A bunch of projects that I worked on."
				cta="See more projects"
				posts={projects}
			/>
			<Spacer size="lg" />
			<Spacer size="lg" />
			<SubstackSection
				title="Recent Writing"
				subTitle="Find the latest of my writing here."
				cta="Read on Substack"
				posts={substackPosts}
			/>
			<Spacer size="lg" />
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
