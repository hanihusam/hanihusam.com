import { cache } from '@/utils/cache.server'
import { ensureInstance } from '@/utils/cjs/litefs-js.server'

import { type Route } from './+types/cache.sqlite.$cacheKey'

import { invariant } from '@epic-web/invariant'
import { getAllInstances, getInstanceInfo } from 'litefs-js'

export async function loader({ request, params }: Route.LoaderArgs) {
	const searchParams = new URL(request.url).searchParams
	const currentInstanceInfo = await getInstanceInfo()
	const allInstances = await getAllInstances()
	const instance =
		searchParams.get('instance') ?? currentInstanceInfo.currentInstance
	await ensureInstance(instance)

	const { cacheKey } = params
	invariant(cacheKey, 'cacheKey is required')
	return {
		instance: {
			hostname: instance,
			region: allInstances[instance],
			isPrimary: currentInstanceInfo.primaryInstance === instance,
		},
		cacheKey,
		value: cache.get(cacheKey),
	}
}
