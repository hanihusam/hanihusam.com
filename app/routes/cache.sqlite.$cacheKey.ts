import { cache } from '@/utils/cache.server'
import { ensureInstance } from '@/utils/cjs/litefs-js.server'

import { invariant } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { getAllInstances, getInstanceInfo } from 'litefs-js'

export async function loader({ request, params }: LoaderFunctionArgs) {
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
