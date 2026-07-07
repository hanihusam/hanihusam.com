import { removeTrailingSlash } from '@/utils/helpers'
import { getContentMdxListItems } from '@/utils/mdx.server'

import { type LoaderFunctionArgs } from 'react-router'

export async function loader({ request }: LoaderFunctionArgs) {
	const domain = new URL(request.url).origin
	const projects = await getContentMdxListItems('projects', { request })

	const staticEntries = [
		{ route: '/', priority: '1.0' },
		{ route: '/about', priority: '0.8' },
		{ route: '/works', priority: '0.8' },
	]

	const projectEntries = projects.map((project) => ({
		route: `/works/${project.slug}`,
		priority: '0.7',
		lastmod: project.lastUpdated ?? project.publishedAt,
	}))

	const entries = [...staticEntries, ...projectEntries]

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map((entry) => {
		const loc = removeTrailingSlash(`${domain}${entry.route}`)
		const lastmod =
			'lastmod' in entry && entry.lastmod
				? `\n    <lastmod>${new Date(String(entry.lastmod)).toISOString()}</lastmod>`
				: ''
		return `  <url>\n    <loc>${loc}</loc>${lastmod}\n    <priority>${entry.priority}</priority>\n  </url>`
	})
	.join('\n')}
</urlset>`

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600',
		},
	})
}
