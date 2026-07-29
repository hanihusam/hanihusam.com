import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

import {
	resolveArtworkDataUri,
	resolveAvatarDataUri,
	resolveBackgroundDataUri,
} from '@/og/assets.server'
import { getOgFonts } from '@/og/fonts.server'
import { getOgTemplate, type OgTemplateName } from '@/og/registry'
import { type OgTemplateParams, type ProjectParams } from '@/og/schemas'
import { stripEmoji } from '@/og/text'

async function resolveTemplateAssets(
	template: OgTemplateName,
	params: OgTemplateParams,
) {
	const featuredImage =
		template === 'project' ? (params as ProjectParams).featuredImage : undefined

	const [background, avatar, artwork] = await Promise.all([
		resolveBackgroundDataUri(),
		resolveAvatarDataUri(),
		resolveArtworkDataUri(featuredImage),
	])
	return { background, avatar, artwork }
}

/**
 * Parses its own params rather than trusting the caller. Both real entry points
 * (signing and verification) already validate, but keeping the parse here means
 * the renderer is safe to call from anywhere — including the dev preview route,
 * which would otherwise have to import the registry into the browser bundle to
 * do it itself.
 */
export async function renderOgTemplatePng(
	templateName: OgTemplateName,
	rawParams: unknown,
) {
	const template = getOgTemplate(templateName)
	const { width, height } = template.size

	const parsed = template.schema.safeParse(rawParams)
	if (!parsed.success) {
		throw new Error(
			`Invalid params for "${templateName}" template: ${parsed.error.issues
				.map(
					(issue) => `${issue.path.join('.') || '(root)'} — ${issue.message}`,
				)
				.join(', ')}`,
		)
	}
	const params = parsed.data as OgTemplateParams

	const [fonts, assets] = await Promise.all([
		getOgFonts(),
		resolveTemplateAssets(templateName, params),
	])

	const element = template.component({
		...params,
		...assets,
		title: stripEmoji(params.title),
		url: stripEmoji(params.url),
	})

	const svg = await satori(element, { width, height, fonts })

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } })
	const png = resvg.render().asPng()

	return { png, width, height }
}
