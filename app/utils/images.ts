import { toErrorWithMessage } from '@/utils/helpers'

import { type TransformerOption } from '@cld-apis/types'
import { buildImageUrl, setConfig, Transformer } from 'cloudinary-build-url'

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
}
export type { ImageBuilder }
