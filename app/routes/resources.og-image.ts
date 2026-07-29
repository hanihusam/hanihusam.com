import fs from 'node:fs/promises'
import path from 'node:path'

import { cache, cachified } from '@/utils/cache.server'

import { OG_CACHE_TTL_MS } from '@/og/constants'
import { renderOgTemplatePng } from '@/og/render.server'
import { getOgImageVerificationSecrets } from '@/og/secrets.server'
import { decodePngFromCache, encodePngForCache } from '@/og/kv-cache.server'
import { verifyOgImageRequest } from '@/og/url.server'

import { type Route } from './+types/resources.og-image'

type CacheStatus = 'HIT' | 'MISS' | 'DEGRADED' | 'FALLBACK'

function pngResponse(
	png: Uint8Array,
	{ cacheStatus }: { cacheStatus: CacheStatus },
) {
	// HIT/MISS are only ever reached for a fully healthy render (see
	// getFreshValue below), so they keep the original immutable contract: the
	// template version is baked into the signature, so any visual change ships
	// as a new URL rather than a mutation of this one. A DEGRADED or FALLBACK
	// render is a temporary asset problem, not a new card, so it gets a short
	// max-age instead — long enough to absorb a burst of scraper requests
	// during an outage, short enough that a healthy render replaces it soon
	// after Cloudinary recovers.
	const cacheControl =
		cacheStatus === 'HIT' || cacheStatus === 'MISS'
			? 'public, max-age=31536000, immutable'
			: 'public, max-age=300, must-revalidate'

	return new Response(png.slice().buffer as ArrayBuffer, {
		status: 200,
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': cacheControl,
			'X-Og-Cache': cacheStatus,
		},
	})
}

const FALLBACK_PNG_PATH = path.join(process.cwd(), 'public/og-fallback.png')

// Same memoised-promise-with-self-heal shape as getOgFonts / the static asset
// cache: hold the bytes for the process lifetime, but drop the promise on
// rejection so a transient read error does not permanently break the
// last-resort path.
let fallbackPngPromise: Promise<Buffer> | null = null

function getFallbackPng() {
	if (!fallbackPngPromise) {
		fallbackPngPromise = fs
			.readFile(FALLBACK_PNG_PATH)
			.catch((error: unknown) => {
				fallbackPngPromise = null
				throw error
			})
	}
	return fallbackPngPromise
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

	// Everything from here down is "the render": a bad Cloudinary asset already
	// degrades gracefully inside renderOgTemplatePng (see assets.server.ts), but
	// if satori or resvg itself throws — a genuinely last-resort failure — this
	// catch serves the static checked-in PNG rather than a 500 HTML page for a
	// route that must always return image/png.
	try {
		let cacheStatus: CacheStatus = 'HIT'
		const pngBase64 = await cachified({
			key: verified.cacheKey,
			cache,
			ttl: OG_CACHE_TTL_MS,
			getFreshValue: async (context) => {
				const { png, degraded } = await renderOgTemplatePng(
					verified.template,
					verified.params,
				)
				if (degraded) {
					cacheStatus = 'DEGRADED'
					// A negative ttl tells cachified to skip writing this value —
					// documented in its README under "Fine-tuning cache metadata based
					// on fresh values". `context.metadata` is the same object the
					// library checks after this callback returns, so mutating it here
					// is how a single fetch (this one) opts out of the 30-day cache
					// without affecting the ttl option for every other call. A blip
					// must not become a broken card cached for a month.
					context.metadata.ttl = -1
				} else {
					cacheStatus = 'MISS'
				}
				return encodePngForCache(png)
			},
		})

		return pngResponse(decodePngFromCache(pngBase64), { cacheStatus })
	} catch (error: unknown) {
		console.error('OG image render failed, serving static fallback:', error)
		try {
			const png = await getFallbackPng()
			return pngResponse(png, { cacheStatus: 'FALLBACK' })
		} catch (fallbackError: unknown) {
			console.error('Static OG fallback also failed to load:', fallbackError)
			return new Response(null, { status: 500 })
		}
	}
}
