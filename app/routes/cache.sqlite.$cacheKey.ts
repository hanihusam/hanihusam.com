import { cache } from '@/utils/cache.server'

import { invariant } from '@epic-web/invariant'
import { type DataFunctionArgs, json } from '@remix-run/node'
import { getAllInstances, getInstanceInfo } from 'litefs-js'
import { ensureInstance } from 'litefs-js/remix'

export async function loader({ request, params }: DataFunctionArgs) {
	const searchParams = new URL(request.url).searchParams
	const currentInstanceInfo = await getInstanceInfo()
	const allInstances = await getAllInstances()
	const instance =
		searchParams.get('instance') ?? currentInstanceInfo.currentInstance
	await ensureInstance(instance)

	const { cacheKey } = params
	invariant(cacheKey, 'cacheKey is required')
	return json({
		instance: {
			hostname: instance,
			region: allInstances[instance],
			isPrimary: currentInstanceInfo.primaryInstance === instance,
		},
		cacheKey,
		value: cache.get(cacheKey),
	})
}
