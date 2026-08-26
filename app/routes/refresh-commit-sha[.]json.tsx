import { cache } from '@/utils/cache.server'

import {
	commitShaKey as refreshCacheCommitShaKey,
	isRefreshShaInfo,
} from './action.refresh-cache'

export async function loader() {
	const result = await cache.get(refreshCacheCommitShaKey)
	if (!result) {
		return null
	}

	const value = result.value
	try {
		if (!isRefreshShaInfo(value)) {
			throw new Error(`Invalid value: ${JSON.stringify(value)}`)
		}
	} catch (error: unknown) {
		console.error(`Error parsing commit sha from cache: ${error}`)
		cache.delete(refreshCacheCommitShaKey)
		return null
	}

	return value
}
