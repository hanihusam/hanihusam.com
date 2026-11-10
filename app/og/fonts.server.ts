import fs from 'node:fs/promises'
import path from 'node:path'

type OgFont = {
	name: string
	data: Buffer
	weight: 400 | 500 | 700 | 900
	style: 'normal'
}

// Satori parses `woff` but *not* `woff2`, so these must be the .woff files.
// Resolved from cwd: the Dockerfile copies `public/` to /app/public and the
// server runs with /app as its working directory.
// Medium, Black and the handwriting face are for the /resume card.
const FONT_FILES = [
	{ name: 'Satoshi', file: 'Satoshi-Regular.woff', weight: 400 },
	{ name: 'Satoshi', file: 'Satoshi-Medium.woff', weight: 500 },
	{ name: 'Satoshi', file: 'Satoshi-Bold.woff', weight: 700 },
	{ name: 'Satoshi', file: 'Satoshi-Black.woff', weight: 900 },
	{
		name: 'Nothing You Could Do',
		file: 'NothingYouCouldDo-Regular.ttf',
		weight: 400,
	},
] as const

let fontsPromise: Promise<Array<OgFont>> | null = null

export function getOgFonts() {
	// Cache the promise, not the value, so concurrent renders share one read —
	// but drop it on rejection so a transient failure doesn't poison the process
	// for its whole lifetime.
	if (!fontsPromise) {
		fontsPromise = Promise.all(
			FONT_FILES.map(async ({ name, file, weight }) => ({
				name,
				data: await fs.readFile(path.join(process.cwd(), 'public/fonts', file)),
				weight,
				style: 'normal' as const,
			})),
		).catch((error: unknown) => {
			fontsPromise = null
			throw error
		})
	}
	return fontsPromise
}
