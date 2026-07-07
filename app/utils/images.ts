import { toErrorWithMessage } from '@/utils/helpers'

import { buildImageUrl, setConfig, Transformer } from 'cloudinary-build-url'

// Local, focused subset of Cloudinary's transformation options — the fields we
// actually use. Replaces the `TransformerOption` type from `@cld-apis/types`,
// which is packaged with vulnerable runtime tooling (see types/third-party.d.ts).
type TransformerOption = {
	resize?: {
		type?: string
		width?: number
		height?: number
		aspectRatio?: string
	}
	// `string & {}` keeps the literals as editor hints without collapsing the
	// union down to plain `string`.
	quality?: number | 'auto' | (string & {})
	format?: 'auto' | 'webp' | 'jpg' | 'png' | 'avif' | (string & {})
	background?: string
	effect?: { name: string; value?: string | number }
}

type ImageBuilder = {
	(transformations?: TransformerOption): string
	alt: string
	id: string
}

const cloudName = 'hanihusam'

setConfig({
	cloudName,
})

function getImageBuilder(id: string, alt: string = ''): ImageBuilder {
	function imageBuilder(transformations?: TransformerOption) {
		return buildImageUrl(id, { transformations })
	}
	imageBuilder.alt = alt
	imageBuilder.id = id
	return imageBuilder
}

// Builds a Cloudinary fetch-delivery URL for a remote image. We construct the
// URL manually instead of using buildImageUrl because it encodes the public id,
// which corrupts a remote URL (mangling `$`/`,` and double-encoding existing
// `%xx`). The remote URL is encoded once so its commas don't break srcSet.
function buildFetchUrl(url: string, transformations?: TransformerOption) {
	const transformStr = transformations
		? Transformer.toString(Transformer.transform(transformations))
		: ''
	const base = `https://res.cloudinary.com/${cloudName}/image/fetch`
	const remote = encodeURIComponent(url)
	return transformStr
		? `${base}/${transformStr}/${remote}`
		: `${base}/${remote}`
}

// Like getImageBuilder, but delivers a remote URL through Cloudinary's fetch
// storage type so external images (e.g. Substack covers) get the same
// responsive/transformation pipeline as our uploaded assets.
function getFetchImageBuilder(url: string, alt: string = ''): ImageBuilder {
	function imageBuilder(transformations?: TransformerOption) {
		return buildFetchUrl(url, transformations)
	}
	imageBuilder.alt = alt
	imageBuilder.id = url
	return imageBuilder
}

function getImgProps(
	imageBuilder: ImageBuilder,
	{
		widths,
		sizes,
		transformations,
	}: {
		widths: Array<number>
		sizes: Array<string>
		transformations?: TransformerOption
	},
) {
	const averageSize = Math.ceil(widths.reduce((a, s) => a + s) / widths.length)

	return {
		alt: imageBuilder.alt,
		src: imageBuilder({
			quality: 'auto',
			format: 'auto',
			...transformations,
			resize: { width: averageSize, ...transformations?.resize },
		}),
		srcSet: widths
			.map((width) =>
				[
					imageBuilder({
						quality: 'auto',
						format: 'auto',
						...transformations,
						resize: { width, ...transformations?.resize },
					}),
					`${width}w`,
				].join(' '),
			)
			.join(', '),
		sizes: sizes.join(', '),
	}
}

async function getBlurDataUrl(cloudinaryId: string) {
	const imageURL = buildImageUrl(cloudinaryId, {
		transformations: {
			resize: { width: 100 },
			quality: 'auto',
			format: 'webp',
			effect: {
				name: 'blur',
				value: '1000',
			},
		},
	})
	const dataUrl = await getDataUrlForImage(imageURL)
	return dataUrl
}

async function getFetchBlurDataUrl(url: string) {
	const imageURL = buildFetchUrl(url, {
		resize: { width: 100 },
		quality: 'auto',
		format: 'webp',
		effect: {
			name: 'blur',
			value: '1000',
		},
	})
	const dataUrl = await getDataUrlForImage(imageURL)
	return dataUrl
}

//#region //*=========== Social share image ===========
// Dynamic Open Graph / Twitter card images composed as a single Cloudinary
// URL (adapted from kentcdodds.com's getGenericSocialImage). Layout: page
// title top-left, an author block (avatar + name + url) lower-left, and the
// featured image fit (uncropped) on the right, over a branded background.
//
// These IDs must exist in the `hanihusam` Cloudinary account. Update them to
// match whatever you uploaded.
const socialImageConfig = {
	// 2400x1256 branded backdrop (no text/photo baked in).
	background: 'bapak2.dev/images/social-background_garrsb',
	// Square transparent profile/brand mark (rendered as a circle).
	profile: 'bapak2.dev/images/avatar-side_kz5o6d',
	// Right-side image used when a page has no banner of its own.
	defaultFeaturedImage:
		'bapak2.dev/images/placeholder-image-transparent_kzwqef',
	// Site's Satoshi typeface, uploaded as raw + authenticated fonts at the root
	// (no folder — Cloudinary's text-layer parser can't resolve nested font
	// paths). Because the fonts are authenticated, the delivery URL must be
	// signed with the Cloudinary secret; see `signCloudinaryUrl` in
	// `cloudinary.server.ts`, which is why social image URLs are built in loaders.
	fontBold: 'Satoshi-Bold.woff2',
	fontRegular: 'Satoshi-Regular.woff2',
} as const

// Cloudinary references nested public IDs in layers with `:` instead of `/`.
function toLayerId(publicId: string): string {
	return publicId.replace(/\//g, ':')
}

// Cloudinary text layers need the text double-URI-encoded.
function doubleEncode(s: string): string {
	return encodeURIComponent(encodeURIComponent(s))
}

// Emojis break Cloudinary text layers, so strip them and collapse whitespace.
function emojiStrip(s: string): string {
	return s
		.replace(/\p{Extended_Pictographic}/gu, '')
		.split(' ')
		.filter(Boolean)
		.join(' ')
		.trim()
}

function getSocialImage({
	title,
	featuredImage = socialImageConfig.defaultFeaturedImage,
	url,
	name = 'Hani Husamuddin',
}: {
	title: string
	featuredImage?: string
	url: string
	name?: string
}): string {
	const { background, profile, fontBold, fontRegular } = socialImageConfig

	// 24-column x 12-row grid over the 2400x1256 canvas ($gw=100, $gh~104.6).
	const vars = `$th_1256,$tw_2400,$gw_$tw_div_24,$gh_$th_div_12`

	// Title. With c_fit the font-size number is nearly irrelevant — Cloudinary
	// scales the rasterized text block to fill the w x h box — so the box shape
	// drives the final size. A narrow+tall box (w_10 x h_7) forces the text to
	// wrap into a tall block that scales up to dominate the left column (this is
	// exactly kentcdodds.com's geometry). A wider/shorter box renders it small.
	const encodedTitle = doubleEncode(emojiStrip(title))
	const titleSection = `co_white,c_fit,g_north_west,w_$gw_mul_10,h_$gh_mul_7,x_$gw_mul_1.3,y_$gh_mul_1.5,l_text:${fontBold}_110:${encodedTitle}`

	// Author block: circular avatar with the name/url set to its right. The name
	// box is kept wide and short (w_9 x h_1.6) so a longer name than Kent's
	// ("Hani Husamuddin") stays on one line — c_fit would otherwise scale a
	// two-line wrap up until it collided with the url below.
	const profileSection = `c_fit,g_north_west,r_max,w_$gw_mul_4,h_$gh_mul_3,x_$gw_mul_1,y_$gh_mul_8,l_${toLayerId(profile)}`

	const encodedName = doubleEncode(emojiStrip(name))
	const nameSection = `co_white,c_fit,g_north_west,w_$gw_mul_9,h_$gh_mul_1.6,x_$gw_mul_4.4,y_$gh_mul_8.7,l_text:${fontBold}_64:${encodedName}`

	const encodedUrl = doubleEncode(emojiStrip(url))
	const urlSection = `co_rgb:9ca3af,c_fit,g_north_west,w_$gw_mul_9,h_$gh_mul_1,x_$gw_mul_4.4,y_$gh_mul_9.7,l_text:${fontRegular}_38:${encodedUrl}`

	// Featured image: fit (not cropped) into the right half so the whole
	// illustration/banner is visible regardless of its aspect ratio.
	const featuredImageIsRemote = featuredImage.startsWith('http')
	const featuredImageId = featuredImageIsRemote
		? toBase64(featuredImage)
		: toLayerId(featuredImage)
	const featuredImageLayerType = featuredImageIsRemote ? 'l_fetch:' : 'l_'
	const featuredImageSection = `c_fit,g_east,w_$gw_mul_11,h_$gh_mul_11,x_$gw,${featuredImageLayerType}${featuredImageId}`

	const backgroundSection = `c_fill,w_$tw,h_$th/${background}`

	return [
		`https://res.cloudinary.com/${cloudName}/image/upload`,
		vars,
		titleSection,
		profileSection,
		nameSection,
		urlSection,
		featuredImageSection,
		backgroundSection,
	].join('/')
}

function toBase64(s: string): string {
	if (typeof window === 'undefined') {
		return Buffer.from(s).toString('base64')
	}
	return window.btoa(s)
}
//#endregion //*=========== Social share image ===========

async function getDataUrlForImage(imageUrl: string) {
	try {
		const res = await fetch(imageUrl)
		const arrayBuffer = await res.arrayBuffer()
		const base64 = Buffer.from(arrayBuffer).toString('base64')
		const mime = res.headers.get('Content-Type') ?? 'image/webp'
		const dataUrl = `data:${mime};base64,${base64}`
		return dataUrl
	} catch (error: unknown) {
		const err = toErrorWithMessage(error)
		throw new Error(err.message)
	}
}

export {
	getBlurDataUrl,
	getFetchBlurDataUrl,
	getFetchImageBuilder,
	getImageBuilder,
	getImgProps,
	getSocialImage,
	socialImageConfig,
}
export type { ImageBuilder }
