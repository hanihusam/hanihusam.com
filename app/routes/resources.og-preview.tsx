import { OG_CANVAS } from '@/og/constants'
import { type OgTemplateName } from '@/og/registry'
import { renderOgTemplatePng } from '@/og/render.server'
import { type OgTemplateParams } from '@/og/schemas'

import { type Route } from './+types/resources.og-preview'

const SAMPLES: Array<{
	name: string
	template: OgTemplateName
	params: OgTemplateParams
}> = [
	{
		name: 'page — home',
		template: 'page',
		params: {
			title: 'Crafting interfaces by intersecting design and code.',
			url: 'hanihusam.com',
		},
	},
	{
		name: 'page — short title',
		template: 'page',
		params: { title: 'About', url: 'hanihusam.com/about' },
	},
	{
		name: 'page — long title (42px bucket)',
		template: 'page',
		params: {
			title:
				'A very long page title that keeps going well past any reasonable length so we can see exactly how the renderer wraps it',
			url: 'hanihusam.com/works',
		},
	},
	{
		// Exactly the schema's 200-char ceiling: if this cannot overflow, nothing can.
		name: 'page — max length (clamped + ellipsis)',
		template: 'page',
		params: { title: `${'Wordy '.repeat(33)}en`, url: 'hanihusam.com' },
	},
	{
		name: 'project — real banner',
		template: 'project',
		params: {
			title: 'Curious Me',
			url: 'hanihusam.com/works/curious-me',
			featuredImage: 'bapak2.dev/works/curious-me/thumbnail-sm_kedtvy',
		},
	},
]

/**
 * Dev-only gallery for iterating on the OG templates. Renders inline as data
 * URIs rather than going through the signed `/resources/og-image` route, so
 * edits show up on reload with no signing step and no cache to bust.
 *
 * Override the first card from the URL to try arbitrary copy:
 *   /resources/og-preview?title=Some+title&url=hanihusam.com/x
 */
export async function loader({ request }: Route.LoaderArgs) {
	if (process.env.NODE_ENV === 'production') {
		throw new Response('Not found', { status: 404 })
	}

	const url = new URL(request.url)
	const customTitle = url.searchParams.get('title')
	const customUrl = url.searchParams.get('url') ?? 'hanihusam.com'
	const customImage = url.searchParams.get('featuredImage')

	const samples = customTitle
		? [
				{
					name: 'custom (from query string)',
					template: (customImage ? 'project' : 'page') as OgTemplateName,
					params: {
						title: customTitle,
						url: customUrl,
						...(customImage ? { featuredImage: customImage } : {}),
					} as OgTemplateParams,
				},
				...SAMPLES,
			]
		: SAMPLES

	const cards = await Promise.all(
		samples.map(async (sample) => {
			const started = Date.now()
			try {
				// renderOgTemplatePng parses the params itself, so an invalid sample
				// surfaces here as a caught error rather than rendering something
				// production could never produce.
				const { png } = await renderOgTemplatePng(
					sample.template,
					sample.params,
				)
				return {
					name: sample.name,
					durationMs: Date.now() - started,
					dataUri: `data:image/png;base64,${Buffer.from(png).toString('base64')}`,
					error: null,
				}
			} catch (error: unknown) {
				return {
					name: sample.name,
					durationMs: Date.now() - started,
					dataUri: null,
					error: error instanceof Error ? error.message : String(error),
				}
			}
		}),
	)

	return { cards }
}

export default function OgPreview({ loaderData }: Route.ComponentProps) {
	return (
		<main
			style={{
				fontFamily: 'ui-sans-serif, system-ui, sans-serif',
				background: '#111',
				color: '#eee',
				minHeight: '100vh',
				padding: 32,
			}}
		>
			<h1 style={{ fontSize: 20, marginBottom: 24 }}>
				OG template preview{' '}
				<span style={{ color: '#888', fontWeight: 400 }}>
					· {OG_CANVAS.width}×{OG_CANVAS.height} · dev only
				</span>
			</h1>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
				{loaderData.cards.map((card) => (
					<figure key={card.name} style={{ margin: 0 }}>
						<figcaption
							style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}
						>
							{card.name} · {card.durationMs}ms
						</figcaption>
						{card.dataUri ? (
							<img
								src={card.dataUri}
								alt={card.name}
								width={OG_CANVAS.width}
								height={OG_CANVAS.height}
								style={{
									width: '100%',
									maxWidth: OG_CANVAS.width,
									height: 'auto',
									borderRadius: 8,
									border: '1px solid #333',
								}}
							/>
						) : (
							<pre
								style={{
									color: '#f87171',
									background: '#1a1a1a',
									padding: 16,
									borderRadius: 8,
									whiteSpace: 'pre-wrap',
								}}
							>
								{card.error}
							</pre>
						)}
					</figure>
				))}
			</div>
		</main>
	)
}
