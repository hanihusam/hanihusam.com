// Preview the dynamic social/OG card locally without running the app.
//
// Usage:
//   npx tsx other/preview-og.ts                       # default homepage card
//   npx tsx other/preview-og.ts "My Title" some/path  # custom title + path
//   npx tsx other/preview-og.ts "Curious Me" works/curious-me bapak2.dev/works/curious-me/thumbnail-sm_kedtvy
//
// Writes the signed Cloudinary URL to stdout and saves the PNG to
// other/og-preview.png, then opens it (macOS `open`). Requires
// CLOUDINARY_SECRET_KEY in .env so the authenticated font layers can be signed.
import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

import { getSignedSocialImage } from '../app/utils/cloudinary.server.ts'

// Load .env into process.env (Node >=20.12 built-in, no dotenv dependency).
try {
	process.loadEnvFile()
} catch {
	// No .env file — CLOUDINARY_SECRET_KEY may still be set in the shell.
}

const [
	,
	,
	title = 'Crafting interfaces by intersecting design and code.',
	urlPath = '',
	featuredImage,
] = process.argv

// getSignedSocialImage derives the display URL from request.url, so fake one.
const request = new Request(`https://hanihusam.com/${urlPath}`)
const signedUrl = getSignedSocialImage({ request, title, featuredImage })

console.log('\nSigned OG image URL:\n' + signedUrl + '\n')

const res = await fetch(signedUrl)
if (!res.ok) {
	console.error(
		`Cloudinary responded ${res.status}. Check CLOUDINARY_SECRET_KEY.`,
	)
	process.exit(1)
}

const out = path.join(import.meta.dirname, 'og-preview.png')
await fs.writeFile(out, Buffer.from(await res.arrayBuffer()))
console.log(`Saved ${out}`)

if (process.platform === 'darwin') execFile('open', [out])
