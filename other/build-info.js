import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const SHA = process.env.COMMIT_SHA

async function getCommitInfo() {
	if (!SHA) return `No COMMIT_SHA environment variable set.`
	try {
		const response = await fetch(
			`https://api.github.com/repos/hanihusam/hanihusam.com/commits/${SHA}`,
		)
		const data = await response.json()

		return {
			author: data.commit.author.name,
			timestamp: data.commit.author.date,
			sha: data.sha,
			message: data.commit.message,
			url: data.html_url,
		}
	} catch (e) {
		console.error(`💣 fetch failed with ${e.message}`)
	}
}

const buildInfo = {
	buildTime: Date.now(),
	commit: await getCommitInfo(),
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const destDir = path.join(__dirname, '../build/client/build')
if (!fs.existsSync(destDir)) {
	fs.mkdirSync(destDir, { recursive: true })
}

fs.writeFileSync(
	path.join(destDir, 'info.json'),
	JSON.stringify(buildInfo, null, 2),
)

console.log('build info generated', buildInfo)
