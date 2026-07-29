import { buildOgImageUrl, verifyOgImageRequest } from '../app/og/url.server.ts'
import { ogTemplateRegistry, isOgTemplateName } from '../app/og/registry.tsx'

const CURRENT = 'current-secret-aaaa'
const PREVIOUS = 'previous-secret-bbbb'
const UNKNOWN = 'unknown-secret-cccc'
const ORIGIN = 'https://hanihusam.com'

let pass = 0
let fail = 0
function check(label: string, condition: boolean) {
	if (condition) {
		pass++
		console.log(`  ok   ${label}`)
	} else {
		fail++
		console.log(`  FAIL ${label}`)
	}
}

function paramsOf(url: string) {
	return new URL(url).searchParams
}

function tamper(url: string, key: string, value: string) {
	const parsed = new URL(url)
	parsed.searchParams.set(key, value)
	return parsed.searchParams
}

console.log('\n— happy path —')
const pageUrl = buildOgImageUrl(
	ORIGIN,
	'page',
	{ title: 'Crafting interfaces', url: 'hanihusam.com' },
	CURRENT,
)
const verified = verifyOgImageRequest(paramsOf(pageUrl), [CURRENT])
check('valid URL verifies', verified !== null)
check('template returned', verified?.template === 'page')
check(
	'params round-trip',
	(verified?.params as { title: string })?.title === 'Crafting interfaces',
)
check(
	'cacheKey shape',
	/^og-image:[0-9a-f]{64}$/.test(verified?.cacheKey ?? ''),
)
check(
	'path is /resources/og-image',
	new URL(pageUrl).pathname === '/resources/og-image',
)

console.log('\n— tampering —')
check(
	'tampered params rejected',
	verifyOgImageRequest(tamper(pageUrl, 'params', 'eyJhIjoxfQ'), [CURRENT]) ===
		null,
)
check(
	'tampered tpl rejected',
	verifyOgImageRequest(tamper(pageUrl, 'tpl', 'project'), [CURRENT]) === null,
)
check(
	'tampered v rejected',
	verifyOgImageRequest(tamper(pageUrl, 'v', '2'), [CURRENT]) === null,
)
check(
	'tampered sig rejected',
	verifyOgImageRequest(tamper(pageUrl, 'sig', 'f'.repeat(64)), [CURRENT]) ===
		null,
)
check(
	'same-length non-hex sig rejected (no throw)',
	verifyOgImageRequest(tamper(pageUrl, 'sig', 'z'.repeat(64)), [CURRENT]) ===
		null,
)
check(
	'truncated sig rejected',
	verifyOgImageRequest(tamper(pageUrl, 'sig', ''), [CURRENT]) === null,
)
check(
	'unknown template rejected',
	verifyOgImageRequest(tamper(pageUrl, 'tpl', 'nope'), [CURRENT]) === null,
)
check(
	'prototype key not a valid template',
	!isOgTemplateName('constructor') && !isOgTemplateName('toString'),
)
check(
	'prototype template name rejected',
	verifyOgImageRequest(tamper(pageUrl, 'tpl', 'constructor'), [CURRENT]) ===
		null,
)
check(
	'non-integer version rejected',
	verifyOgImageRequest(tamper(pageUrl, 'v', '1.5'), [CURRENT]) === null,
)
check(
	'negative version rejected',
	verifyOgImageRequest(tamper(pageUrl, 'v', '-1'), [CURRENT]) === null,
)
check(
	'missing sig rejected',
	verifyOgImageRequest(
		new URLSearchParams({ tpl: 'page', params: 'x', v: '1' }),
		[CURRENT],
	) === null,
)

console.log('\n— secret rotation —')
const signedWithPrevious = buildOgImageUrl(
	ORIGIN,
	'page',
	{ title: 'Older card', url: 'hanihusam.com' },
	PREVIOUS,
)
check(
	'URL signed with previous secret verifies against [current, previous]',
	verifyOgImageRequest(paramsOf(signedWithPrevious), [CURRENT, PREVIOUS]) !==
		null,
)
check(
	'URL signed with previous secret rejected when only current accepted',
	verifyOgImageRequest(paramsOf(signedWithPrevious), [CURRENT]) === null,
)
const signedWithUnknown = buildOgImageUrl(
	ORIGIN,
	'page',
	{ title: 'Forged', url: 'hanihusam.com' },
	UNKNOWN,
)
check(
	'URL signed with unknown secret rejected',
	verifyOgImageRequest(paramsOf(signedWithUnknown), [CURRENT, PREVIOUS]) ===
		null,
)
check(
	'buildOgImageUrl signs with current only (differs from previous-signed sig)',
	paramsOf(pageUrl).get('sig') !==
		paramsOf(
			buildOgImageUrl(
				ORIGIN,
				'page',
				{ title: 'Crafting interfaces', url: 'hanihusam.com' },
				PREVIOUS,
			),
		).get('sig'),
)
check(
	'empty secret list rejects everything',
	verifyOgImageRequest(paramsOf(pageUrl), []) === null &&
		verifyOgImageRequest(paramsOf(pageUrl), ['  ']) === null,
)

console.log('\n— version bump invalidation —')
const beforeBump = buildOgImageUrl(
	ORIGIN,
	'page',
	{ title: 'Versioned', url: 'hanihusam.com' },
	CURRENT,
)
const cacheKeyBefore = verifyOgImageRequest(paramsOf(beforeBump), [
	CURRENT,
])?.cacheKey
ogTemplateRegistry.page.version = 2
check(
	'previously valid URL fails after registry version bump',
	verifyOgImageRequest(paramsOf(beforeBump), [CURRENT]) === null,
)
const afterBump = buildOgImageUrl(
	ORIGIN,
	'page',
	{ title: 'Versioned', url: 'hanihusam.com' },
	CURRENT,
)
const cacheKeyAfter = verifyOgImageRequest(paramsOf(afterBump), [
	CURRENT,
])?.cacheKey
check('re-signed URL verifies at new version', cacheKeyAfter !== undefined)
check('version bump changes cache key', cacheKeyBefore !== cacheKeyAfter)
ogTemplateRegistry.page.version = 1

console.log('\n— cache key stability —')
const a = verifyOgImageRequest(
	paramsOf(
		buildOgImageUrl(
			ORIGIN,
			'page',
			{ title: 'Same', url: 'hanihusam.com' },
			CURRENT,
		),
	),
	[CURRENT],
)
const b = verifyOgImageRequest(
	paramsOf(
		buildOgImageUrl(
			ORIGIN,
			'page',
			{ title: 'Same', url: 'hanihusam.com' },
			CURRENT,
		),
	),
	[CURRENT],
)
const c = verifyOgImageRequest(
	paramsOf(
		buildOgImageUrl(
			ORIGIN,
			'page',
			{ title: 'Different', url: 'hanihusam.com' },
			CURRENT,
		),
	),
	[CURRENT],
)
check('identical params → identical cache key', a?.cacheKey === b?.cacheKey)
check('different params → different cache key', a?.cacheKey !== c?.cacheKey)
check(
	'same params, different template → different cache key',
	a?.cacheKey !==
		verifyOgImageRequest(
			paramsOf(
				buildOgImageUrl(
					ORIGIN,
					'project',
					{ title: 'Same', url: 'hanihusam.com', featuredImage: 'a/b_c1' },
					CURRENT,
				),
			),
			[CURRENT],
		)?.cacheKey,
)

console.log('\n— schema hardening —')
function rejects(
	label: string,
	template: 'page' | 'project',
	params: Record<string, unknown>,
) {
	let threw = false
	try {
		buildOgImageUrl(ORIGIN, template, params, CURRENT)
	} catch {
		threw = true
	}
	check(label, threw)
}
rejects('empty title rejected', 'page', { title: '', url: 'hanihusam.com' })
rejects('missing url rejected', 'page', { title: 'x' })
rejects('over-long title rejected', 'page', {
	title: 'x'.repeat(201),
	url: 'a',
})
rejects('featuredImage as full URL rejected', 'project', {
	title: 'x',
	url: 'a',
	featuredImage: 'https://evil.test/pwn.png',
})
rejects('featuredImage with protocol-relative host rejected', 'project', {
	title: 'x',
	url: 'a',
	featuredImage: '//evil.test/pwn.png',
})
rejects('featuredImage with path traversal rejected', 'project', {
	title: 'x',
	url: 'a',
	featuredImage: 'bapak2.dev/../../etc/passwd',
})
rejects('featuredImage with space rejected', 'project', {
	title: 'x',
	url: 'a',
	featuredImage: 'bapak2.dev/a b',
})
check(
	'legit cloudinary id accepted',
	(() => {
		try {
			buildOgImageUrl(
				ORIGIN,
				'project',
				{
					title: 'Curious Me',
					url: 'hanihusam.com/works/curious-me',
					featuredImage: 'bapak2.dev/works/curious-me/thumbnail-sm_kedtvy',
				},
				CURRENT,
			)
			return true
		} catch {
			return false
		}
	})(),
)
check(
	'unknown keys stripped before signing',
	(() => {
		const withExtra = buildOgImageUrl(
			ORIGIN,
			'page',
			{ title: 'Same', url: 'hanihusam.com', evil: 'payload' },
			CURRENT,
		)
		return (
			paramsOf(withExtra).get('sig') ===
			paramsOf(
				buildOgImageUrl(
					ORIGIN,
					'page',
					{ title: 'Same', url: 'hanihusam.com' },
					CURRENT,
				),
			).get('sig')
		)
	})(),
)

console.log(`\n${pass} passed, ${fail} failed\n`)
if (fail > 0) process.exit(1)
