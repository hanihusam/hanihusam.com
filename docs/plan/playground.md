# Playground feature implementation plan

Status: **Approved architecture, not implemented.** This plan records the
decisions made during the feasibility review and is intended to be executable
by Hani or a future AI agent without repeating that investigation.

Before changing code, read `AGENTS.md`, `docs/agents/architecture.md`,
`docs/agents/content-and-data.md`, and `docs/agents/code-style.md`. Do not commit
without Hani's explicit permission. Preserve unrelated worktree changes.

---

## 1. Goal

Add a playground experience at:

```text
https://playground.hanihusam.com/
https://playground.hanihusam.com/<demo-slug>
https://playground.hanihusam.com/<demo-slug>/full
```

The playground home page is a gallery of published demos. A demo detail page
shows a responsive split view with syntax-highlighted source and the live local
React component. The full route shows only the live component in a viewport-
sized stage and is opened from a real `target="_blank"` link.

The displayed source is fetched from a separate public GitHub repository at
build time. The executable component is never fetched or evaluated from GitHub:
it is statically imported from `app/demos/` in this repository. The remote file
is a pinned, public reference copy and must match the local file exactly after
safe newline normalization.

The feature uses the existing Fly app, React Router SSR build, Tailwind theme,
and Shiki dependency. It does not introduce an iframe, sandbox, runtime source
fetch, runtime compilation, or new package.

---

## 2. Confirmed decisions

| Area | Decision |
| --- | --- |
| Production hostname | Exact `playground.hanihusam.com`; no wildcard DNS or certificate |
| Deployment | Same Fly app and Express process |
| Rendering | Existing SSR; only source fetch and highlighting happen at build time |
| Live component | Local static import from `app/demos/` |
| Displayed source | Separate public GitHub repository |
| Remote revision | Full 40-character pinned commit SHA, not `main` |
| Integrity | Build fails on fetch failure, invalid metadata, or remote/local mismatch |
| Initial state | Empty gallery is supported; no external repository is required until the first demo |
| Theme | Shared preference between apex and playground hosts |
| SEO | Index gallery and split pages; `noindex, follow` full pages |
| Full view | Dedicated route with an invisible `min-h-dvh w-full` stage wrapper |
| Dependencies | No new dependency; use installed Shiki |
| Source isolation | None; code is trusted, but remote text is never executed |

### Important interpretation of “static”

The generated highlighted source is static for the lifetime of a deployment.
The HTML document is still rendered by React Router SSR for each request. Do
not add React Router prerendering or a second static-site build.

---

## 3. Current codebase constraints

- `app/root.tsx` owns the only document and currently renders `LayoutRoot`, the
  top blur, `PageTransition`, footer, and dock navigation unconditionally.
- `LayoutRoot` includes bottom padding specifically for the fixed dock. Hiding
  the dock with CSS would leave incorrect layout space; playground requests
  must bypass the portfolio wrapper.
- Routes are produced by `flatRoutes()` in `app/routes.ts`.
- React Router matches paths, not hostnames. Existing static routes such as
  `/about` win on both hosts unless the root rejects non-playground matches.
- `/`, `/robots.txt`, and `/sitemap.xml` already have route modules and must
  branch by hostname rather than be duplicated.
- The Express adapter receives the forwarded hostname because `server.js`
  enables `trust proxy`.
- The server's current `host.endsWith('hanihusam.com')` check is too broad for
  host classification and should not be reused.
- The codebase documentation says React Router 7, while installed packages are
  React Router 8.x using the same framework-style APIs. Follow the installed
  API and update stale documentation where touched.
- Shiki is already a direct production dependency and is used through
  `rehype-pretty-code` in the MDX compiler.
- The production MDX GitHub flow is request-time and cached. It is not a model
  for this build-time sync.
- `other/build-info.js` performs the only current build-time external fetch,
  but it runs after the React Router build and cannot produce route inputs.
- There is no automated test suite. Do not add a test framework as part of this
  feature.
- The project requires Node `>=22.22.0`. At planning time, the local shell
  resolved a broken Node 18 installation; correct the active Node toolchain
  before implementation or validation.

---

## 4. Non-goals

- Executing arbitrary remote code
- Keeping the remote repository synchronized at runtime
- GitHub OAuth, repository webhooks, or database-backed demos
- Per-demo subdomains
- Wildcard DNS or wildcard TLS
- Iframe or CSS isolation
- A browser code editor
- Editable/runnable source
- Supporting untrusted submissions
- Widening the MDX content type beyond `projects`
- Adding a test runner
- Redesigning the main portfolio layout
- Creating the external GitHub repository without explicit authorization

---

## 5. Target architecture

```text
app/demos/catalog.ts
        │
        ├── metadata ───────────────► playground gallery + SEO
        │
        ├── localFile ──────────────► build sync reads local text
        │
        └── remotePath ─────────────► raw.githubusercontent.com/<sha>/...
                                              │
                                      compare normalized text
                                              │
                                      Shiki highlight at build
                                              │
                           app/demos/.generated/sources.json
                                              │
                           app/demos/source.server.ts
                                              │ loader data
                                              ▼
                              /<slug> split-view route

app/demos/registry.tsx
        │ explicit static imports
        ├───────────────────────────► /<slug> live panel
        └───────────────────────────► /<slug>/full viewport stage
```

There are deliberately two registries:

1. `catalog.ts` is serializable metadata and can be imported by the Node sync
   script without pulling live components into it.
2. `registry.tsx` contains explicit component imports and is used only by the
   live routes.

Both are keyed by the same slug. A shared integrity function must reject a
published catalogue entry without a component and a registry entry without a
catalogue entry. An unpublished catalogue entry may omit its component so a
draft can remain as metadata without being bundled.

---

## 6. Proposed file structure

```text
app/
  components/
    playground/
      demo-card.tsx
      demo-stage.tsx
      playground-empty-state.tsx
      playground-index.tsx
      playground-not-found.tsx
      playground-split-view.tsx
      source-panel.tsx

  demos/
    catalog.ts
    registry.tsx
    source-config.ts
    source.server.ts
    types.ts
    .generated/
      sources.json                 # generated, ignored by git
    <demo-slug>.tsx                # one component per file

  routes/
    _playground.tsx                # pathless host guard
    _playground.$slug.tsx          # /<slug>, split view
    _playground.$slug_.full.tsx    # /<slug>/full, sibling route

  utils/
    site-host.server.ts

other/
  sync-playground-demos.ts

docs/
  agents/
    architecture.md                # document the shipped runtime shape
```

Also modify:

- `app/root.tsx`
- `app/routes/_index.tsx`
- `app/routes/robots[.]txt.tsx`
- `app/routes/sitemap[.]xml.tsx`
- `app/routes/action.set-theme.tsx`
- `app/utils/theme.server.ts`
- `server.js`
- `package.json`
- `other/validate`
- `.gitignore`
- possibly `Dockerfile` only if a new non-bundled runtime file is introduced

Do not modify `fly.toml` merely to add the hostname. Fly custom domains and
certificates are edge configuration, not `fly.toml` configuration.

---

## 7. Data contracts

### 7.1 Source repository configuration

`app/demos/source-config.ts` starts with no repository so an empty gallery can
build:

```ts
type DemoSourceRepository = {
	owner: string
	repository: string
	commit: string
}

export const demoSourceRepository: DemoSourceRepository | null = null
```

When the first demo is published, configure one public repository for all
demos:

```ts
export const demoSourceRepository = {
	owner: 'hanihusam',
	repository: 'playground',
	commit: '0123456789abcdef0123456789abcdef01234567',
} satisfies DemoSourceRepository
```

The commit must match `/^[a-f0-9]{40}$/`. Do not accept branch names, short
SHAs, tags, user-supplied raw URLs, or arbitrary hosts.

### 7.2 Demo catalogue entry

Keep public metadata separate from the React component:

```ts
type DemoDefinition = {
	slug: string
	title: string
	description: string
	localFile: string
	remotePath: string
	language: 'tsx' | 'ts' | 'jsx' | 'js' | 'css'
	tags: Array<string>
	published: boolean
	indexing?: 'index' | 'noindex'
}
```

Example future entry:

```ts
{
	slug: 'hello-playground',
	title: 'Hello Playground',
	description: 'A minimal end-to-end playground example',
	localFile: 'app/demos/hello-playground.tsx',
	remotePath: 'src/demos/hello-playground.tsx',
	language: 'tsx',
	tags: ['React', 'Theme'],
	published: true,
}
```

Rules:

- Slugs are lowercase kebab-case.
- Slugs are unique.
- Slugs cannot be an existing top-level portfolio/resource segment, including
  `about`, `links`, `works`, `work`, `resources`, `action`, `cache.sqlite`,
  `healthcheck`, `robots.txt`, `sitemap.xml`, or refresh routes.
- `localFile` must stay inside `app/demos/`; reject path traversal and symlinks
  resolving outside that directory.
- `remotePath` must be repository-relative and must not begin with `/` or
  contain `..` segments.
- `published: false` omits a demo from the gallery, sitemap, and public route.
- `indexing: 'noindex'` keeps a published split page out of search while still
  allowing direct access.
- The full route is always `noindex, follow`, regardless of the catalogue.

### 7.3 Generated source record

Generate JSON keyed by slug:

```ts
type GeneratedDemoSource = {
	slug: string
	commit: string
	remotePath: string
	githubUrl: string
	rawUrl: string
	highlightedHtml: string
	plainSource: string
}
```

`plainSource` supports copy-to-clipboard without extracting text from Shiki
markup. If generated size becomes material, remove it and copy from a hidden
plain `<code>` value, but prefer correctness initially.

The generated directory is ignored by Git. A handwritten
`app/demos/source.server.ts` imports the JSON and exposes typed lookups only to
loaders. The sync step must run before any command that requires this import.

---

## 8. Host and route design

### 8.1 Host classification

Add a server-only classifier with these production results:

| Host | Variant |
| --- | --- |
| `hanihusam.com` | `portfolio` |
| `playground.hanihusam.com` | `playground` |
| configured existing aliases, if any | preserve current behavior |
| anything else | `unknown` |

In development, recognize `localhost`, `127.0.0.1`, and
`playground.localhost`. Compare `URL.hostname`, not the raw `Host` header, so
ports and casing are normalized. Do not use `endsWith()` as a trust check.

Before tightening `server.js`, authenticate Fly CLI and inspect existing
certificates/hostnames so a currently supported alias such as `www` is not
accidentally broken.

The root loader adds `siteVariant` to its existing data. `server.js` should use
the same exact allowlist semantics for `X-Robots-Tag` and CORS behavior, but do
not reject health checks before React Router unless Fly's health-check host is
confirmed.

### 8.2 Root shell split

Refactor `app/root.tsx` into small named shell components while preserving the
single `Document`:

```text
Document
  ├── portfolio → existing LayoutRoot/chrome unchanged
  └── playground → direct Outlet, no portfolio wrapper/chrome
```

The playground branch must omit:

- `LayoutRoot`
- `TopBlurOverlay`
- `PageTransition`
- `Footer`
- `Navigation`

It must retain:

- `<html>` and `<head>`
- global styles, fonts, and semantic tokens
- theme class
- canonical/meta support
- scroll restoration
- React scripts and hydration
- analytics unless Hani explicitly requests otherwise

Use `useMatches()` handles to verify that a playground-host request matched a
playground route. The sole exception is `/`, which uses the existing index
route with a hostname branch. If `playground.hanihusam.com/about` matches the
portfolio route, the root renders a stripped playground 404 instead of the
About page.

### 8.3 Pathless playground routes

`_playground.tsx`:

- Loader asserts the exact playground host or an allowed local playground
  host.
- Main-domain requests throw a 404.
- Component is only `<Outlet />`.
- Export a handle identifying the match as playground-owned.

`_playground.$slug.tsx`:

- Validates a published catalogue entry.
- Loads only that entry's generated highlighted source.
- Loads no source from GitHub at runtime.
- Returns metadata needed by the split view.
- Uses private theme-aware cache headers consistent with existing routes.

`_playground.$slug_.full.tsx`:

- The trailing underscore keeps it a sibling of `/:slug`, so it cannot render
  inside the split-page component.
- Validates the same published catalogue entry.
- Does not import or return generated source.
- Renders the component inside an invisible `min-h-dvh w-full` stage.
- Emits both a robots meta tag and `X-Robots-Tag: noindex, follow`.
- Canonicalizes to `https://playground.hanihusam.com/<slug>`.

### 8.4 Playground home route

React Router cannot define a second host-specific `/` route. Update the
existing `_index.tsx` loader, meta function, and component to return/render a
discriminated result:

```text
portfolio host  → existing home loader and component behavior
playground host → published demo metadata and PlaygroundIndex
unknown host    → 404/noindex behavior
```

Do not fetch Substack or MDX project data for the playground branch. Extract
the playground gallery into `app/components/playground/playground-index.tsx`
so the existing route remains an adapter rather than becoming one large mixed
component.

### 8.5 Navigation behavior

Use a literal anchor for full view:

```tsx
<a
	href={`/${demo.slug}/full`}
	target="_blank"
	rel="noopener noreferrer"
>
	Open full view
</a>
```

Do not call `window.open`. The route must work on direct load, refresh, copied
URL, and new tab with JavaScript initially disabled.

---

## 9. Build-time source synchronization

Implement `other/sync-playground-demos.ts` as a deterministic Node 22 script.

### 9.1 Empty catalogue behavior

If there are no published demos:

- The repository configuration may be `null`.
- Generate a valid empty `sources.json`.
- Exit successfully without network access.
- The playground home displays its designed empty state.

If at least one demo is published, a valid repository configuration and pinned
SHA are mandatory.

### 9.2 Per-demo algorithm

For every published demo:

1. Validate slug, paths, language, repository coordinates, and SHA.
2. Resolve `localFile` from the repository root and prove it remains under
   `app/demos/`.
3. Read the local file as UTF-8.
4. Construct the raw URL from hardcoded `https://raw.githubusercontent.com`,
   validated owner/repository, pinned SHA, and encoded path segments.
5. Fetch with a bounded timeout and response-size limit.
6. Reject non-2xx responses and unexpected final origins.
7. Decode as UTF-8.
8. Normalize only CRLF/CR to LF and one trailing newline policy.
9. Compare remote and local normalized strings byte-for-byte.
10. On mismatch, report the slug and first differing line without dumping the
    entire source file.
11. Highlight the remote string with Shiki using its declared language.
12. Produce light and dark theme variables in one markup payload.
13. Build a pinned GitHub `blob/<sha>/<path>` URL.
14. Write all results in stable slug order.

Remote source is data. Never import it, pass it to `eval`, compile it, or write
it into the executable demo directory.

### 9.3 Shiki output

- Reuse the installed `shiki` package directly.
- Initialize one highlighter per sync run, not one per demo.
- Load only the languages and two themes the catalogue requires.
- Prefer a light GitHub theme and a dark GitHub theme using Shiki CSS variables.
- Keep Shiki and generated markup out of the browser JavaScript bundle.
- Shiki escapes source text; rendering its generated HTML with
  `dangerouslySetInnerHTML` is acceptable at this trusted build boundary.
- Add narrowly scoped CSS that switches Shiki variables under the existing
  `.dark` class.

### 9.4 Deterministic and safe output

- Sort by slug.
- Do not include build timestamps.
- Write JSON to a temporary file beside the destination, then atomically
  rename it.
- Clean up the temporary file on error.
- Do not overwrite the last valid generated file until every demo succeeds.
- Use JSON serialization rather than generating TypeScript source literals.
- Add `/app/demos/.generated/` to `.gitignore`.

### 9.5 Command orchestration

Avoid duplicate sync processes racing during the existing concurrent
validation command. Introduce internal commands that assume sync is complete:

```json
{
	"scripts": {
		"sync:demos": "tsx other/sync-playground-demos.ts",
		"build": "npm run sync:demos && npm run build:app",
		"build:app": "run-s build:rr build:info",
		"typecheck": "npm run sync:demos && npm run typecheck:app",
		"typecheck:app": "react-router typegen && tsc"
	}
}
```

Update `other/validate` to:

1. Run `npm run sync:demos` once.
2. Run lint, `typecheck:app`, and `build:app` concurrently.

Run sync before starting development as well. Prefer an explicit command in
`dev` over an npm lifecycle hook so the sequence is visible in `package.json`.

The Dockerfile already runs `npm run build` with CA certificates installed, so
the strict fetch will occur in the production image build without a runtime
secret. The reference repository must be public. Do not reuse
`BOT_GITHUB_TOKEN` unless the public-repository decision changes.

---

## 10. Live component registry

`app/demos/registry.tsx` must use explicit static imports:

```tsx
import { HelloPlayground } from '@/demos/hello-playground'

const demoComponents = {
	'hello-playground': HelloPlayground,
}
```

Do not derive import paths from strings and do not dynamically execute source.
Each demo:

- Lives in one file under `app/demos/` unless it has clearly reusable local
  support modules.
- Uses a named function export.
- Is safe to import during SSR and does not access `window` at module scope.
- Receives no implicit portfolio navigation or layout.
- Uses Tailwind and semantic CSS tokens according to existing conventions.
- Owns its internal UI state.
- Treats the full-view stage as `width: 100%` and at least `100dvh`.

Initially, static imports mean the playground route chunk includes every demo.
Keep this simple until bundle size proves it is a problem. Revisit code splitting
only after measuring, likely when the catalogue exceeds roughly 20 substantial
demos.

---

## 11. UI behavior

### 11.1 Gallery

- Render published demos only.
- Show title, description, and tags.
- Link cards to `/<slug>` on the same hostname.
- Provide a deliberate empty state before the first demo is published.
- Do not present the empty state as an error.
- Keep the layout independent of portfolio `Grid` if that component carries
  portfolio-specific gutters; reuse it only if the result is intentionally
  consistent.

### 11.2 Split page

- Desktop: source and live stage side by side, initially 50/50.
- Mobile: stack the live stage before source so the result is seen first.
- Each desktop panel scrolls independently when content exceeds the viewport.
- Avoid a JavaScript resizer in the first implementation. CSS-only 50/50 is a
  smaller, more accessible baseline.
- The source panel includes language, pinned short SHA, GitHub link, and copy
  action.
- The full-view action is a real new-tab anchor.
- Preserve visible focus states and logical keyboard order.
- Use `clsxm` for class composition, tabs, single quotes, no semicolons, named
  function components, and semantic CSS custom properties for colors.

### 11.3 Source panel

- Render semantic `<pre><code>` markup around or within Shiki's generated
  structure.
- Give the source pane an accessible name.
- Preserve horizontal scrolling; never wrap source by default.
- Use the generated plain source for copy behavior.
- Reuse an existing clipboard primitive if it fits; do not duplicate its
  behavior merely to change visuals.
- Keep code text selectable.
- Display the pinned GitHub source link visibly so “proof of source” is not an
  invisible implementation detail.

### 11.4 Full view

- No title, source panel, buttons, navigation, footer, blur overlay, or route
  animation.
- A nonvisual viewport wrapper is allowed to establish dimensions.
- Keep global styles, Tailwind tokens, fonts, theme, hydration, and scripts.
- Interactive demos must remain interactive after direct navigation.
- Unknown or unpublished slugs render a stripped playground 404.

---

## 12. Theme sharing

The current `hnh_theme` cookie is host-only. Setting a domain-scoped cookie
with the same name can leave two cookies with ambiguous precedence, so migrate
to a new name such as `hnh_theme_shared`.

Production cookie attributes:

```text
Domain=hanihusam.com
Path=/
Secure
SameSite=Lax
```

Do not set a production `Domain` or `Secure` attribute on localhost.

Migration behavior:

1. Read the new shared cookie first.
2. Fall back to the old `hnh_theme` cookie so existing users keep their choice.
3. On the next theme action, write the new shared cookie.
4. Optionally expire the old host-only cookie on the apex response.
5. Keep the existing system/light/dark form contract.

The playground does not need a dock theme toggle. It inherits the shared root
theme and CSS tokens. If a future playground-specific toggle is added, it must
post to the same existing action route.

Security consequence: any future subdomain under `hanihusam.com` can overwrite
the shared preference cookie. This is acceptable for a non-sensitive theme
value but must not become a pattern for authentication cookies.

---

## 13. SEO and discoverability

### 13.1 Indexed pages

Index:

- `https://playground.hanihusam.com/`
- Each published `https://playground.hanihusam.com/<slug>` unless its catalogue
  entry says `noindex`

Do not index:

- `/<slug>/full`
- unpublished demos
- unknown hosts or routes

`noindex` full pages remain shareable, bookmarkable, and followable.

### 13.2 Canonicals

- Gallery canonical: playground root.
- Split canonical: its own playground URL.
- Full canonical: the corresponding split URL.

The current root `Canonical` always mirrors `location.pathname`. Extend it to
honor a route handle or other explicit canonical override so the full route
does not emit a second conflicting canonical link.

### 13.3 Metadata

- Gallery gets a playground-specific title and description.
- Split pages use demo title and description.
- Full pages use a concise title, robots meta, and split canonical.
- Continue using the existing social-meta helpers where possible.
- Do not generate a new OG renderer or template in this feature. A generic page
  card is sufficient initially.

### 13.4 Robots and sitemap

The existing resource routes already derive their origin from the request.
Branch their content by hostname:

- Portfolio host: preserve current output exactly.
- Playground host robots: allow crawling and point to the playground sitemap.
- Playground sitemap: gallery plus indexed published split pages only.
- Exclude every `/full` URL.
- Unknown hosts: return noindex/disallow behavior.

Do not fetch MDX projects when producing the playground sitemap. Catalogue
metadata is local and sufficient.

---

## 14. Error and failure behavior

| Failure | Required result |
| --- | --- |
| Empty catalogue | Successful build and designed empty gallery |
| Published demo without repo config | Build failure with actionable message |
| Invalid/non-full SHA | Build failure |
| GitHub timeout or non-2xx | Build failure; preserve previous generated file |
| Remote redirect outside expected origin | Build failure |
| Remote/local mismatch | Build failure naming slug and first differing line |
| Duplicate/reserved slug | Build failure |
| Missing local file | Build failure |
| Catalogue/registry mismatch | Build or startup failure before serving demo |
| Unknown demo | Stripped playground 404 |
| Main host requests demo slug | Existing main-domain 404 behavior |
| Playground host requests portfolio route | Stripped playground 404 |
| Full route | Always noindex and split canonical |

Do not silently fall back to local source when the remote fetch fails. That
would violate the agreed provenance contract. Do not publish stale highlighted
source after a failed production build.

---

## 15. Implementation phases

### Phase 0 — prerequisites and clean baseline

> [!todo]
> - [ ] Activate Node `>=22.22.0` and verify `node --version` and `npm --version`.
> - [ ] Run `git status --short` and preserve unrelated files, including any existing `.DS_Store` changes.
> - [ ] Run the existing validation command once before feature changes.
> - [ ] Inspect authenticated Fly certificates/aliases before changing exact host handling.
> - [ ] Confirm `playground.localhost:3000` is the local-development hostname.

### Phase 1 — catalogue and empty gallery foundation

> [!todo]
> - [ ] Add demo types, nullable source configuration, and an empty catalogue.
> - [ ] Add an empty live component registry.
> - [ ] Add catalogue/registry integrity checks.
> - [ ] Build the playground gallery and intentional empty state.
> - [ ] Branch the existing `_index.tsx` loader/meta/component by site variant without changing portfolio behavior.
> - [ ] Verify the playground branch does not fetch MDX or Substack data.

### Phase 2 — hostname routing and root shells

> [!todo]
> - [ ] Add exact hostname classification with local-development support.
> - [ ] Return `siteVariant` from the root loader.
> - [ ] Split the root into portfolio and playground shells.
> - [ ] Preserve the current portfolio shell byte-for-byte where practical.
> - [ ] Add the pathless playground host guard and split/full route modules.
> - [ ] Ensure portfolio routes cannot render through the playground shell.
> - [ ] Ensure demo routes 404 on the main hostname.
> - [ ] Tighten server noindex/CORS host checks without breaking Fly health checks or existing aliases.

### Phase 3 — source sync and build integration

> [!todo]
> - [ ] Implement strict catalogue and repository validation.
> - [ ] Implement safe local path resolution.
> - [ ] Implement bounded raw GitHub fetching pinned to a full SHA.
> - [ ] Implement newline normalization and exact comparison.
> - [ ] Implement one-pass dual-theme Shiki highlighting.
> - [ ] Implement stable atomic JSON generation.
> - [ ] Support a network-free empty catalogue.
> - [ ] Add the generated directory to `.gitignore`.
> - [ ] Add `sync:demos`, `build:app`, and `typecheck:app` scripts.
> - [ ] Update `dev`, `build`, `typecheck`, and `other/validate` sequencing to avoid races.
> - [ ] Confirm Shiki is absent from browser output.

### Phase 4 — split and full experiences

> [!todo]
> - [ ] Add source lookup in a `.server.ts` boundary.
> - [ ] Implement responsive split view with independent desktop scrolling.
> - [ ] Implement source metadata, copy behavior, and pinned GitHub link.
> - [ ] Implement the live demo stage from explicit static imports.
> - [ ] Implement the real `target="_blank"` full-view anchor.
> - [ ] Implement the full route without split-page source loading or visible chrome.
> - [ ] Implement stripped playground 404/error rendering.
> - [ ] Verify direct load, refresh, copy/paste URL, and new-tab behavior.

### Phase 5 — shared theme

> [!todo]
> - [ ] Introduce the new domain-scoped theme cookie name.
> - [ ] Read shared cookie first and old host-only cookie as fallback.
> - [ ] Write secure domain-scoped cookies only in production.
> - [ ] Keep localhost cookies host-only and non-secure.
> - [ ] Verify theme selection on the apex immediately appears on the playground and vice versa.
> - [ ] Verify light and dark Shiki output follows the root `.dark` class.

### Phase 6 — SEO and resource routes

> [!todo]
> - [ ] Add gallery and split-page metadata.
> - [ ] Add full-page robots meta and response header.
> - [ ] Add handle-aware canonical override for full routes.
> - [ ] Branch robots output by exact hostname.
> - [ ] Branch sitemap output by exact hostname.
> - [ ] Include only published indexed split pages in the playground sitemap.
> - [ ] Ensure portfolio robots and sitemap output remain unchanged.
> - [ ] Ensure unknown hosts receive noindex/disallow behavior.

### Phase 7 — first real or starter demo

This phase can happen later. Infrastructure may ship with the empty gallery.

> [!todo]
> - [ ] Create one separate public GitHub repository for all reference copies, manually or with explicit authorization.
> - [ ] Add a minimal real starter component under `app/demos/`.
> - [ ] Copy the exact file to the reference repository.
> - [ ] Commit the reference repository and obtain `git rev-parse HEAD`.
> - [ ] Put the full SHA in `source-config.ts`.
> - [ ] Add the catalogue entry and explicit live registry import.
> - [ ] Run sync and prove the source matches.
> - [ ] Deliberately alter one local line and verify sync fails, then restore it.
> - [ ] Confirm the GitHub link opens the exact pinned blob.

### Phase 8 — DNS, TLS, and rollout

These are external actions. Do not perform them without explicit authorization.

> [!todo]
> - [ ] Deploy/test the code before directing public DNS where possible.
> - [ ] Run `fly certs add playground.hanihusam.com` for app `hanihusam-com`.
> - [ ] Follow Fly's current exact-host DNS instructions.
> - [ ] In Namecheap, add the exact `playground` CNAME or A/AAAA records supplied by Fly; do not add `*`.
> - [ ] Run `fly certs check playground.hanihusam.com` until validation succeeds.
> - [ ] Verify the served certificate includes `DNS:playground.hanihusam.com`.
> - [ ] Verify HTTP redirects to HTTPS.
> - [ ] Verify the apex certificate and site remain unchanged.
> - [ ] Submit or inspect the playground sitemap after launch if indexing is desired immediately.

### Phase 9 — documentation and handoff

> [!todo]
> - [ ] Update `docs/agents/architecture.md` with the host split, routes, sync step, and external source contract.
> - [ ] Document how to add, update, unpublish, and remove a demo.
> - [ ] Document the pinned-SHA update workflow.
> - [ ] Document recovery from mismatch/fetch failures.
> - [ ] Record any implementation deviations in this plan.
> - [ ] Do not mark this plan shipped until production DNS, TLS, routes, source verification, and SEO behavior are checked.

---

## 16. Verification matrix

### Automated repository checks

> [!todo]
> - [ ] `npm run lint`
> - [ ] `npm run typecheck`
> - [ ] `npm run build`
> - [ ] `npm run validate`
> - [ ] Docker production build succeeds with an empty catalogue.
> - [ ] Docker production build succeeds with a valid pinned demo.
> - [ ] Docker production build fails on remote/local mismatch.
> - [ ] Generated output is deterministic across two sync runs.

### Host and route matrix

| Host | Path | Expected |
| --- | --- | --- |
| `hanihusam.com` | `/` | Existing portfolio home unchanged |
| `hanihusam.com` | `/about` | Existing About page unchanged |
| `hanihusam.com` | `/<demo-slug>` | Main-site 404 |
| `playground.hanihusam.com` | `/` | Playground gallery or empty state |
| `playground.hanihusam.com` | `/<demo-slug>` | Split source/live page |
| `playground.hanihusam.com` | `/<demo-slug>/full` | Component-only viewport stage |
| `playground.hanihusam.com` | `/about` | Stripped playground 404 |
| `playground.hanihusam.com` | `/unknown` | Stripped playground 404 |
| unknown hostname | any UI path | Noindexed rejection/404 |

### Manual UI checks

> [!todo]
> - [ ] Mobile stacked layout shows live stage before source.
> - [ ] Desktop split remains usable at common laptop widths.
> - [ ] Long source scrolls horizontally and vertically without moving the live stage unexpectedly.
> - [ ] Keyboard navigation reaches GitHub, copy, demo, and full-view controls in logical order.
> - [ ] Focus indicators remain visible in light and dark themes.
> - [ ] Copy action copies plain source exactly.
> - [ ] Full view opens through a real anchor in a new tab.
> - [ ] Full URL works after refresh and when pasted into a new browser.
> - [ ] Full route contains no visible playground or portfolio chrome.
> - [ ] Reduced-motion preference does not hide content.
> - [ ] Source and metadata render in SSR output with JavaScript disabled.
> - [ ] Interactive demos hydrate when JavaScript is enabled.

### SEO and production checks

> [!todo]
> - [ ] Gallery canonical uses the playground origin.
> - [ ] Split canonical is self-referential.
> - [ ] Full canonical points to split and emits `noindex, follow`.
> - [ ] Playground sitemap excludes full and unpublished routes.
> - [ ] Portfolio sitemap remains unchanged.
> - [ ] No accidental wildcard DNS record exists.
> - [ ] TLS certificate covers the exact playground hostname.
> - [ ] Unknown subdomains do not become indexable copies of the portfolio.

---

## 17. Operating workflow after launch

### Add a demo

1. Create `app/demos/<slug>.tsx` with a named function component.
2. Add its explicit static import to `registry.tsx`.
3. Copy the exact source file into the reference repository.
4. Commit the reference repository.
5. Update the repository-wide pinned SHA in this site.
6. Add the catalogue entry with matching local and remote paths.
7. Run `npm run sync:demos`.
8. Review gallery, split, and full routes locally.
9. Run `npm run validate`.
10. Wait for explicit permission before committing this repository.

### Update a demo

1. Change the local file.
2. Copy the same change to the remote reference file.
3. Commit the reference repository.
4. Update the pinned SHA here.
5. Run sync and validation.

Because the SHA is repository-wide, updating one demo advances the snapshot for
all remote paths. This is desirable: every deployment points to one coherent
reference-repository state.

### Unpublish a demo

Set `published: false`, remove it from the live registry if it should no longer
be directly renderable, run sync, and verify it disappears from the sitemap and
returns 404. The remote history remains available at old pinned commits.

### Diagnose a mismatch

- Confirm both files use the same content, not merely similar implementations.
- Confirm the configured SHA contains the expected remote change.
- Confirm `remotePath` points to the file at that SHA.
- Normalize line endings; do not add broader whitespace normalization to make
  a mismatch disappear.
- Never bypass the check by displaying local source as remote source.

---

## 18. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| GitHub outage blocks deployment | Intentional strict failure; empty catalogue is network-free; retry deployment rather than publish unverifiable source |
| Local and remote copies drift | Exact normalized comparison and pinned SHA |
| Static route wins on playground host | Root match ownership check and reserved slug validation |
| Main site accidentally serves demos | Pathless route exact-host guard |
| Unknown subdomains become duplicate sites | Exact DNS, exact TLS, exact host classifier, noindex unknown hosts |
| Shiki increases client bundle | Run only in Node sync and expose generated HTML through server loader data |
| Generated file race in validation | Sync once, then run internal build/typecheck commands concurrently |
| Generated output is partially written | Temporary file plus atomic rename |
| Full route becomes duplicate indexed content | Robots meta/header and split canonical |
| Theme cookies conflict | New shared cookie name with old-cookie read fallback |
| Demo CSS affects shell | Trusted-code constraint, semantic tokens, review global selectors; no promise of isolation |
| All static imports grow route chunk | Measure first; consider code splitting only when catalogue size warrants it |
| External repo does not yet exist | Ship empty gallery; require repo config only for first published demo |

---

## 19. Definition of done

> [!todo]
> - [ ] Exact-host playground gallery, split, and full routes work in production.
> - [ ] Main portfolio behavior and visual chrome are unchanged.
> - [ ] Playground routes never render the dock, footer, top blur, or portfolio padding.
> - [ ] Empty catalogue builds without GitHub or repository configuration.
> - [ ] A published demo cannot build unless its remote pinned source matches locally.
> - [ ] No remote source is executed or fetched at runtime.
> - [ ] Shiki runs only during sync/build and no new dependency is added.
> - [ ] Theme preference is shared safely between both production hosts.
> - [ ] Gallery and split pages are indexed; full pages are noindex with split canonicals.
> - [ ] Playground robots and sitemap are host-correct.
> - [ ] Exact Namecheap DNS and Fly TLS are verified; no wildcard exists.
> - [ ] `npm run validate` and the production Docker build pass.
> - [ ] Architecture and demo-authoring documentation are updated.
> - [ ] No commit is created without Hani's explicit instruction.

---

## 20. References

- `AGENTS.md`
- `docs/agents/architecture.md`
- `docs/agents/content-and-data.md`
- `docs/agents/code-style.md`
- `app/root.tsx`
- `app/routes.ts`
- `server.js`
- `fly.toml`
- `package.json`
- [Fly custom domains](https://fly.io/docs/networking/custom-domain/)
- [Fly app configuration](https://fly.io/docs/reference/configuration/)
- [Fly certificate commands](https://fly.io/docs/flyctl/certs/)
