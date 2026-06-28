import { Footer } from '@/components/footer'
import { LayoutRoot } from '@/components/layout'
import appStyles from '@/styles/app.css?url'
import fonts from '@/styles/fonts.css?url'
import noScriptStyles from '@/styles/no-script.css?url'
import proseStyles from '@/styles/prose.css?url'
import tailwindStyles from '@/styles/tailwind.css?url'
import { ClientHintCheck, getHints } from '@/utils/client-hints'
import { getEnv } from '@/utils/env.server'
import { toErrorWithMessage } from '@/utils/helpers'
import { useNonce } from '@/utils/nonce-provider'
import { useTheme } from '@/utils/theme'
import { getTheme } from '@/utils/theme.server'

import { type Route } from './+types/root'
import { Navigation } from './components/navigation'
import { TopBlurOverlay } from './components/top-blur-overlay'

import {
	isRouteErrorResponse,
	Links,
	type LinksFunction,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useMatches,
	useRouteError,
} from 'react-router'

export const links: LinksFunction = () => {
	return [
		{
			rel: 'preload',
			as: 'font',
			href: '/fonts/Satoshi-Black.woff2',
			type: 'font/woff2',
			crossOrigin: 'anonymous',
		},
		{
			rel: 'preload',
			as: 'font',
			href: '/fonts/Satoshi-Bold.woff2',
			type: 'font/woff2',
			crossOrigin: 'anonymous',
		},
		{
			rel: 'preload',
			as: 'font',
			href: '/fonts/Satoshi-Italic.woff2',
			type: 'font/woff2',
			crossOrigin: 'anonymous',
		},
		{
			rel: 'preload',
			as: 'font',
			href: '/fonts/Satoshi-Light.woff2',
			type: 'font/woff2',
			crossOrigin: 'anonymous',
		},
		{
			rel: 'preload',
			as: 'font',
			href: '/fonts/Satoshi-Medium.woff2',
			type: 'font/woff2',
			crossOrigin: 'anonymous',
		},
		{
			rel: 'preload',
			as: 'font',
			href: '/fonts/Satoshi-Regular.woff2',
			type: 'font/woff2',
			crossOrigin: 'anonymous',
		},
		{
			rel: 'apple-touch-icon',
			sizes: '180x180',
			href: '/favicons/apple-touch-icon.png',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '32x32',
			href: '/favicons/favicon-32x32.png',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '16x16',
			href: '/favicons/favicon-16x16.png',
		},
		{ rel: 'icon', href: '/favicon.ico' },
		{ rel: 'manifest', href: '/favicons/manifest.json' },
		{ rel: 'stylesheet', href: appStyles },
		{ rel: 'stylesheet', href: tailwindStyles },
		{ rel: 'stylesheet', href: proseStyles },
		{ rel: 'stylesheet', href: fonts },
	]
}

export const meta = () => [
	{ title: 'Hani Husamuddin' },
	{
		property: 'og:title',
		content: 'Han Personal Website',
	},
	{
		name: 'description',
		content:
			'A professional freelancer who could help you solve your software engineer and UI design problem',
	},
	{
		name: 'viewport',
		content: 'width=device-width,initial-scale=1,viewport-fit=cover',
	},
]

export async function loader({ request }: Route.LoaderArgs) {
	const requestPath = new URL(request.url).pathname

	const data = {
		ENV: getEnv(),
		requestInfo: {
			hints: getHints(request),
			path: requestPath,

			userPrefs: {
				theme: getTheme(request),
			},
		},
	}

	return data
}

function App({
	loaderData: data,
}: {
	loaderData: Route.ComponentProps['loaderData']
}) {
	const nonce = useNonce()
	const theme = useTheme()
	const matches = useMatches()
	const surface = matches.some(
		(match) =>
			(match.handle as { surface?: 'primary' | 'secondary' } | undefined)
				?.surface === 'secondary',
	)
		? 'secondary'
		: 'primary'

	return (
		<html className={theme} lang="en">
			<head>
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,viewport-fit=cover"
				/>
				<Links />
				<noscript>
					<link href={noScriptStyles} rel="stylesheet" />
				</noscript>
				<script
					defer
					src="https://cloud.umami.is/script.js"
					data-website-id="1c49a372-515d-46b4-959b-5e29f5727b1f"
				/>
			</head>
			<body>
				<LayoutRoot surface={surface}>
					<TopBlurOverlay />
					<Outlet />
					<Footer />
					<Navigation />
				</LayoutRoot>

				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
				<script
					nonce={nonce}
					suppressHydrationWarning
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(data.ENV)};`,
					}}
				/>
			</body>
		</html>
	)
}

export default function AppWithProviders({ loaderData }: Route.ComponentProps) {
	return <App loaderData={loaderData} />
}

export function ErrorBoundary() {
	const error = useRouteError()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<h1>Oops</h1>
				<p>Status: {error.status}</p>
				<p>{error.data.message}</p>
			</div>
		)
	}

	// Don't forget to typecheck with your own logic.
	// Any value can be thrown, not just errors!
	const errorMessage = toErrorWithMessage(error)

	return (
		<div>
			<h1>Uh oh ...</h1>
			<p>Something went wrong.</p>
			<pre>{errorMessage.message}</pre>
		</div>
	)
}
