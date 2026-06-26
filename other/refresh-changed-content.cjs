// try to keep this dep-free so we don't have to install deps
const { fetchJson, getChangedFiles, postRefreshCache } = require('./utils.cjs')

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

async function go() {
	const shaInfo = await safeFetchJson(
		'https://hanihusam-com.fly.dev/refresh-commit-sha.json',
	)
	let compareSha = shaInfo?.sha
	if (!compareSha) {
		// Static build info is served from the build/client root, so it lives at
		// /build/info.json (not /build/client/build/info.json). Shape is
		// { buildTime, commit: { sha, ... } }.
		const buildInfo = await safeFetchJson(
			'https://hanihusam-com.fly.dev/build/info.json',
		)
		compareSha = buildInfo?.commit?.sha
		if (compareSha) {
			console.log(`No compare sha found, using build sha: ${compareSha}`)
		}
	}
	if (typeof compareSha !== 'string') {
		console.log('🤷‍♂️ No sha to compare to. Nothing to refresh.')
		return
	}

	const changedFiles =
		(await getChangedFiles(currentCommitSha, compareSha)) ?? []
	const contentPaths = changedFiles
		.filter((f) => f.filename.startsWith('contents'))
		.map((f) => f.filename.replace(/^contents\//, ''))
	if (contentPaths.length) {
		console.log(`⚡️ Content changed. Requesting the cache be refreshed.`, {
			currentCommitSha,
			compareSha,
			contentPaths,
		})

		try {
			const response = await postRefreshCache({
				postData: {
					contentPaths,
					commitSha: currentCommitSha,
				},
			})
			console.log(`Content change request finished.`, { response })
		} catch (error) {
			console.log(`Error`, { error })
		}
	} else {
		console.log('🆗 Not refreshing changed content because no content changed.')
	}
}

void go()
