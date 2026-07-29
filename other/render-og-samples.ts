// Renders sample cards for every template to /tmp so the layout can be eyeballed
// without booting the app. Superseded for day-to-day work by the dev-only
// /resources/og-preview route (Phase 4), but useful as a headless check.
import fs from 'node:fs/promises'

import { renderOgTemplatePng } from '../app/og/render.server.ts'
import { type OgTemplateName } from '../app/og/registry.tsx'
import { type OgTemplateParams } from '../app/og/schemas.ts'

const samples: Array<{
	name: string
	template: OgTemplateName
	params: OgTemplateParams
}> = [
	{
		name: 'page-home',
		template: 'page',
		params: {
			title: 'Crafting interfaces by intersecting design and code.',
			url: 'hanihusam.com',
		},
	},
	{
		name: 'page-short-title',
		template: 'page',
		params: { title: 'About', url: 'hanihusam.com/about' },
	},
	{
		name: 'page-long-title',
		template: 'page',
		params: {
			title:
				'A very long page title that keeps going well past any reasonable length so we can see exactly how the renderer wraps it across multiple lines',
			url: 'hanihusam.com/works',
		},
	},
	{
		name: 'page-absurd-title',
		template: 'page',
		params: {
			title:
				'An absurdly long title that no real page would ever have but which must still not be allowed to overflow the canvas or collide with the author block no matter what happens here',
			url: 'hanihusam.com/works',
		},
	},
	{
		// The schema's hard ceiling: if this fits, nothing can overflow.
		name: 'page-max-length-title',
		template: 'page',
		params: {
			title: `${'Wordy '.repeat(33)}en`,
			url: 'hanihusam.com',
		},
	},
	{
		name: 'project-curious-me',
		template: 'project',
		params: {
			title: 'Curious Me',
			url: 'hanihusam.com/works/curious-me',
			featuredImage: 'bapak2.dev/works/curious-me/thumbnail-sm_kedtvy',
		},
	},
]

async function main() {
	for (const sample of samples) {
		const started = Date.now()
		const { png, width, height } = await renderOgTemplatePng(
			sample.template,
			sample.params,
		)
		const out = `/tmp/og-${sample.name}.png`
		await fs.writeFile(out, png)
		console.log(
			`${out}  ${width}x${height}  ${(png.length / 1024).toFixed(0)}KB  ${Date.now() - started}ms`,
		)
	}
}

main()
