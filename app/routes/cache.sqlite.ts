import { cache } from '@/utils/cache.server'
import {
	getInstanceInfo,
	getInternalInstanceDomain,
} from '@/utils/cjs/litefs-js.server'
import { getRequiredServerEnvVar } from '@/utils/misc'

import { type ActionFunctionArgs, json, redirect } from '@remix-run/node'

export async function action({ request }: ActionFunctionArgs) {
	const { currentIsPrimary, primaryInstance } = await getInstanceInfo()
	if (!currentIsPrimary) {
		throw new Error(
			`${request.url} should only be called on the primary instance (${primaryInstance})}`,
		)
	}
	const token = getRequiredServerEnvVar('INTERNAL_COMMAND_TOKEN')
	const isAuthorized =
		request.headers.get('Authorization') === `Bearer ${token}`
	if (!isAuthorized) {
		console.log(
			`Unauthorized request to ${request.url}, redirecting to solid tunes 🎶`,
		)
		// rick roll them
		return redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
	}
	const { key, cacheValue } = await request.json()
	if (cacheValue === undefined) {
		console.log(`Deleting ${key} from the cache from remote`)
		await cache.delete(key)
	} else {
		console.log(`Setting ${key} in the cache from remote`)
		await cache.set(key, cacheValue)
	}
	return json({ success: true })
}

export async function updatePrimaryCacheValue({
	key,
	cacheValue,
}: {
	key: string
	cacheValue: any
}) {
	const { currentIsPrimary, primaryInstance } = await getInstanceInfo()
	if (currentIsPrimary) {
		throw new Error(
			`updatePrimaryCacheValue should not be called on the primary instance (${primaryInstance})}`,
		)
	}
	const domain = getInternalInstanceDomain(primaryInstance)
	const token = getRequiredServerEnvVar('INTERNAL_COMMAND_TOKEN')
	return fetch(`${domain}/cache/sqlite`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ key, cacheValue }),
	})
}
