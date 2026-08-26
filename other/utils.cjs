// try to keep this dep-free so we don't have to install deps
const { execFileSync } = require('child_process')
const https = require('https')

const hostname =
	process.env.GITHUB_REF_NAME === 'dev'
		? 'hanihusam-com-staging.fly.dev'
		: 'hanihusam.com'

function fetchJson(url, { timeoutTime } = {}) {
	return new Promise((resolve, reject) => {
		const request = https
			.get(url, (res) => {
				let data = ''
				res.on('data', (d) => {
					data += d
				})

				res.on('end', () => {
					if (res.statusCode && res.statusCode >= 400) {
						reject(new Error(`Request failed with status ${res.statusCode}`))
						return
					}
					try {
						resolve(JSON.parse(data))
					} catch (error) {
						reject(error)
					}
				})
			})
			.on('error', (e) => {
				reject(e)
			})
		if (timeoutTime) {
			request.setTimeout(timeoutTime, () => {
				request.destroy(new Error('Request timed out'))
			})
		}
	})
}

const changeTypes = {
	M: 'modified',
	A: 'added',
	D: 'deleted',
}

async function getChangedFiles(currentCommitSha, compareCommitSha) {
	const lineParser = /^(?<change>\w).*?\s+(?<filename>.+$)/
	const gitOutput = execFileSync('/usr/bin/git', [
		'diff',
		'--name-status',
		'--no-renames',
		currentCommitSha,
		compareCommitSha,
	]).toString()
	const changedFiles = gitOutput
		.split('\n')
		.map((line) => line.match(lineParser)?.groups)
		.filter(Boolean)
	const changes = []
	for (const { change, filename } of changedFiles) {
		const changeType = changeTypes[change]
		if (changeType) {
			changes.push({ changeType, filename })
		} else {
			throw new Error(`Unknown change type: ${change} ${filename}`)
		}
	}
	return changes
}

function getTrackedContentFiles() {
	return execFileSync('/usr/bin/git', ['ls-files', 'contents'])
		.toString()
		.split('\n')
		.filter(Boolean)
}

// try to keep this dep-free so we don't have to install deps
async function postRefreshCache({
	http,
	postData,
	options: { headers: headersOverrides, ...optionsOverrides } = {},
}) {
	if (!http) {
		http = https
	}
	return new Promise((resolve, reject) => {
		try {
			const postDataString = JSON.stringify(postData)
			const options = {
				hostname,
				port: 443,
				path: `/action/refresh-cache`,
				method: 'POST',
				headers: {
					auth: process.env.REFRESH_TOKEN,
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(postDataString),
					...headersOverrides,
				},
				...optionsOverrides,
			}

			const req = http
				.request(options, (res) => {
					let data = ''
					res.on('data', (d) => {
						data += d
					})

					res.on('end', () => {
						if (res.statusCode && res.statusCode >= 400) {
							reject(new Error(`Refresh failed with status ${res.statusCode}`))
							return
						}
						try {
							resolve(JSON.parse(data))
						} catch {
							reject(data)
						}
					})
				})
				.on('error', reject)
			req.setTimeout(30_000, () => {
				req.destroy(new Error('Refresh request timed out'))
			})
			req.write(postDataString)
			req.end()
		} catch (error) {
			console.log('oh no', error)
			reject(error)
		}
	})
}

module.exports = {
	fetchJson,
	getChangedFiles,
	getTrackedContentFiles,
	hostname,
	postRefreshCache,
}
