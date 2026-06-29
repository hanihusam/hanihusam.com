import { Footer } from '@/components/footer'
import { LayoutRoot } from '@/components/layout'
import { NotFound } from '@/components/not-found'
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
	useRouteLoaderData,
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

function Document({
	children,
	nonce,
	theme = 'light',
	env,
}: {
	children: React.ReactNode
	nonce: string
	theme?: string
	env?: Record<string, unknown>
}) {
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
				{children}

				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
				{env ? (
					<script
						nonce={nonce}
						suppressHydrationWarning
						dangerouslySetInnerHTML={{
							__html: `window.ENV = ${JSON.stringify(env)};`,
						}}
					/>
				) : null}
			</body>
		</html>
	)
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
		<Document nonce={nonce} theme={theme} env={data.ENV}>
			<LayoutRoot surface={surface}>
				<TopBlurOverlay />
				<Outlet />
				<Footer />
				<Navigation />
			</LayoutRoot>
		</Document>
	)
}

export default function AppWithProviders({ loaderData }: Route.ComponentProps) {
	return <App loaderData={loaderData} />
}

export function ErrorBoundary() {
	const nonce = useNonce()
	const error = useRouteError()

	// Read the theme straight from the root loader data (present whenever a child
	// route errors) without going through `useTheme`, which would throw if the
	// root loader itself failed. Falls back to light so the boundary always
	// renders.
	const rootData = useRouteLoaderData<typeof loader>('root')
	const theme =
		rootData?.requestInfo.userPrefs.theme ??
		rootData?.requestInfo.hints.theme ??
		'light'

	const is404 = isRouteErrorResponse(error) && error.status === 404
	const errorMessage = isRouteErrorResponse(error)
		? error.data?.message
		: toErrorWithMessage(error).message

	return (
		<Document nonce={nonce} theme={theme}>
			<LayoutRoot surface="primary">
				{is404 ? (
					<NotFound />
				) : (
					<main className="relative flex grow flex-col items-center justify-center px-6 py-24 sm:px-8">
						<div className="flex w-full max-w-(--container-site) flex-col items-start gap-4">
							<h1 className="text-4xl font-black text-(--text-title-primary) md:text-5xl">
								Something went wrong
							</h1>
							<p className="text-(--text-overline)">
								Sorry about that. Please try again later.
							</p>
							{errorMessage ? (
								<pre className="max-w-full overflow-auto text-sm text-(--text-caption)">
									{errorMessage}
								</pre>
							) : null}
						</div>
					</main>
				)}
			</LayoutRoot>
		</Document>
	)
}
