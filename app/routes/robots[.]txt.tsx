import { type LoaderFunctionArgs } from 'react-router'

export function loader({ request }: LoaderFunctionArgs) {
	const domain = new URL(request.url).origin
	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: ${domain}/sitemap.xml`,
	].join('\n')

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=86400',
		},
	})
}
