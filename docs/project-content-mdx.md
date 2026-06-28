# Project Content via MDX — Single Project Page

_Plan authored: 2026-06-24_

Goal: render rich project case-study pages at `/works/:slug` (reference:
[theodorusclarence.com/projects/dimension-ai](https://theodorusclarence.com/projects/dimension-ai)),
driven by MDX — the same mechanism as the blog, reusing the existing engine.

---

## Key finding: the engine already supports `projects`

The MDX pipeline is **already content-type agnostic** — no engine work needed:

- `app/utils/mdx.server.ts` — `getMdxPage`, `getContentMdxListItems` accept any
  `contentDir`, and `ContentType = "blog" | "projects"` is already defined.
- `types/index.d.ts` — `ProjectFrontmatter` / `ProjectType` already exist.
- `app/utils/blog.server.ts` — views/likes are keyed purely by `slug` via the
  `ContentMeta` table, so the same functions work for projects unchanged.
- `app/utils/complie-mdx.server.ts` — injects `readingTime` + `wordCount` into
  **every** content type's frontmatter at compile time (used for the view
  counter's "mark as read" gating).
- `downloadMdxFileOrDirectory` (github.server.ts) supports both a flat
  `contents/projects/<slug>.mdx` file and a `contents/projects/<slug>/index.mdx`
  folder. We use **flat files** (consistent with the blog; images are served via
  Cloudinary, not colocated).

So this work is essentially: **clone the blog render path for projects**, add a
minimal list route, and build the design-system `Tag` pill for the tech stack.

---

## Reference page → existing pieces

| On the reference page       | How we produce it                                   | Status         |
| --------------------------- | --------------------------------------------------- | -------------- |
| Title                       | `frontmatter.title`                                 | ✅ in type     |
| Subtitle / one-liner        | `frontmatter.description`                           | ✅             |
| Category label              | `frontmatter.category`                              | ✅             |
| Banner image + blur         | `frontmatter.bannerCloudinaryId` + `getBlurDataUrl` | ✅             |
| View counter + like button  | `blog.server.ts` meta (slug-keyed)                  | ✅ reuse as-is |
| Table of contents           | `TableOfContents` + `useScrollSpy` over `.prose`    | ✅ reuse       |
| Body (headings/images/code) | `useMdxComponent` over compiled MDX                 | ✅ reuse       |
| Tech stack pills            | new `Tag` component (Figma node 220-463)            | ⬜ build       |
| Live site / GitHub links    | `frontmatter.link` / `frontmatter.github`           | ✅ in type     |

---

## Work items

### 1. Types — `types/index.d.ts`

- Add `readingTime?: ReadTimeResults` and `wordCount?: number` to
  `ProjectFrontmatter` (injected at runtime by `compileMdx`; declaring them lets
  the view/read logic type-check).
- Keep `techs: string` (comma-separated). The `Tag` row splits on `,` and trims.

### 2. Design tokens — `app/styles/theme.css`

Add `Tag` tokens to **both** the light (`:root`) and dark blocks, mirroring the
existing `--filter-tag-*` convention and mapping to palette primitives per the
Figma component:

| Token                     | Light                 | Dark (suggested)      |
| ------------------------- | --------------------- | --------------------- |
| `--tag-surface-default`   | `--color-neutral-100` | `--color-neutral-800` |
| `--tag-border-default`    | `--border-primary`    | `--color-neutral-700` |
| `--tag-text-default`      | `--text-label`        | `--text-label`        |
| `--tag-surface-brand`     | `--color-sunset-50`   | `--color-sunset-950`  |
| `--tag-border-brand`      | `--color-sunset-200`  | `--color-sunset-700`  |
| `--tag-text-brand`        | `--color-sunset-600`  | `--color-sunset-300`  |
| `--tag-surface-secondary` | `--color-sky-50`      | `--color-sky-900`     |
| `--tag-border-secondary`  | `--color-sky-200`     | `--color-sky-700`     |
| `--tag-text-secondary`    | `--color-sky-600`     | `--color-sky-300`     |

> Dark-mode steps are a suggested inversion; confirm against Figma dark tokens
> if/when they exist. Light values come straight from the Figma node.

### 3. `Tag` component — `app/components/ui/tag.tsx`

Port of Figma node **220-463** (`FgO4Ew3x6leMA44NCpJ12F`), converted to this
project's Tailwind/token system (NOT the raw Figma `var(--...)` classes):

- Props: `{ color?: "brand" | "default" | "secondary"; className?; children }`.
- Style: `border`, `rounded-xl`, `px-3 py-1.5`, label type
  (`text-xs font-medium tracking-[0.8px] leading-3`), surface/border/text driven
  by the tokens above.
- Default `color="default"`.

### 4. Tech pills usage

On the project page, render the stack as a flex-wrap row of `<Tag>`:
`frontmatter.techs.split(",").map((t) => <Tag color="secondary">{t.trim()}</Tag>)`.
(Color variant final choice TBD; `secondary` matches the sky accent.)

### 5. Single project route — `app/routes/works.$slug.tsx`

Adapted clone of `app/routes/writing.$slug.tsx`:

- **loader:** `getMdxPage({ contentDir: "projects", slug })` +
  `getContentViews({ slug, sessionId })`; `throw data(null, { status: 404 })`
  when no page. Same cache/timing headers.
- **action:** reuse `incrementViews` (`mark-as-read`) + `incrementLikes`
  (`like-post`) from `blog.server.ts` unchanged.
- **component:**
  - Back link → `/works` (the list route below makes this resolve).
  - Header: category label + `H1` title + `H4` description (new small
    `ProjectHeader`, since `BlogTitle` only takes title + one info string).
  - Banner via `BlurrableImage` (same as blog).
  - Tech pills row (`Tag`).
  - Optional inline links to `frontmatter.link` / `frontmatter.github`.
  - MDX body via `useMdxComponent`, TOC via `TableOfContents` + `useScrollSpy`.
  - `useOnRead` with injected `readingTime.time` to drive the view counter.
  - Like button (same motion button as blog).

### 6. Project header — `app/components/projects/project-header.tsx`

Small component: category overline + title + description, matching the reference
ordering.

### 7. Minimal list route — `app/routes/works._index.tsx`

So "Back to overview" resolves. Minimal but functional:

- **loader:** `getContentMdxListItems("projects", { request, timings })`.
- **component:** `HeaderSection` + grid of existing `ProjectCard` (already takes
  `ProjectFrontmatter`). No filter/pagination yet — that's a later phase.

> Note: `work._index.tsx` and `work.$slug.tsx` already `301`-redirect `/work` →
> `/works`, so legacy URLs are covered.

### 8. Sample content — `contents/projects/dimension-ai.mdx`

Frontmatter (`title`, `description`, `category`, `publishedAt`, `techs`,
`bannerCloudinaryId`, `link`, `github`) + placeholder body (a couple of `##`
headings, one image, one code block) so the page renders end-to-end — TOC,
scrollspy, views, and pills all visible before real content is written.

---

## Out of scope (later phases)

- Wiring the homepage `ProjectSection` to the loader + deleting the two
  hardcoded project arrays (`project-section.tsx`,
  `contents/projects/index.ts`).
- Filtering/pagination/tags on the `/works` list.
- Converting `techs` to `string[]` (kept as comma-string for now).

---

## File checklist

| File                                         | Action |
| -------------------------------------------- | ------ |
| `types/index.d.ts`                           | edit   |
| `app/styles/theme.css`                       | edit   |
| `app/components/ui/tag.tsx`                  | new    |
| `app/components/projects/project-header.tsx` | new    |
| `app/routes/works.$slug.tsx`                 | new    |
| `app/routes/works._index.tsx`                | new    |
| `contents/projects/dimension-ai.mdx`         | new    |

## Verification

- `npm run dev`, visit `/works` → list renders; click through →
  `/works/dimension-ai`.
- TOC tracks scroll; view counter increments after read; like button works (max
  5).
- `/work/dimension-ai` redirects to `/works/dimension-ai`.
- Tag pills render correctly in light + dark mode.
- `npm run validate` (lint + typecheck + build) passes.
