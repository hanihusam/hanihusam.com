import { getContentMdxListItems } from '@/utils/mdx.server'

import { type Route } from './+types/healthcheck'

export async function loader({ request }: Route.LoaderArgs) {
	const host =
		request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')

	try {
		await Promise.all([
			getContentMdxListItems('blog', { request }),
			fetch(`${new URL(request.url).protocol}${host}`, {
				method: 'HEAD',
				headers: { 'x-healthcheck': 'true' },
			}).then((r) => {
				if (!r.ok) return Promise.reject(r)
			}),
		])
		return new Response('OK')
	} catch (error: unknown) {
		console.error('healthcheck ❌', { error })
		return new Response('ERROR', { status: 500 })
	}
}
