import crypto from 'node:crypto'

import { removeTrailingSlash } from '@/utils/helpers'
import { getSocialImage } from '@/utils/images'

// Signs a Cloudinary delivery URL so authenticated assets (our custom Satoshi
// fonts) can be used in transformations. The signature is the first 8 URL-safe
// base64 chars of sha1(<everything after /image/upload/> + api secret), inserted
// as `s--<sig>--` right after `/image/upload/`.
export function signCloudinaryUrl(url: string): string {
	const secret = process.env.CLOUDINARY_SECRET_KEY
	if (!secret) return url

	const marker = '/image/upload/'
	const idx = url.indexOf(marker)
	if (idx === -1) return url

	const prefix = url.slice(0, idx + marker.length)
	const toSign = url.slice(idx + marker.length)
	const signature = crypto
		.createHash('sha1')
		.update(toSign + secret)
		.digest('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '')
		.slice(0, 8)

	return `${prefix}s--${signature}--/${toSign}`
}

// Builds a signed social-share image URL for a page. Must run on the server
// (it needs the Cloudinary secret), so callers invoke it in loaders and pass
// the result to the route's `meta` via loader data.
export function getSignedSocialImage({
	request,
	title,
	featuredImage,
}: {
	request: Request
	title: string
	featuredImage?: string
}): string {
	const url = new URL(request.url)
	const displayUrl = removeTrailingSlash(`${url.host}${url.pathname}`)
	return signCloudinaryUrl(
		getSocialImage({ title, url: displayUrl, featuredImage }),
	)
}
