# Revamp Log

## 2026-04-21

- Started Phase 0: capture before-state screenshots
- Fixed 3 pre-existing bugs blocking clean renders:
  - Navbar: `<li>` nested inside `<li>` causing React hydration crash on all
    pages
  - `vite.config.ts`: added `resolve.dedupe` for `react`/`react-dom` to
    eliminate duplicate React instances (framer-motion)
  - `Tag` component: replaced `@reach/checkbox` (bundled React 16/17) with
    native `<label>` + `<input type="checkbox">`
- Screenshots captured (desktop 1280px + mobile 375px):
  - Home (`/`)
  - Blog index (`/blog`)
  - Blog post (`/blog/2020-retrospective`)
  - Links (`/links`)
- Saved to `docs/before/`
- Added Umami analytics script to `<head>` in `root.tsx`
- Added `.claude/` and `.playwright-mcp/` to `.gitignore`
- Audited all dependencies for unused/replaceable packages

2026-04-21 | Removed `@reach/checkbox`, `rehype-prism-plus`, `uuid`,
`@types/uuid`, `lodash.throttle`, `@types/lodash.throttle` | native throttle in
`useScrollSpy.tsx`

2026-04-21 | Prisma/SQLite/LiteFS/`better-sqlite3`/`@epic-web/remember` drop
deferred to Phase 5 | cache → lru-cache, likes+views → Umami

2026-04-21 | Deleted `ProjectSection` + `ProjectCard` | both unused, no imports
found

2026-04-21 | Cloudinary stays for blog images | `CloudinaryImg` +
`ThemedBlogImage` kept as MDX primitives. Revisit if migrating image hosting
later.

2026-04-21 | Token audit done | Still on Tailwind v3, migrate to v4 `@theme` in
Phase 2. Token gaps: no semantic layer (surface/text/border/intent tokens),
`prose.css` has hardcoded hex duplicating existing tokens (`--color-primary-*`,
`--color-secondary-*`, `--color-base`, `--color-white`). One raw Tailwind
palette token in components: `dark:border-gray-600` in `navbar.tsx`. Fix in
Phase 2.

2026-04-21 | Blog: Substack as primary | Site only shows 3-5 featured posts. MDX
stack stays for now, evaluate removal in Phase 5 when Prisma dropped.

2026-04-21 | MDX stack drop candidate | If blog fully moves to Substack,
mdx-bundler + rehype/remark + octokit bisa di-drop Phase 5. Confirm saat
eksekusi.

## 2026-04-22

2026-04-22 | Theme default: light | Warmth-aligned, avoid generic dev dark

2026-04-22 | URL: /works not /work | Plural, consistent with convention

2026-04-22 | Avatar: keep current 3D | No new poses for now, revisit post-launch

2026-04-22 | Phase 1 complete | Strategy doc, sitemap, content map, motion
philosophy locked

2026-04-22 | Design system v2 tokens synced from Figma | `app/styles/theme.css`
added — primitives (`@theme`), semantic tokens light/dark (`:root` +
`[data-theme='dark']`), motion + layout vars. Old `--color-primary-*` /
`--color-secondary-*` tokens removed from `app.css`. Tailwind v4 migration
required to activate `@theme` primitives — deferred to Phase 5.

## 2026-04-23

2026-04-23 | Button component complete | Primary, Secondary, Ghost × Icon Text,
Text Only × Default, Hover, Focus, Disabled | design work

## 2026-04-24

2026-04-24 | Phase 2 components complete | Button, Nav, Project Card, Article
Card, Tag, Avatar, Code Block | Callout, Split-view, Tooltip deferred to Phase
3/5

2026-04-24 | Jumping Phase 4 home page before Phase 3 | Layout redesign before
dark mode to avoid double work

2026-04-24 | Light mode default confirmed | Dark mode duplicate after home
redesign

2026-04-24 | Phase 3 deferred until Phase 6 content work begins | No case study
content ready yet
