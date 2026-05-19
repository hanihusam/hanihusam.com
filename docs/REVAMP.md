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

## 2026-05-13

2026-05-13 | Tailwind v3 → v4 migration complete | PostCSS replaced with
`@tailwindcss/vite` in `vite.config.ts`. `tailwind.css` now uses
`@import "tailwindcss"` + `@import "./theme.css"` + `@config` +
`@variant dark (&:where(.dark, .dark *))`. `app.css` no longer imports
`theme.css` (ownership moved to `tailwind.css`). `postcss.config.mjs` emptied —
Lightning CSS handles autoprefixing.

2026-05-13 | `tailwind.config.ts` slimmed | Removed: `darkMode`,
`theme.screens`, `theme.colors` (referenced dead CSS vars),
`theme.extend.fontFamily`, `theme.extend.fontSize`, `theme.extend.spacing`,
`theme.extend.maxWidth`, `theme.extend.maxHeight`,
`theme.extend.gridTemplateRows`. Kept: `theme.extend.typography` + `plugins`.
`screens.lg` and `spacing.10vw` references hardcoded as literals (`1024px`,
`10vw`). Custom color refs in prose config updated to new semantic tokens
(`--color-sunset-*`, `--color-neutral-*`, `--text-paragraph`).

2026-05-13 | `theme.css` @theme additions | Breakpoints: `--breakpoint-sm/2xl`
reset to `initial`, `--breakpoint-md: 640px`, `--breakpoint-lg: 1024px`,
`--breakpoint-xl: 1440px`. vw spacing: `--spacing-5vw/8vw/10vw`. Max-width:
`--max-width-8xl: 96rem`.

2026-05-13 | `@tailwindcss/typography` stays on `0.5.0-alpha.3` via `@config` |
Installed `insiders` build supports v4 natively but is unstable. Typography
prose config (`prose-light`, `prose-dark`, grid breakout) kept in JS — migrate
when stable v4 typography releases.

## 2026-05-14

2026-05-14 | Phase 3 design system + button + typography complete | Tailwind v4
config finalized (CSS-first, PostCSS updated, vite plugin). Button component
aligned with Figma specs: per-variant focus rings + disabled bg, modern CSS var
syntax. Typography layer simplified: H5/H6 removed, usages remapped to H3/H4.
New `app/components/ui/` directory established. Added
`types/third-party.d.ts` for third-party type augmentations.

2026-05-14 | Button micro-interactions: press animation added |
`active:scale-[0.97]` for tactile feedback, `transition` updated to animate both
colors + transform, `ease-out` for interaction easing, `duration-250` → `duration-150`
for snappy timing.

2026-05-14 | Blog: Tag → FilterTag refactor + semantic tokens | Renamed
`tag.tsx` → `filter-tag.tsx` with updated prop API (onChange callback).
Added `--filter-tag-*` semantic tokens (light + dark) to `theme.css`.
`typography.tsx` extended TextProps to support inner HTML for rich content.
`writing._index.tsx` updated: Tag → FilterTag swap, H6 → H4 for topics label
(aligns with simplified typography layer).

## 2026-05-15

2026-05-15 | Navigation component complete: new Navigation + NavigationItem |
Hero section migrated to new `ButtonLink` component from `ui/button`. New
`app/components/navigation.tsx` + `app/components/ui/navigation-item.tsx`
integrated into root. Supporting tokens and styles added to tailwind.css and
theme.css.

2026-05-15 | Navigation rendering fixes: icon blur resolved + Navbar deleted |
Removed `translate-x-[-50%]` centering that caused subpixel rasterization blur
on icons (replaced with `inset-x-0 mx-auto w-fit` for integer pixel centering).
`asChild` prop eliminates invalid nested `button>a` HTML structure. Nav item
hover now transitions opacity on background child span (keeps icon on separate
compositor layer). Tooltip animation-duration: `400ms` → `150ms`. Old
`navbar.tsx` deleted, Navigation integrated in root.

## 2026-05-19

2026-05-19 | Dependency upgrades | react-router → v7, react/react-dom → v19,
typescript, eslint, vitest, vite, and all related type packages upgraded to
latest.

2026-05-19 | tailwind.config.ts deleted; prose.css rewritten CSS-first |
`tailwind.config.ts` removed entirely. All prose typography customization
migrated to plain CSS in `prose.css` using `.prose.prose-light` and
`.dark .dark\:prose-dark` selectors — no JS config or `--tw-prose-*` variables
required.

2026-05-19 | @tailwindcss/aspect-ratio removed | Plugin dropped; all
`aspect-h-*`/`aspect-w-*` classes migrated to native Tailwind v4 `aspect-[w/h]`
syntax in `article-card.tsx` and `writing.$slug.tsx`.

2026-05-19 | Theme system overhauled | Replaced `theme-provider.tsx` with a
client hints system (`client-hints.tsx`, `request-info.ts`, `theme.tsx`) for
OS-preference-aware theme detection on first visit. `ThemeSwitcher` component
added to `app/components/ui/`. Toggle cycle simplified: "system" removed as a
clickable state — button now toggles dark↔light directly in one click.

2026-05-19 | ThemeSwitcher icon animation refined | Icons animate on `.dark`
class change (not hover). Easing changed from `ease-in-out-circ` to
`ease-out-quart` (`cubic-bezier(0.165, 0.84, 0.44, 1)`) — icons enter/exit on
user action so ease-out is correct. Duration `400ms` → `350ms`. Added
`@media (prefers-reduced-motion: reduce)` to disable transition for users who
prefer reduced motion.
