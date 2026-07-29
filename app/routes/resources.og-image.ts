import { cache, cachified } from '@/utils/cache.server'

import { OG_CACHE_TTL_MS } from '@/og/constants'
import { renderOgTemplatePng } from '@/og/render.server'
import { getOgImageVerificationSecrets } from '@/og/secrets.server'
import { decodePngFromCache, encodePngForCache } from '@/og/kv-cache.server'
import { verifyOgImageRequest } from '@/og/url.server'

import { type Route } from './+types/resources.og-image'

function pngResponse(
	png: Uint8Array,
	{ cacheStatus }: { cacheStatus: 'HIT' | 'MISS' },
) {
	return new Response(png.slice().buffer as ArrayBuffer, {
		status: 200,
		headers: {
			'Content-Type': 'image/png',
			// Cards are immutable once signed: the template version is baked into
			// the signature, so any visual change ships as a new URL rather than a
			// mutation of this one.
			'Cache-Control': 'public, max-age=31536000, immutable',
			'X-Og-Cache': cacheStatus,
		},
	})
}

export async function loader({ request }: Route.LoaderArgs) {
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		return new Response('Method not allowed', {
			status: 405,
			headers: { Allow: 'GET, HEAD' },
		})
	}

	const secrets = getOgImageVerificationSecrets()
	if (secrets.length === 0) {
		return new Response(null, { status: 404 })
	}

	const url = new URL(request.url)
	// Returns null on every failure path (bad signature, unknown template,
	// stale version, oversized payload) — collapsed to a single 404 so a probe
	// can't distinguish which check failed.
	const verified = await verifyOgImageRequest(url.searchParams, secrets)
	if (!verified) {
		return new Response(null, { status: 404 })
	}

	let cacheStatus: 'HIT' | 'MISS' = 'HIT'
	const pngBase64 = await cachified({
		key: verified.cacheKey,
		cache,
		ttl: OG_CACHE_TTL_MS,
		getFreshValue: async () => {
			cacheStatus = 'MISS'
			const { png } = await renderOgTemplatePng(
				verified.template,
				verified.params,
			)
			return encodePngForCache(png)
		},
	})

	return pngResponse(decodePngFromCache(pngBase64), { cacheStatus })
}
