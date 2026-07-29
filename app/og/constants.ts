export const OG_IMAGE_PATH = '/resources/og-image'

export const OG_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days
export const OG_MAX_PARAMS_ENCODED_LENGTH = 4096

export const OG_CANVAS = {
	width: 1200,
	height: 630,
} as const

// Matches the current Cloudinary-composed card (see docs/og-image-migration.md
// §3). Pinned against the live render, not derived from theme.css — the
// baked background asset predates the design-token system.
export const OG_COLORS = {
	background: '#1c1f2b',
	white: '#ffffff',
	muted: '#9ca3af',
} as const

export const OG_CLOUDINARY_CLOUD_NAME = 'hanihusam'
export const OG_CLOUDINARY_HOST = 'res.cloudinary.com'

// The same three assets the current Cloudinary-composed card uses, so the
// rendered output stays visually identical. Copied here rather than imported
// from `utils/images.ts`, whose social-image half is deleted in Phase 7.
export const OG_ASSETS = {
	background: 'bapak2.dev/images/social-background_garrsb',
	avatar: 'bapak2.dev/images/avatar-side_kz5o6d',
	defaultArtwork: 'bapak2.dev/images/placeholder-image-transparent_kzwqef',
} as const
