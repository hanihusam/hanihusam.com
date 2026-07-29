import fs from 'node:fs/promises'
import path from 'node:path'

type OgFont = {
	name: string
	data: Buffer
	weight: 400 | 700
	style: 'normal'
}

// Satori parses `woff` but *not* `woff2`, so these must be the .woff files.
// Resolved from cwd: the Dockerfile copies `public/` to /app/public and the
// server runs with /app as its working directory.
const FONT_FILES = [
	{ file: 'Satoshi-Regular.woff', weight: 400 },
	{ file: 'Satoshi-Bold.woff', weight: 700 },
] as const

let fontsPromise: Promise<Array<OgFont>> | null = null

export function getOgFonts() {
	// Cache the promise, not the value, so concurrent renders share one read —
	// but drop it on rejection so a transient failure doesn't poison the process
	// for its whole lifetime.
	if (!fontsPromise) {
		fontsPromise = Promise.all(
			FONT_FILES.map(async ({ file, weight }) => ({
				name: 'Satoshi',
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
