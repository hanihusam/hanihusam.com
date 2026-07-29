import { invariant } from '@epic-web/invariant'

/**
 * The secret used to *sign* new URLs. Always the current one.
 * `env.server.ts` asserts its presence at boot.
 */
export function getOgImageSecret() {
	const secret = process.env.OG_IMAGE_SECRET?.trim()
	invariant(secret, 'OG_IMAGE_SECRET is required')
	return secret
}

/**
 * Secrets accepted when *verifying* an incoming URL: the current one plus any
 * previous ones. Cards are scraped and cached externally under a one-year
 * immutable cache-control, so rotating the secret without this would 404 every
 * link already shared. Previous secrets are never used for signing.
 */
export function getOgImageVerificationSecrets() {
	const current = process.env.OG_IMAGE_SECRET?.trim()
	const previous = (process.env.OG_IMAGE_PREVIOUS_SECRETS ?? '')
		.split(',')
		.map((candidate) => candidate.trim())
		.filter(Boolean)
	return current ? [current, ...previous] : previous
}
