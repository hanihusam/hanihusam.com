import { createRequestHandler, type RequestHandler } from '@remix-run/express'
import {
	broadcastDevReady,
	installGlobals,
	type ServerBuild,
} from '@remix-run/node'
import chokidar from 'chokidar'
import compression from 'compression'
import express from 'express'
import fs from 'fs'
import { getInstanceInfo } from 'litefs-js'
import morgan from 'morgan'
import path from 'path'
import sourceMapSupport from 'source-map-support'
import url from 'url'

installGlobals()
sourceMapSupport.install()

const BUILD_PATH = path.resolve('build/index.js')
let initialBuild = await reimportServer()

const primaryHost = 'hanihusam.com'
const getHost = (req: { get: (key: string) => string | undefined }) =>
	req.get('X-Forwarded-Host') ?? req.get('host') ?? ''

const remixHandler =
	process.env.NODE_ENV === 'development'
		? await createDevRequestHandler()
		: createRequestHandler({
				build: initialBuild,
				mode: process.env.NODE_ENV,
			})

const app = express()

app.use((req, res, next) => {
	// helpful headers:
	res.set('x-fly-region', process.env.FLY_REGION ?? 'unknown')
	res.set('Strict-Transport-Security', `max-age=${60 * 60 * 24 * 365 * 100}`)

	// /clean-urls/ -> /clean-urls
	if (req.path.endsWith('/') && req.path.length > 1) {
		const query = req.url.slice(req.path.length)
		const safepath = req.path.slice(0, -1).replace(/\/+/g, '/')
		res.redirect(301, safepath + query)
		return
	}
	next()
})

app.use(async (req, res, next) => {
	const { currentInstance, primaryInstance } = await getInstanceInfo()
	res.set('X-Powered-By', 'Han by bapak2.dev')
	res.set('X-Fly-Region', process.env.FLY_REGION ?? 'unknown')
	res.set('X-Fly-App', process.env.FLY_APP_NAME ?? 'unknown')
	res.set('X-Fly-Instance', currentInstance)
	res.set('X-Fly-Primary-Instance', primaryInstance)
	res.set('X-Frame-Options', 'SAMEORIGIN')
	const proto = req.get('X-Forwarded-Proto') ?? req.protocol

	const host = getHost(req)
	if (!host.endsWith(primaryHost)) {
		res.set('X-Robots-Tag', 'noindex')
	}
	res.set('Access-Control-Allow-Origin', `${proto}://${host}`)

	// if they connect once with HTTPS, then they'll connect with HTTPS for the next hundred years
	res.set('Strict-Transport-Security', `max-age=${60 * 60 * 24 * 365 * 100}`)
	next()
})

app.use(compression())

// Remix fingerprints its assets so we can cache forever.
app.use(
	'/build',
	express.static('public/build', { immutable: true, maxAge: '1y' }),
)

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }))

app.use(morgan('tiny'))

app.all('*', remixHandler)

const port = process.env.PORT || 3000

app.listen(port, async () => {
	console.log(`✅ Express server listening on port ${port}`)

	if (process.env.NODE_ENV === 'development') {
		await broadcastDevReady(initialBuild)
	}
})

async function reimportServer(): Promise<ServerBuild> {
	const stat = fs.statSync(BUILD_PATH)

	// convert build path to URL for Windows compatibility with dynamic `import`
	const BUILD_URL = url.pathToFileURL(BUILD_PATH).href

	// use a timestamp query parameter to bust the import cache
	return import(BUILD_URL + '?t=' + stat.mtimeMs)
}

// Create a request handler that watches for changes to the server build during development.
async function createDevRequestHandler(): Promise<RequestHandler> {
	async function handleServerUpdate() {
		// 1. re-import the server build
		initialBuild = await reimportServer()

		// Add debugger to assist in v2 dev debugging
		if (initialBuild?.assets === undefined) {
			console.log(initialBuild.assets)
			debugger
		}

		// 2. tell dev server that this app server is now up-to-date and ready
		await broadcastDevReady(initialBuild)
	}

	// watch the server build file for changes
	chokidar.watch(BUILD_PATH).on('change', async () => {
		console.log('🔁 Server build changed')
		try {
			await handleServerUpdate()
		} catch (error) {
			console.error('❌ Error re-importing server build:', error)
		}
	})

	// wrap request handler to make sure its recreated with the latest build for every request
	return async (req, res, next) => {
		try {
			return createRequestHandler({
				build: initialBuild,
				mode: 'development',
			})(req, res, next)
		} catch (error) {
			next(error)
		}
	}
}
