import crypto from 'node:crypto'

import { OG_IMAGE_PATH, OG_MAX_PARAMS_ENCODED_LENGTH } from '@/og/constants'
import {
	getOgTemplate,
	isOgTemplateName,
	type OgTemplateName,
} from '@/og/registry'

function encodeParams(value: unknown) {
	return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url')
}

function decodeParams(value: string): unknown {
	return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
}

/**
 * NUL separators keep the payload unambiguous: neither a template name nor
 * base64url text can contain a NUL, so no field can forge a boundary and make
 * two different payloads share a signature.
 */
export function buildOgImageCanonicalPayload({
	template,
	version,
	paramsEncoded,
}: {
	template: OgTemplateName
	version: number
	paramsEncoded: string
}) {
	return `${template}\0${version}\0${paramsEncoded}`
}

function signPayload(secret: string, canonical: string) {
	return crypto
		.createHmac('sha256', secret)
		.update(canonical, 'utf8')
		.digest('hex')
}

function buildCacheKey(canonical: string) {
	return `og-image:${crypto.createHash('sha256').update(canonical, 'utf8').digest('hex')}`
}

function constantTimeEqualHex(candidate: string, expected: string) {
	if (candidate.length !== expected.length) return false
	const candidateBytes = Buffer.from(candidate, 'hex')
	const expectedBytes = Buffer.from(expected, 'hex')
	// Buffer.from(..., 'hex') stops at the first invalid pair, so a same-length
	// but non-hex signature yields a short buffer. timingSafeEqual throws on
	// length mismatch, so this guard has to come first.
	if (candidateBytes.length !== expectedBytes.length) return false
	return crypto.timingSafeEqual(candidateBytes, expectedBytes)
}

export function buildOgImageUrl(
	origin: string,
	template: OgTemplateName,
	params: Record<string, unknown>,
	secret: string,
) {
	const definition = getOgTemplate(template)
	// Parse before encoding so the signed bytes are always the normalised,
	// unknown-key-stripped form — the same shape verification will re-derive.
	const parsed = definition.schema.parse(params)
	const paramsEncoded = encodeParams(parsed)
	if (paramsEncoded.length > OG_MAX_PARAMS_ENCODED_LENGTH) {
		throw new Error('OG image params exceed maximum encoded size')
	}
	const canonical = buildOgImageCanonicalPayload({
		template,
		version: definition.version,
		paramsEncoded,
	})
	const url = new URL(OG_IMAGE_PATH, origin)
	url.searchParams.set('tpl', template)
	url.searchParams.set('params', paramsEncoded)
	url.searchParams.set('v', String(definition.version))
	url.searchParams.set('sig', signPayload(secret, canonical))
	return url.toString()
}

/**
 * Returns `null` on every failure path — the caller turns that into a 404 so a
 * probe cannot distinguish a bad signature from an unknown template.
 */
export function verifyOgImageRequest(
	searchParams: URLSearchParams,
	secretOrSecrets: string | readonly string[],
) {
	const secrets = (
		typeof secretOrSecrets === 'string' ? [secretOrSecrets] : secretOrSecrets
	).filter((candidate) => candidate.trim().length > 0)
	if (secrets.length === 0) return null

	const template = searchParams.get('tpl')
	const paramsEncoded = searchParams.get('params')
	const versionRaw = searchParams.get('v')
	const sig = searchParams.get('sig')

	if (!template || !paramsEncoded || !versionRaw || !sig) return null
	if (!isOgTemplateName(template)) return null
	// Bound the work done before the signature check.
	if (paramsEncoded.length > OG_MAX_PARAMS_ENCODED_LENGTH) return null

	const version = Number(versionRaw)
	if (!Number.isInteger(version) || version <= 0) return null

	const definition = getOgTemplate(template)
	if (definition.version !== version) return null

	const canonical = buildOgImageCanonicalPayload({
		template,
		version,
		paramsEncoded,
	})

	// Compare against every accepted secret rather than short-circuiting, so the
	// number of rounds does not depend on which secret matched.
	let signatureMatches = false
	for (const candidate of secrets) {
		if (constantTimeEqualHex(sig, signPayload(candidate, canonical))) {
			signatureMatches = true
		}
	}
	if (!signatureMatches) return null

	let decoded: unknown
	try {
		decoded = decodeParams(paramsEncoded)
	} catch {
		return null
	}

	// Re-validate after decoding even though the signature already proved
	// authenticity: it keeps the template's input contract enforced in one place
	// and contains the blast radius if a signing key ever leaks.
	const params = definition.schema.safeParse(decoded)
	if (!params.success) return null

	return {
		template,
		version,
		params: params.data,
		cacheKey: buildCacheKey(canonical),
	}
}
