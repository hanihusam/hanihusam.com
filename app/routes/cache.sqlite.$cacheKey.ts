import { cache } from '@/utils/cache.server'

import { type Route } from './+types/cache.sqlite.$cacheKey'

import { invariant } from '@epic-web/invariant'

export async function loader({ params }: Route.LoaderArgs) {
	const { cacheKey } = params
	invariant(cacheKey, 'cacheKey is required')
	return {
		cacheKey,
		value: cache.get(cacheKey),
	}
}
