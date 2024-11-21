import { cache } from '@/utils/cache.server'

import {
	commitShaKey as refreshCacheCommitShaKey,
	isRefreshShaInfo,
	type RefreshShaInfo,
} from './action.refresh-cache'

export async function loader() {
	const result = await cache.get(refreshCacheCommitShaKey)
	if (!result) {
		return null
	}

	let value: RefreshShaInfo
	try {
		value = JSON.parse(result.value as any)
		if (!isRefreshShaInfo(value)) {
			throw new Error(`Invalid value: ${result.value}`)
		}
	} catch (error: unknown) {
		console.error(`Error parsing commit sha from cache: ${error}`)
		cache.delete(refreshCacheCommitShaKey)
		return null
	}

	return value
}
