# Architecture

Deep reference for the app's runtime shape. See [`AGENTS.md`](../../AGENTS.md)
for the quick start and top-level conventions.

## Stack

- **Framework:** React Router 7 (full-stack, SSR + streaming)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme`) + custom CSS
- **Database:** SQLite via Prisma ORM
- **Content:** MDX, read from the working tree in dev and the GitHub API in
  production (see [`content-and-data.md`](./content-and-data.md))
- **Deployment:** Fly.io — single machine, SQLite on a mounted volume

## Project layout

```
app/
  routes/          # React Router file-based routes
  components/      # Reusable components (ui/ primitives, feature folders)
  og/              # Open Graph card rendering (see "Social cards" below)
  utils/           # Shared utilities (.server.ts = server-only)
  hooks/           # Custom React hooks
  styles/          # Tailwind entry, theme tokens, prose, fonts
  assets/          # Static assets
  entry.client.tsx # Hydration entry
  entry.server.tsx # SSR entry (streaming, CSP nonce, Fly headers)
  root.tsx         # Global layout, theme, error boundaries
  types.ts         # Global types

server.js          # Production Express server (run directly with node)
server/            # Server/dev-server config
prisma/            # schema.prisma, migrations, seed, data.db
contents/projects/ # MDX case studies (flat <slug>.mdx files)
other/             # build-info.js, validate, content watcher, og checks
```

## Entry points

- **`entry.server.tsx`** — SSR with streaming (5s shell timeout), CSP nonce
  injection, and Fly.io region/app response headers. Bots (`isbot`) render via
  `onAllReady` so crawlers get the full HTML.
- **`entry.client.tsx`** — hydration and client setup.
- **`root.tsx`** — global layout, theme provider, stylesheet injection, and the
  global error boundary that catches route errors and unhandled exceptions.

## Key patterns

**Server vs client code.** Files with a `.server.ts(x)` suffix are bundled
server-only. Use it for env access, Prisma queries, GitHub/Octokit calls, and
session management.

**Path alias.** `@/` resolves to `app/`. Use it for all intra-app imports.

**Theme.** OS-preference-aware via client hints (`app/utils/client-hints.tsx`,
`theme.tsx`) with cookie persistence and an anti-FOUC script. The toggle
switches dark↔light directly.

**Routes.** File-based in `app/routes/`. Live pages: `/`, `/about`, `/links`,
`/works`, `/works/:slug`. `work.*` routes `301`-redirect legacy `/work` URLs to
`/works`. Loaders return `data(payload, { headers })`.

## Social cards (`app/og/`)

Open Graph / Twitter card images are rendered by the app itself — a JSX template
through [Satori](https://github.com/vercel/satori) to SVG, then
[resvg](https://github.com/yisibl/resvg-js) to a 1200x630 PNG. Served from
`/resources/og-image`.

| File                      | Role                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `registry.tsx`            | name → `{ schema, version, size, component }`                                         |
| `schemas.ts`              | zod params per template (`page`, `project`)                                           |
| `url.server.ts`           | `buildOgImageUrl` / `verifyOgImageRequest` (HMAC)                                     |
| `render.server.ts`        | satori → resvg; parses its own params, reports `degraded`                             |
| `assets.server.ts`        | Cloudinary id → data URI, host-asserted; failures degrade to `undefined`, never throw |
| `fonts.server.ts`         | Satoshi `.woff` from `public/fonts` (satori has no woff2 support)                     |
| `social-images.server.ts` | what routes call: `getPageSocialImage` / `getProjectSocialImage`                      |
| `templates/`              | `card-layout.tsx` shell + `page` / `project`                                          |

Rules worth knowing before touching it:

- **URLs are signed.** HMAC over `template\0version\0params`; verification
  failures all return `404`. Without this the route is an open renderer.
- **Bump `version` in `registry.tsx` on any visual or param change.** It is
  baked into both the signature and the cache key, so old URLs `404` and old
  cache entries miss — there is no purge step.
- **Build the URL in the loader, never in `meta()`.** Signing needs
  `OG_IMAGE_SECRET`, and `meta()` also runs client-side during navigation.
  Routes thread the URL through loaderData into `getSocialMetas`.
- **Params carry a Cloudinary public id, never a URL** — that is what keeps the
  renderer SSRF-free, since it builds the delivery URL itself.
- Rendered PNGs are cached in the SQLite cache (30 days) and served `immutable`.
  `npm run check:og` verifies the signing/validation boundary (37 checks).
  `/resources/og-preview` is a dev-only gallery for iterating on templates.

**Degradation.** A Cloudinary asset fetch (background/avatar/artwork) can fail
without breaking the card:

| `X-Og-Cache` | Means                                                | `Cache-Control`                |
| ------------ | ---------------------------------------------------- | ------------------------------ |
| `HIT`        | served from the 30-day cache                         | `max-age=31536000, immutable`  |
| `MISS`       | freshly rendered, every asset resolved               | `max-age=31536000, immutable`  |
| `DEGRADED`   | rendered, but ≥1 asset slot failed (real text still) | `max-age=300, must-revalidate` |
| `FALLBACK`   | satori/resvg itself threw — static PNG served        | `max-age=300, must-revalidate` |

- `assets.server.ts`'s `toOptionalAsset` turns a failed fetch into `undefined`
  (logged, never cached as a failure) instead of throwing; the templates render
  without that slot rather than 500ing. `renderOgTemplatePng` reports this via
  `degraded: boolean`.
- A degraded render is never persisted: `resources.og-image.ts` sets
  `context.metadata.ttl = -1` inside `getFreshValue`, `cachified`'s own
  documented way to skip a single value's cache write without discarding the
  value returned to the current request.
- If satori/resvg itself throws, the route serves the checked-in
  `public/og-fallback.png` (generated by `other/generate-og-fallback.ts`, not
  hand-made) rather than a 500 HTML page.

## Environment variables

Enforced in `app/utils/env.server.ts`:

| Variable              | Purpose                              |
| --------------------- | ------------------------------------ |
| `NODE_ENV`            | development / production             |
| `DATABASE_PATH`       | Main SQLite database path            |
| `DATABASE_URL`        | Prisma connection URL                |
| `SESSION_SECRET`      | Session encryption key               |
| `BOT_GITHUB_TOKEN`    | GitHub token for fetching MDX        |
| `REFRESH_TOKEN`       | Token for the cache-refresh endpoint |
| `CACHE_DATABASE_PATH` | Cache SQLite database path           |
| `OG_IMAGE_SECRET`     | HMAC key for signing OG image URLs   |

Optional: `OG_IMAGE_PREVIOUS_SECRETS` (comma-separated) is accepted when
_verifying_ OG URLs but never for signing, so rotating `OG_IMAGE_SECRET` does
not `404` cards already shared and cached by scrapers.

## Performance

- SSR streaming with a 5s shell-render timeout.
- Bot detection via `isbot` (`onAllReady` for crawlers).
- Cloudinary image optimization (`app/components/blog/cloudinary-img.tsx`,
  `getImageBuilder`/`getImgProps` in `@/utils/images`). Cloudinary still hosts
  and transforms images; it no longer composes the social cards.
- OG cards render once (~1s) then serve from cache in single-digit ms.
- Tailwind purging on build.
