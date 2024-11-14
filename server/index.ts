import { createRequestHandler } from '@remix-run/express'
import { broadcastDevReady, installGlobals } from '@remix-run/node'
import compression from 'compression'
import express from 'express'
import morgan from 'morgan'
import * as path from 'node:path'
import sourceMapSupport from 'source-map-support'

installGlobals()
sourceMapSupport.install()

const BUILD_PATH = path.resolve('build/index.js')

let initialBuild = require(BUILD_PATH)

const viteDevServer =
	process.env.NODE_ENV === 'production'
		? undefined
		: await import('vite').then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
				}),
		  )

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

// if we're not in the primary region, then we need to make sure all
// non-GET/HEAD/OPTIONS requests hit the primary region rather than read-only
// Postgres DBs.
// learn more: https://fly.io/docs/getting-started/multi-region-databases/#replay-the-request
app.all('*', function getReplayResponse(req, res, next) {
	const { method, path: pathname } = req
	const { PRIMARY_REGION, FLY_REGION } = process.env

	const isMethodReplayable = !['GET', 'OPTIONS', 'HEAD'].includes(method)
	const isReadOnlyRegion =
		FLY_REGION && PRIMARY_REGION && FLY_REGION !== PRIMARY_REGION

	const shouldReplay = isMethodReplayable && isReadOnlyRegion

	if (!shouldReplay) return next()

	const logInfo = {
		pathname,
		method,
		PRIMARY_REGION,
		FLY_REGION,
	}
	console.info(`Replaying:`, logInfo)
	res.set('fly-replay', `region=${PRIMARY_REGION}`)
	return res.sendStatus(409)
})

app.use(compression())

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by')

if (viteDevServer) {
	app.use(viteDevServer.middlewares)
} else {
	// Remix fingerprints its assets so we can cache forever.
	app.use(
		'/build',
		express.static('public/build', { immutable: true, maxAge: '1y' }),
	)
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }))

app.use(morgan('tiny'))

app.all(
	'*',
	createRequestHandler({
		build: viteDevServer
			? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
			: initialBuild,
	}),
)

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`✅ Express server listening on port ${port}`)

	if (process.env.NODE_ENV === 'development') {
		broadcastDevReady(initialBuild)
	}
})
