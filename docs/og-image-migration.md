# OG image migration: Cloudinary URL composition → self-hosted Satori renderer

Status: **Phases 1–7 complete; awaiting production deploy (Phase 8).** Owner:
Hani Reference:
[`kentcdodds.com/services/site/app/og`](https://github.com/kentcdodds/kentcdodds.com/tree/main/services/site/app/og)

Implementation notes worth keeping (things that only surfaced while building):

- Satori honours `lineClamp` **only** on a `display: block` element — on a flex
  one it is silently ignored. The title clamp is derived from the available
  height rather than hardcoded, so it survives retuning the padding or the
  font-size buckets.
- Vite's dep optimizer walks route modules and chokes on resvg's native `.node`
  binary, so `@resvg/resvg-js` needs `optimizeDeps.exclude` + `ssr.external` in
  `vite.config.ts`.
- `renderOgTemplatePng` parses its own params. That keeps the registry (and zod,
  and the templates) out of the browser bundle, which importing it into a route
  for validation would otherwise drag in.
- No `page-meta.server.ts` was built. `meta()` runs client-side during
  navigation and signing needs the secret, so the existing loader → loaderData →
  `meta()` split is already the correct shape; collapsing it further was not
  possible.
- `getSocialMetas`'s old `image` fallback was dead code (every route passes one)
  and depended on a function Phase 7 deletes. Image tags are now omitted
  entirely when there is no image — the only real case being an ErrorBoundary
  render where the root loader itself threw.

---

## 1. Why

Today's social cards are built by hand-composing a Cloudinary transformation URL
(`getSocialImage` in `app/utils/images.ts:223`). That code is a port of Kent's
_old_ approach; he has since replaced it with a self-hosted renderer. The
current approach is fighting the tool in five places:

| Symptom                                                              | Where                                         |
| -------------------------------------------------------------------- | --------------------------------------------- |
| Font size picked from `title.length` in 4 buckets (no real wrapping) | `images.ts:216`                               |
| Grid math encoded as strings (`$gw_mul_1.3`, `$gh_div_12`)           | `images.ts:237-268`                           |
| Text must be double-URI-encoded                                      | `images.ts:202`                               |
| Emoji must be stripped or the layer breaks                           | `images.ts:207`                               |
| Fonts must live at the Cloudinary root and the URL must be signed    | `images.ts:188`, `cloudinary.server.ts:9`     |
| Seeing a card requires a script + a checked-in PNG                   | `other/preview-og.ts`, `other/og-preview.png` |

After the migration a card is a JSX component with flexbox, rendered by
[Satori](https://github.com/vercel/satori) to SVG and rasterised by
[resvg](https://github.com/yisibl/resvg-js) to PNG, served from a signed, cached
route.

**Non-goals:** changing which pages have cards, changing copy, touching the
non-OG Cloudinary image pipeline (`getImgProps`, `getBlurDataUrl`, video
builders all stay exactly as they are).

---

## 2. Current state

**Producers**

- `app/utils/images.ts:223` —
  `getSocialImage({ title, featuredImage, url, name })` returns an unsigned
  Cloudinary URL.
- `app/utils/cloudinary.server.ts:35` —
  `getSignedSocialImage({ request, title, featuredImage })` wraps it with
  `signCloudinaryUrl` (SHA-1 + `CLOUDINARY_SECRET_KEY`), server-only.

**Consumers** — each does the same three-step dance (loader → loader data →
meta):

| Route                            | Title source        | Featured image                         |
| -------------------------------- | ------------------- | -------------------------------------- |
| `app/root.tsx:149`               | `ROOT_TITLE`        | default placeholder                    |
| `app/routes/_index.tsx:46`       | page title          | default placeholder                    |
| `app/routes/about.tsx:40`        | `PAGE_TITLE`        | default placeholder                    |
| `app/routes/works._index.tsx:79` | `PAGE_TITLE`        | default placeholder                    |
| `app/routes/works.$slug.tsx:83`  | `frontmatter.title` | `frontmatter.bannerSquareCloudinaryId` |

`app/utils/seo.ts:22` — `getSocialMetas` emits the tags; canvas is hardcoded
`2400x1256`, type `image/jpeg` (`seo.ts:48-50`).

---

## 3. Target architecture

```
app/og/
  constants.ts          OG_IMAGE_PATH, TTLs, palette tokens
  schemas.ts            zod schema per template
  registry.tsx          name → { schema, version, size, component }
  url.server.ts         buildOgImageUrl / verifyOgImageRequest (HMAC + zod)
  render.server.ts      satori → resvg → PNG
  fonts.server.ts       Satoshi .woff loaded from public/fonts, memoised
  assets.server.ts      Cloudinary id → data URI, with host allowlist
  social-images.server.ts  getPageSocialImage / getProjectSocialImage
  page-meta.server.ts   buildPageSocialMetas (single call site for routes)
  templates/
    page.tsx            title + author block
    project.tsx         title + featured image + author block

app/routes/
  resources.og-image.ts     signed PNG endpoint (verify → cache → render)
  resources.og-preview.tsx  dev-only gallery for iterating on templates
```

Request flow:

```
route meta ──► buildPageSocialMetas ──► buildOgImageUrl (HMAC sign)
                                             │
social scraper ──GET /resources/og-image?tpl&params&v&sig
                                             │
                             verifyOgImageRequest (sig + version + zod)
                                             │
                             cachified(sqlite, key = sha256(canonical))
                                             │
                             satori(template) → resvg → PNG
                                             │
                    Cache-Control: public, max-age=31536000, immutable
```

---

## 4. Key decisions

### 4.1 Adopt from Kent, unchanged

1. **Signed URLs.** HMAC-SHA256 over `template\0version\0paramsEncoded`,
   constant-time compare, **404** (not 400) on any failure. Without this the
   render route is an open renderer: anyone can burn Fly CPU and make your
   domain serve arbitrary text. (`url.server.ts:60`)
2. **Version inside the signature _and_ the cache key.** Bump
   `registry[tpl].version` when a template changes → every old signed URL 404s
   and every cache entry misses. No purge step, no stale cards.
   (`registry.tsx:27`, `url.server.ts:94`)
3. **`OG_IMAGE_PREVIOUS_SECRETS`** — comma-separated, accepted for _verification
   only_, never for signing. Cards are scraped and cached externally under
   `immutable`; a naive secret rotation would 404 every link already shared.
   (`handler.server.ts:79`)
4. **Registry** keeps schema + version + size + component in one entry, with an
   `isOgTemplateName` type guard at the trust boundary. (`registry.tsx:24`)
5. **Payload caps.** `MAX_PARAMS_ENCODED_LENGTH = 4096` enforced on both sign
   and verify, plus `.max()` on every zod string. (`schemas.ts:3-5`)
6. **Memoised-promise-with-self-heal** for fonts: cache the promise, null it on
   rejection so one transient failure doesn't poison the process.
   (`fonts.server.ts:64`)
7. **`X-Og-Cache: HIT|MISS`** response header for debugging.

### 4.2 Deliberate deviations

| Kent                                                                               | Us                                                                          | Why                                                                                                                                            |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `satori/standalone` + `yoga.wasm` + `resvg-wasm`                                   | `satori` + `@resvg/resvg-js` (native)                                       | We're Node on Fly, not Workers. Drops the whole wasm-init dance (`render.server.ts:25-56`).                                                    |
| `crypto-sync.ts` (150 lines)                                                       | `node:crypto` `createHmac` / `timingSafeEqual`                              | His sync shim exists only because Workers' `meta()` is sync and `crypto.subtle` is async.                                                      |
| `base64url.ts` (hand-rolled)                                                       | `Buffer.from(x).toString('base64url')`                                      | Node has it built in.                                                                                                                          |
| `kv-cache.server.ts` (Workers KV + latin1 fallback)                                | `cachified` over the existing SQLite cache                                  | `app/utils/cache.server.ts` already gives us this.                                                                                             |
| Params carry an image **URL**, guarded by a host allowlist (`assets.server.ts:38`) | Params carry a Cloudinary **public id**; the renderer builds the URL itself | Removes SSRF by construction — no attacker-chosen host is representable. Keep a `res.cloudinary.com` allowlist + byte cap as defence in depth. |
| `emoji-regex` dependency                                                           | Reuse the existing `\p{Extended_Pictographic}` regex                        | Already in `images.ts:207`, no new dep. Still needed — Satori has no emoji font.                                                               |
| 3 templates incl. podcast art                                                      | 2 templates (`page`, `project`)                                             | Matches the pages we actually have.                                                                                                            |

### 4.3 New decisions

- **Canvas drops `2400x1256` → `1200x630`.** That's the spec size and 4× less to
  rasterise. Requires updating `seo.ts:48-50` and `og:image:type` to
  `image/png`.
- **Fonts:** `public/fonts/Satoshi-Bold.woff` + `Satoshi-Regular.woff`
  (optionally `Satoshi-Medium.woff`). **Satori does not support woff2** — must
  be the `.woff` files. Read via `fs` from
  `path.join(process.cwd(), 'public/fonts')`; the Dockerfile already copies
  `public/` into the image.
- **Cache TTL 30 days**, value stored as base64 in the SQLite cache table on the
  Fly volume. Expected working set is ~20–50 cards × ~150KB ≈ under 10MB. If
  that ever becomes a problem, switch to files under `$DATA_DIR/og-cache/`.
- **`getSocialMetas` keeps its current signature.** Everything below it is
  swapped; the meta shape stays stable so routes barely change.

---

## 5. Environment

| Var                         | Required    | Where                                                                         |
| --------------------------- | ----------- | ----------------------------------------------------------------------------- |
| `OG_IMAGE_SECRET`           | yes         | add to `requiredServerEnvs` in `app/utils/env.server.ts:4`; `fly secrets set` |
| `OG_IMAGE_PREVIOUS_SECRETS` | no          | comma-separated, verification only                                            |
| `CLOUDINARY_SECRET_KEY`     | **removed** | unset from Fly and `.env` in Phase 7                                          |

Generate: `openssl rand -hex 32`. Add both to `.env` for local dev.

---

## 6. Phases

Each phase lists its own model/effort. **STOP** markers are points to hand back
for a model switch and approval before continuing.

---

### Phase 1 — Dependencies, env, Docker

**Model: Sonnet 5 · Effort: medium**

Mechanical setup, no design judgment.

- [ ] `npm i satori @resvg/resvg-js`
- [ ] Confirm `package-lock.json` records the `linux-x64-gnu` optional binary
      for resvg (lockfile v3 records all platforms; the Docker build runs
      `npm ci --omit=dev --legacy-peer-deps` on `node:22.22.0-bookworm-slim`).
- [ ] Add `OG_IMAGE_SECRET` to `requiredServerEnvs`
      (`app/utils/env.server.ts:4`) and to local `.env`.
- [ ] `fly secrets set OG_IMAGE_SECRET=$(openssl rand -hex 32)`
- [ ] Create `app/og/constants.ts` (path, TTLs, colour tokens sourced from
      `app/styles/theme.css`).

**Acceptance:** `npm run typecheck` passes; a throwaway script renders
`satori(<div/>)` → resvg → a non-empty PNG buffer locally.

**Risk:** if the resvg native binary doesn't resolve inside the Docker build,
fall back to `@resvg/resvg-wasm` (slower, zero native deps). Decide here, not at
deploy time.

**STOP** — switch model before Phase 2.

---

### Phase 2 — Signing and validation core

**Model: Opus 5 · Effort: high**

This is the security boundary. Get it right once.

- [ ] `app/og/schemas.ts` — zod schemas for `page` and `project`, every string
      `.trim().min(1).max(n)`.
- [ ] `app/og/registry.tsx` — `{ schema, version, size, component }` per
      template, `isOgTemplateName` guard, `getOgTemplate`.
- [ ] `app/og/url.server.ts`:
  - `buildOgImageCanonicalPayload({ template, version, paramsEncoded })` using
    `\0` separators (unambiguous — no field can forge a boundary).
  - `buildOgImageUrl(origin, template, params, secret)` — zod-parse **then**
    encode, reject over `MAX_PARAMS_ENCODED_LENGTH`.
  - `verifyOgImageRequest(searchParams, secrets[])` — returns `null` on every
    failure path; verifies against current + previous secrets;
    `crypto.timingSafeEqual` on equal-length buffers; re-parses params with zod
    after decode; returns `{ template, params, cacheKey }`.

**Acceptance (verify by hand or a scratch script — there is no test suite in
this repo, see `AGENTS.md`):**

- valid URL verifies; tampered `params`, `tpl`, `v`, or `sig` each return `null`
- a URL signed with a previous secret verifies; a URL signed with an unknown
  secret does not
- `buildOgImageUrl` never signs with a previous secret
- a version bump invalidates a previously valid URL
- `cacheKey` is stable for identical params and differs for any change

---

### Phase 3 — Renderer

**Model: Opus 5 · Effort: high** (same session as Phase 2)

- [ ] `app/og/fonts.server.ts` — read Satoshi `.woff` from `public/fonts`,
      memoised promise, nulled on rejection.
- [ ] `app/og/assets.server.ts` — Cloudinary public id → data URI: build the
      delivery URL from the id, `res.cloudinary.com` allowlist, https-only, 5MB
      cap, `c_fit` + `f_png` transform so Satori gets a sane size. Port
      `emojiStrip` from `images.ts:207`.
- [ ] `app/og/render.server.ts` — resolve assets in parallel →
      `satori(element,     { width, height, fonts })` →
      `new Resvg(svg, { fitTo: { mode: 'width' }})` → `.render().asPng()` →
      `.free()`.

**Satori gotchas to respect while writing templates:**

- every element with more than one child needs an explicit `display: 'flex'`
- no `gap` shorthand issues, but no CSS grid at all
- `objectFit` works on `<img>`; `backgroundImage` with a data URI works
- text has no automatic ellipsis — cap with `lineClamp`
- images must be data URIs (remote fetches inside Satori are avoidable and
  slower)

**Acceptance:** a scratch script renders both templates to `/tmp/*.png` at
1200×630 with correct Satoshi glyphs and a visible featured image.

**STOP** — review rendered PNGs together before investing in visual design.

---

### Phase 4 — Templates (visual design)

**Model: Opus 5 · Effort: high** · expect iteration

- [ ] `app/routes/resources.og-preview.tsx` — **dev-only** (404 when
      `NODE_ENV === 'production'`). Renders a gallery of every template with
      sample params, using real signed URLs so there's one code path. This
      replaces `other/preview-og.ts` entirely.
- [ ] `app/og/templates/page.tsx` — title (real wrapping, no length buckets),
      author block (avatar + name + display url), branded background.
- [ ] `app/og/templates/project.tsx` — same, plus the featured image; consider a
      `featuredImageStyle: 'portrait' | 'square'` knob rather than one `c_fit`
      compromise.
- [ ] Pull colours from `app/styles/theme.css` tokens into `constants.ts` — do
      not hardcode hexes twice.
- [ ] Verify long titles, short titles, and a missing featured image.

**Acceptance:** cards look at least as good as today's at every title length,
including the ≥110-char case that currently drops to 56px.

**STOP** — approve the design before wiring it into every route.

---

### Phase 5 — Route and caching

**Model: Sonnet 5 · Effort: medium**

- [ ] `app/routes/resources.og-image.ts`:
  - reject non-GET/HEAD with 405 + `Allow`
  - 404 if `OG_IMAGE_SECRET` is unset
  - `verifyOgImageRequest` → 404 on failure
  - `cachified({ key: verified.cacheKey, cache, ttl: 30d })` around the render
  - headers: `content-type: image/png`,
    `cache-control: public, max-age=31536000, immutable`, `X-Og-Cache: HIT|MISS`
- [ ] `app/og/social-images.server.ts` — `getPageSocialImage` /
      `getProjectSocialImage` wrapping `buildOgImageUrl`.

**Acceptance:** hitting a signed URL twice shows `MISS` then `HIT`; a tampered
`sig` gives 404; `HEAD` returns headers with no body.

---

### Phase 6 — Call-site migration

**Model: Sonnet 5 · Effort: medium**

Mechanical refactor across 6 files.

- [ ] `app/og/page-meta.server.ts` — `buildPageSocialMetas(requestInfo, opts)`
      plus `buildPageSocialMetasFromMatches(matches, opts)`, both delegating to
      the existing `getSocialMetas`. Reuse `getRootRequestInfo` (`seo.ts:12`).
- [ ] Migrate `root.tsx`, `_index.tsx`, `about.tsx`, `works._index.tsx`,
      `works.$slug.tsx` — the loader/loader-data/meta three-step collapses to
      one call each.
- [ ] `seo.ts:48-50` — width `1200`, height `630`, type `image/png`.

**Acceptance:** every route still emits a complete tag set; `npm run validate`
passes. Check a couple of pages' rendered `<head>` in the browser.

---

### Phase 7 — Delete the old path

**Model: Sonnet 5 · Effort: low**

Only after Phase 6 is confirmed working. Delete:

- [ ] `app/utils/cloudinary.server.ts` (whole file — both exports are OG-only;
      confirmed by grep)
- [ ] `getSocialImage`, `socialImageConfig`, `toLayerId`, `doubleEncode`,
      `emojiStrip`, `getTitleFontSize`, `toBase64` from `app/utils/images.ts`
      (lines ~171-288). **Keep** `getImgProps`, `getBlurDataUrl`,
      `getFetchBlurDataUrl`, both image builders, video builders.
- [ ] `other/preview-og.ts`, `other/og-preview.png`, the `preview:og` script
- [ ] `CLOUDINARY_SECRET_KEY` from `.env` and `fly secrets unset`

**Acceptance:** `npm run validate` passes; no dangling imports;
`grep -rn "getSignedSocialImage\|getSocialImage" app other` returns nothing.

**STOP** — switch model before deploy.

---

### Phase 8 — Deploy and verify

**Model: Opus 5 · Effort: medium**

- [ ] `npm run validate`, then push to `main` (CI runs validate, Fly
      auto-deploys).
- [ ] Confirm `OG_IMAGE_SECRET` is set on Fly _before_ the deploy lands, or
      every card 404s.
- [ ] Verify in prod: fetch a card URL, check `X-Og-Cache` flips MISS→HIT and
      the PNG is 1200×630.
- [ ] Re-scrape one page each in the Twitter/X card validator, LinkedIn Post
      Inspector, and a Slack unfurl.
- [ ] Watch Fly memory/CPU on first renders — resvg is the spiky part.
- [ ] Update `docs/agents/architecture.md` (new route + env vars) and this doc's
      status.

**Rollback:** the old path is deleted in Phase 7, so rollback before that point
is a `git revert`; after that point it's a redeploy of the previous image.
Consider deploying Phases 1–6 and holding Phase 7 for a day.

---

## 7. Risk register

| Risk                                                | Likelihood      | Mitigation                                                                        |
| --------------------------------------------------- | --------------- | --------------------------------------------------------------------------------- |
| resvg native binary missing in the Docker image     | medium          | Decide in Phase 1; fall back to `@resvg/resvg-wasm`                               |
| Satoshi `.woff` rejected by Satori                  | low             | Verified `.woff` files exist; convert to `.ttf` if needed                         |
| Render CPU spikes on a 256MB Fly machine            | medium          | 30-day cache + immutable headers mean each card renders once                      |
| `OG_IMAGE_SECRET` missing at deploy → all cards 404 | medium          | Set the secret before Phase 8; route 404s loudly rather than leaking              |
| Previously shared card URLs die                     | high (expected) | Unavoidable — URL shape changes. Scrapers re-fetch; re-scrape key pages manually. |
| Satori layout differs from browser intuition        | high            | Phase 4 preview route exists precisely for this                                   |

---

## 8. Model and effort summary

| Phase                   | Model    | Effort | Rationale                                    |
| ----------------------- | -------- | ------ | -------------------------------------------- |
| 1 · Deps, env, Docker   | Sonnet 5 | medium | Mechanical, well-specified                   |
| 2 · Signing core        | Opus 5   | high   | Security boundary; subtle failure modes      |
| 3 · Renderer            | Opus 5   | high   | Satori/resvg has non-obvious constraints     |
| 4 · Templates           | Opus 5   | high   | Visual design judgment; iterative            |
| 5 · Route + caching     | Sonnet 5 | medium | Clear spec once 2–4 exist                    |
| 6 · Call-site migration | Sonnet 5 | medium | Repetitive edits across 6 known files        |
| 7 · Deletion            | Sonnet 5 | low    | Explicit delete list, guarded by grep        |
| 8 · Deploy + verify     | Opus 5   | medium | Production judgment, prod-only failure modes |

Three switch points: after Phase 1 (→ Opus/high), after Phase 4 (→
Sonnet/medium), after Phase 7 (→ Opus/medium).
