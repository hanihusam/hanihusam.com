import { type Route } from './+types/work.$slug'

import { redirect } from 'react-router'

export const loader = ({ params }: Route.LoaderArgs) =>
	redirect(`/works/${params.slug}`, 301)
