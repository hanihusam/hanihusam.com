import {
	createRequestHandler,
	type RequestHandler,
} from '@react-router/express'
import compression from 'compression'
import express from 'express'
import { getInstanceInfo } from 'litefs-js'
import morgan from 'morgan'
import path from 'path'
import { type ServerBuild } from 'react-router'
import sourceMapSupport from 'source-map-support'
import { fileURLToPath } from 'url'

sourceMapSupport.install()

const viteDevServer =
	process.env.NODE_ENV === 'production'
		? undefined
		: await import('vite').then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
				}),
			)
const getBuild = async (): Promise<ServerBuild> => {
	if (viteDevServer) {
		return viteDevServer.ssrLoadModule(
			'virtual:react-router/server-build',
		) as any
	}
	// @ts-ignore (this file may or may not exist yet)
	return import('../build/server/index.js') as Promise<ServerBuild>
}

const primaryHost = 'hanihusam.com'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const here = (...d: Array<string>) => path.join(__dirname, ...d)
const getHost = (req: { get: (key: string) => string | undefined }) =>
	req.get('X-Forwarded-Host') ?? req.get('host') ?? ''

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

const publicAbsolutePath = here('../build/client')

if (viteDevServer) {
	app.use(viteDevServer.middlewares)
} else {
	app.use(
		express.static(publicAbsolutePath, {
			maxAge: '1w',
			setHeaders(res, resourcePath) {
				const relativePath = resourcePath.replace(`${publicAbsolutePath}/`, '')
				if (relativePath.startsWith('build/info.json')) {
					res.setHeader('cache-control', 'no-cache')
					return
				}
				// If we ever change our font (which we quite possibly never will)
				// then we'll just want to change the filename or something...
				// Remix fingerprints its assets so we can cache forever
				if (
					relativePath.startsWith('fonts') ||
					relativePath.startsWith('build')
				) {
					res.setHeader('cache-control', 'public, max-age=31536000, immutable')
				}
			},
		}),
	)
}
// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('build/client', { maxAge: '1h' }))

app.use(morgan('tiny'))

async function getRequestHandler(): Promise<RequestHandler> {
	function getLoadContext(req: any, res: any) {
		return { cspNonce: res.locals.cspNonce, whatever: 'default value' }
	}
	return createRequestHandler({
		build: process.env.NODE_ENV === 'development' ? getBuild : await getBuild(),
		mode: process.env.NODE_ENV,
		getLoadContext,
	})
}

app.all('*', await getRequestHandler())

const port = process.env.PORT || 3000

app.listen(port, async () => {
	console.log(`✅ Express server listening on port ${port}`)
})
