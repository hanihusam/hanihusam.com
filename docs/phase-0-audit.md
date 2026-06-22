# Phase 0 Audit — Current State

_Completed: 2026-04-21_

---

## Pages Inventory

| Page       | URL         | Status |
| ---------- | ----------- | ------ |
| Home       | /           | Live   |
| Blog index | /blog       | Live   |
| Blog post  | /blog/:slug | Live   |
| Links      | /links      | Live   |
| Uses       | /uses       | Live   |

---

## Component Inventory

### Core (`app/components/`)

| Component       | File                 | Status                 | Notes                                                                     |
| --------------- | -------------------- | ---------------------- | ------------------------------------------------------------------------- |
| BlurrableImage  | blurrable-image.tsx  | Keep                   |                                                                           |
| Button          | button.tsx           | Consolidate in Phase 2 | Merge with ButtonOutline + ButtonText into single variant-based component |
| ButtonOutline   | button-outline.tsx   | Consolidate in Phase 2 |                                                                           |
| ButtonText      | button-text.tsx      | Consolidate in Phase 2 |                                                                           |
| Footer          | footer.tsx           | Keep                   |                                                                           |
| Grid            | grid.tsx             | Keep                   | Solid primitive                                                           |
| Header          | header.tsx           | Merge in Phase 2       | Overlaps with HeaderSection                                               |
| IconLink        | icon-link.tsx        | Keep                   |                                                                           |
| Icons           | icons.tsx            | Keep                   |                                                                           |
| Navbar          | navbar.tsx           | Keep                   |                                                                           |
| Spacer          | spacer.tsx           | Keep                   |                                                                           |
| TableOfContents | table-of-content.tsx | Keep                   |                                                                           |
| Typography      | typography.tsx       | Keep                   | Solid primitive                                                           |

### Layout (`app/components/layout/`)

| Component  | File            | Status | Notes |
| ---------- | --------------- | ------ | ----- |
| LayoutRoot | layout-root.tsx | Keep   |       |

### Blog (`app/components/blog/`)

| Component       | File                  | Status           | Notes                                      |
| --------------- | --------------------- | ---------------- | ------------------------------------------ |
| ArticleCard     | article-card.tsx      | Keep             |                                            |
| BlogTitle       | blog-title.tsx        | Keep             |                                            |
| CloudinaryImg   | cloudinary-img.tsx    | Keep             | MDX primitive                              |
| HeaderSection   | header-section.tsx    | Merge in Phase 2 | Overlaps with Header                       |
| Tag             | tag.tsx               | Keep             |                                            |
| ThemedBlogImage | themed-blog-image.tsx | Keep             | MDX primitive, distinct from CloudinaryImg |

### Home (`app/components/home/`)

| Component       | File                 | Status  | Notes                       |
| --------------- | -------------------- | ------- | --------------------------- |
| AboutSection    | about-section.tsx    | Keep    |                             |
| BlogSection     | blog-section.tsx     | Keep    |                             |
| CtaSection      | cta-section.tsx      | Keep    |                             |
| HeroSection     | hero-section.tsx     | Keep    |                             |
| ProjectSection  | project-section.tsx  | Deleted | Unused, replaced in Phase 4 |
| ServicesSection | services-section.tsx | Keep    |                             |

### Links (`app/components/links/`)

| Component    | File               | Status | Notes |
| ------------ | ------------------ | ------ | ----- |
| AnchorOrLink | anchor-or-link.tsx | Keep   |       |
| TOCLink      | toc-link.tsx       | Keep   |       |

### Projects (`app/components/projects/`)

| Component   | File             | Status  | Notes                       |
| ----------- | ---------------- | ------- | --------------------------- |
| ProjectCard | project-card.tsx | Deleted | Unused, replaced in Phase 4 |

---

## Token Inventory

### Current stack

- Tailwind v3 (not v4 yet — migration in Phase 2)
- Tokens defined as CSS custom properties in `app/styles/app.css`
- Consumed via `var()` in `tailwind.config.ts`

### Color tokens

| Token                 | Value   |
| --------------------- | ------- |
| --color-black         | #46434e |
| --color-white         | #ffffff |
| --color-dark          | #434343 |
| --color-light         | #f2f2f2 |
| --color-body          | #7c808b |
| --color-body-dark     | #94a3b8 |
| --color-accent        | #7a8391 |
| --color-base          | #e0e0e0 |
| --color-primary-300   | #f2bb97 |
| --color-primary-400   | #ec9e6a |
| --color-primary-500   | #e6813e |
| --color-primary-600   | #d4651b |
| --color-primary-700   | #a75016 |
| --color-secondary-300 | #7398c7 |
| --color-secondary-400 | #55749b |
| --color-secondary-500 | #45577b |
| --color-secondary-600 | #304258 |
| --color-secondary-700 | #1f2a38 |

### Token gaps (fix in Phase 2)

- No semantic layer: missing `surface`, `text`, `border`, `intent` tokens
- `prose.css` has hardcoded hex values duplicating existing tokens
- `navbar.tsx` uses raw `dark:border-gray-600` outside custom token system
- Typography plugin uses `theme('colors.gray.*')` bypassing custom color system

---

## Dependency Decisions

### Removed in Phase 0

| Package                                  | Reason                                              |
| ---------------------------------------- | --------------------------------------------------- |
| @reach/checkbox                          | Unused, replaced by @headlessui/react               |
| rehype-prism-plus                        | Unused, shiki + rehype-pretty-code already present  |
| uuid + @types/uuid                       | Unused, crypto.randomUUID() available since Node 14 |
| lodash.throttle + @types/lodash.throttle | Replaced with native throttle in useScrollSpy.tsx   |

### Deferred to Phase 5

| Package                                         | Reason                                               | Replacement                 |
| ----------------------------------------------- | ---------------------------------------------------- | --------------------------- |
| @prisma/client, prisma                          | Only used for likes + views                          | Umami handles analytics     |
| better-sqlite3                                  | Cache backend for Prisma                             | lru-cache (already in deps) |
| litefs-js                                       | Distributed SQLite on Fly, irrelevant without Prisma | —                           |
| @epic-web/remember                              | Singleton for DB connection                          | Not needed without Prisma   |
| mdx-bundler + rehype/_ + remark/_ + @octokit/\* | Blog moving to Substack                              | Evaluate at Phase 5         |

### Staying

| Package                                    | Reason                                    |
| ------------------------------------------ | ----------------------------------------- |
| @cld-apis/types + cloudinary-build-url     | Used in app/utils/images.ts               |
| @octokit/rest + @octokit/plugin-throttling | Used for GitHub MDX fetch                 |
| match-sorter                               | Used for blog filtering                   |
| framer-motion                              | Interactive animations (Motion rebranded) |
| All React Router v7 stack                  | Framework, stay                           |

---

## Gap Analysis

### Missing for Phase 2 (Design System)

- Semantic color tokens (surface/text/border/intent)
- Motion tokens (duration, easing)
- Dark mode token parity in CSS variables
- Tailwind v4 `@theme` migration

### Missing for Phase 3 (Case Study)

- Split-view component (design / code / live)
- Code block variants
- Before/after pattern component

### Missing for Phase 4 (Pages)

- Work index page + case study template
- Process page
- Resources / paid Figma landing

### Infrastructure decisions pending

- Prisma replacement confirmed (Umami for analytics, lru-cache for cache)
- Blog: Substack as primary, site shows 3-5 featured posts only
- Deployment: stay Fly or migrate CF Workers — decide before Phase 5
- Database: drop entirely after Phase 5 cleanup
