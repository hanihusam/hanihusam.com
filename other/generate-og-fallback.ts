// Produces public/og-fallback.png — the static, checked-in PNG
// resources.og-image.ts serves when satori or resvg itself throws mid-render
// (X-Og-Cache: FALLBACK). Generated from the real 'page' template with
// placeholder copy so it matches the live design instead of being hand-made,
// and committed since the whole point is that it must exist without
// depending on the very renderer it stands in for.
//
// Usage: npx tsx other/generate-og-fallback.ts
import fs from 'node:fs/promises'
import path from 'node:path'

import { renderOgTemplatePng } from '../app/og/render.server.ts'

async function main() {
	const { png, degraded } = await renderOgTemplatePng('page', {
		title: 'Hani Husamuddin',
		url: 'hanihusam.com',
	})

	if (degraded) {
		console.error(
			'Rendered with a missing asset (Cloudinary fetch failed) — the ' +
				'fallback PNG would itself be degraded. Check network access and re-run.',
		)
		process.exit(1)
	}

	const out = path.join(import.meta.dirname, '../public/og-fallback.png')
	await fs.writeFile(out, png)
	console.log(`wrote ${out}`)
}

main()
