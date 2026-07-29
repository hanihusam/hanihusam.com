import {
	OG_ASSETS,
	OG_CLOUDINARY_CLOUD_NAME,
	OG_CLOUDINARY_HOST,
} from '@/og/constants'

const MAX_ASSET_BYTES = 5_000_000
const FETCH_TIMEOUT_MS = 8_000

/**
 * Delivery transforms per slot. `f_png` keeps the transparency the artwork and
 * avatar rely on; sizes are ~2x their rendered box so the raster stays crisp
 * without pulling the full-resolution original through on every cold render.
 */
const ASSET_TRANSFORMS = {
	background: 'c_fill,w_1200,h_630,f_png,q_auto:good',
	avatar: 'c_fill,w_256,h_256,f_png,q_auto:good',
	artwork: 'c_fit,w_760,h_760,f_png,q_auto:good',
} as const

type AssetSlot = keyof typeof ASSET_TRANSFORMS

function buildCloudinaryUrl(publicId: string, slot: AssetSlot) {
	const url = new URL(
		`https://${OG_CLOUDINARY_HOST}/${OG_CLOUDINARY_CLOUD_NAME}/image/upload/${ASSET_TRANSFORMS[slot]}/${publicId}`,
	)
	// The public id is already constrained by the zod schema, so this can only
	// fail if that contract is broken. Assert anyway: it is the one place where
	// signed input becomes an outbound request, and a bare `fetch` of an
	// attacker-shaped URL is the failure mode worth being paranoid about.
	if (url.protocol !== 'https:' || url.hostname !== OG_CLOUDINARY_HOST) {
		throw new Error(`Refusing to fetch OG asset from ${url.hostname}`)
	}
	return url
}

function toDataUri(bytes: Uint8Array, contentType: string) {
	return `data:${contentType};base64,${Buffer.from(bytes).toString('base64')}`
}

async function fetchAssetAsDataUri(publicId: string, slot: AssetSlot) {
	const url = buildCloudinaryUrl(publicId, slot)
	const response = await fetch(url, {
		signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
	})
	if (!response.ok) {
		throw new Error(
			`Failed to fetch OG asset ${publicId} (${response.status} ${response.statusText})`,
		)
	}

	const declaredLength = Number(response.headers.get('content-length'))
	if (Number.isFinite(declaredLength) && declaredLength > MAX_ASSET_BYTES) {
		throw new Error(`OG asset too large: ${publicId} (${declaredLength} bytes)`)
	}

	const buffer = new Uint8Array(await response.arrayBuffer())
	if (buffer.byteLength > MAX_ASSET_BYTES) {
		throw new Error(
			`OG asset too large: ${publicId} (${buffer.byteLength} bytes)`,
		)
	}

	return toDataUri(buffer, response.headers.get('content-type') ?? 'image/png')
}

// The background, avatar and default artwork are the same on every card, so
// hold them for the process lifetime. Same promise-cache-with-self-heal rule as
// the fonts: a failed fetch must not be cached.
const staticAssetCache = new Map<string, Promise<string>>()

function resolveStaticAsset(publicId: string, slot: AssetSlot) {
	const cacheKey = `${slot}:${publicId}`
	let cached = staticAssetCache.get(cacheKey)
	if (!cached) {
		cached = fetchAssetAsDataUri(publicId, slot).catch((error: unknown) => {
			staticAssetCache.delete(cacheKey)
			throw error
		})
		staticAssetCache.set(cacheKey, cached)
	}
	return cached
}

export function resolveBackgroundDataUri() {
	return resolveStaticAsset(OG_ASSETS.background, 'background')
}

export function resolveAvatarDataUri() {
	return resolveStaticAsset(OG_ASSETS.avatar, 'avatar')
}

/**
 * Project cards pass their own banner id; everything else falls back to the
 * shared illustration. Only the shared one is memoised — per-project artwork is
 * already covered by the rendered-PNG cache.
 */
export function resolveArtworkDataUri(publicId?: string) {
	if (!publicId || publicId === OG_ASSETS.defaultArtwork) {
		return resolveStaticAsset(OG_ASSETS.defaultArtwork, 'artwork')
	}
	return fetchAssetAsDataUri(publicId, 'artwork')
}
