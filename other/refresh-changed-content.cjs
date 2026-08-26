// try to keep this dep-free so we don't have to install deps
const {
	fetchJson,
	getChangedFiles,
	getTrackedContentFiles,
	hostname,
	postRefreshCache,
} = require('./utils.cjs')

const [currentCommitSha] = process.argv.slice(2)

// dep-free fetch that never throws — returns null on any failure (404 HTML,
// timeout, bad JSON) so a missing endpoint degrades gracefully instead of
// crashing the whole job.
async function safeFetchJson(url) {
	try {
		return await fetchJson(url, { timeoutTime: 10_000 })
	} catch (error) {
		console.log(`Could not read ${url}:`, error?.message ?? error)
		return null
	}
}

async function getContentPathsToRefresh(deployedSha, compareSha) {
	const filenames = compareSha
		? (await getChangedFiles(deployedSha, compareSha)).map(
				({ filename }) => filename,
			)
		: getTrackedContentFiles()

	return filenames
		.filter((filename) => filename.startsWith('contents/'))
		.map((filename) => filename.replace(/^contents\//, ''))
}

async function go() {
	if (!currentCommitSha) throw new Error('The deployed commit SHA is required')

	const shaInfo = await safeFetchJson(
		`https://${hostname}/refresh-commit-sha.json`,
	)
	const compareSha = shaInfo?.sha
	const contentPaths = await getContentPathsToRefresh(
		currentCommitSha,
		compareSha,
	)

	if (compareSha) {
		console.log(`Comparing deployed content with ${compareSha}.`)
	} else {
		console.log('No refresh checkpoint found. Refreshing all tracked content.')
	}

	const response = await postRefreshCache({
		postData: {
			contentPaths,
			commitSha: currentCommitSha,
		},
	})
	console.log('Content refresh checkpoint updated.', {
		contentPaths,
		response,
	})
}

if (require.main === module) {
	void go().catch((error) => {
		console.error('Content refresh failed.', error)
		process.exitCode = 1
	})
}

module.exports = { getContentPathsToRefresh, go }
