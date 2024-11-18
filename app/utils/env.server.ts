import { invariant } from '@epic-web/invariant'

const requiredServerEnvs = [
	'NODE_ENV',
	'DATABASE_PATH',
	'DATABASE_URL',
	'SESSION_SECRET',
	'REFRESH_TOKEN',
	'CACHE_DATABASE_PATH',
] as const

export function init() {
	for (const env of requiredServerEnvs) {
		invariant(process.env[env], `${env} is required`)
	}
}

function getEnv() {
	return {
		FLY: process.env.FLY,
		NODE_ENV: process.env.NODE_ENV,
	}
}

type ENV = ReturnType<typeof getEnv>

// App puts these on
declare global {
	var ENV: ENV
	interface Window {
		ENV: ENV
	}
}

export { getEnv }
