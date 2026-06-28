# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

> **Writing UI code?** Read
> [`docs/code-style-guidelines.md`](docs/code-style-guidelines.md) first — it
> captures the project's component, styling, typography, and data-loading
> conventions so new code matches the existing codebase.

## Quick Start

**Node version:** >=22.22.0 (required)

**Build:** `npm run build` (builds React Router app + server + build info)

**Dev:** `npm run dev` (runs app dev server, content watcher, and server build
watcher in parallel)

**Start:** `npm run start` (runs production server with mocked data)

**Tests:**

- Unit/component: `npm run test`
- Single test file: `npm run test -- app/utils/helpers.test.ts`
- E2E dev: `npm run test:e2e:dev` (opens Cypress interactive mode)
- E2E run: `npm run test:e2e:run` (runs Cypress headless)

**Linting & formatting:**

- Lint: `npm run lint` (with cache)
- Fix lint errors: `npm run lint:fix` (includes formatting)
- Strict lint (fail on warnings): `npm run lint:strict`
- Typecheck: `npm run typecheck` (includes React Router typegen)

**Validation:** `npm run validate` (runs lint, typecheck, and build
concurrently)

**Database setup:** `npm run setup` (Prisma generate, migrate, and seed)

## Architecture

### Stack

- **Framework:** React Router 7 (full-stack with SSR)
- **Styling:** Tailwind CSS + custom CSS
- **Database:** SQLite with Prisma ORM
- **Content:** MDX files via GitHub API (fetched dynamically)
- **Deployment:** Fly.io (single machine, SQLite on a mounted volume)
- **Testing:** Vitest (unit/components) + Cypress (E2E)

### Project Structure

```
app/
  ├── routes/          # React Router file-based routes
  ├── components/      # Reusable React components
  ├── utils/           # Shared utilities (split into .ts for server, .client.ts for client)
  ├── hooks/           # Custom React hooks
  ├── styles/          # CSS files (Tailwind, fonts, prose)
  ├── assets/          # Static assets (images, icons)
  ├── entry.client.tsx # Client entry point
  ├── entry.server.tsx # Server entry point
  ├── root.tsx         # Root layout component with providers
  └── types.ts         # Global TypeScript types

server/
  ├── index.ts         # Express server configuration
  └── dev-server.js    # Development server setup

prisma/
  ├── schema.prisma    # Database schema
  ├── data.db          # SQLite database
  ├── data/            # Seed data
  └── migrations/      # Database migrations

contents/             # Blog post content (stored in repo, not used directly)
other/                # Build utilities and scripts
  ├── build-info.js   # Generates build metadata
  ├── validate         # Validation script (lint + typecheck + build)
  └── refresh-on-content-change.ts # Content watcher for hot reload
```

### Entry Points

- **Server:** `entry.server.tsx` - Handles SSR with streaming, CSP nonce
  injection, Fly.io region/app response headers
- **Client:** `entry.client.tsx` - Hydration and client-side setup
- **Root:** `app/root.tsx` - Global layout, theme provider, stylesheet
  injection, error boundaries

### Key Patterns

**Server vs Client Code:** Files with `.server.ts` or `.server.tsx` extension
are server-only and bundled separately. Use this for:

- Environment variable access
- Database queries (Prisma)
- GitHub API calls (Octokit)
- Session management

**Content Loading:** Blog content is fetched from GitHub API via
`app/utils/github.server.ts` using Octokit. Content is cached in SQLite
(`cache.db`). The `refresh-on-content-change.ts` watcher triggers cache
invalidation when content files change locally.

**Theme System:** Uses cookies and context provider
(`app/utils/theme-provider.ts`, `app/utils/theme.server.ts`) for light/dark mode
with anti-FOUC script injection.

**Type Safety:** `@/` path alias resolves to `app/` directory. Use this
consistently for imports.

**Error Handling:** Global error boundary in `root.tsx` catches route errors and
unhandled exceptions.

## Development Notes

### Environment Variables

Required server-side variables (enforced in `app/utils/env.server.ts`):

- `NODE_ENV` - Environment (development/production)
- `DATABASE_PATH` - Path to main SQLite database
- `DATABASE_URL` - Database connection URL
- `SESSION_SECRET` - Session encryption key
- `BOT_GITHUB_TOKEN` - GitHub API token for fetching content
- `REFRESH_TOKEN` - Token for cache refresh endpoint
- `CACHE_DATABASE_PATH` - Path to cache SQLite database

### Testing Setup

- **Vitest:** Configured with `happy-dom` environment in `vitest.config.ts`
- **Test setup file:** `tests/setup-test-env.ts` (initializes testing utilities)
- **Cypress:** E2E tests use Testing Library syntax with MSW mocking for APIs

### Build Process

1. `react-router build` - Builds React Router app and generates types into
   `.react-router/`
2. `esbuild` - Builds Express server for production
3. `build-info.js` - Generates build metadata (commit SHA, timestamp)

For development: Use `npm run dev` which watches all three in parallel.

### Content Management

Project/works content is MDX files in `contents/projects/` — flat files
(`<slug>.mdx`), no colocated subdirectories. Images are served via Cloudinary,
not colocated.

The MDX pipeline follows a **hybrid local-dev / GitHub-production model**
(adapted from kentcdodds.com):

- **Development** (`NODE_ENV=development`): `github.server.ts` reads directly
  from the working tree via `node:fs`. New or edited `.mdx` files appear
  immediately — no push to GitHub required.
- **Production**: same functions fall through to the GitHub API (Octokit) and
  fetch by SHA.

The branch point is the `useLocalContent` flag at the top of
`app/utils/github.server.ts`:

```ts
const useLocalContent = process.env.NODE_ENV === 'development'
```

Both `downloadMdxFileOrDirectory` and `downloadDirList` check this flag.

The full pipeline per request:

1. `downloadDirList("contents/projects")` → slugs
2. `downloadMdxFileOrDirectory("projects/<slug>")` → raw `GitHubFile[]`
3. `compileMdx()` (`mdx-bundler` + Shiki/rehype) → `{ code, frontmatter }`
4. Blur URL injected from Cloudinary for `bannerCloudinaryId`
5. Result cached in `other/cache.db` via `@epic-web/cachified`

The content watcher (`other/refresh-on-content-change.ts`) triggers cache
invalidation when local content files change during dev.

**`ContentType = "projects"`** — the type is intentionally narrowed to a single
literal. There is no blog; content has been moved to Substack. All generic
`<T extends ContentType>` signatures in `mdx.server.ts` have been collapsed to
concrete types. Do not widen this back to `"blog" | "projects"`.

**Stale cache in dev:** If the works list appears empty after switching branches
or clearing content, clear the cache manually:

```sh
sqlite3 other/cache.db "DELETE FROM cache WHERE key LIKE 'projects:%'"
```

**Views and likes** are tracked in the `ContentMeta` Prisma table, keyed purely
by `slug`. The same `getContentViews` / `incrementViews` / `incrementLikes`
functions from `app/utils/blog.server.ts` serve both the list and the detail
page unchanged.

### Database

- **ORM:** Prisma 6.3.1
- **Database:** SQLite (main: `prisma/data.db`, cache: `other/cache.db`)
- **Migrations:** Auto-applied on startup via `npm run setup`
- **Seeding:** `prisma/seed.ts` (uses Faker for test data)
- **Fly.io:** A single machine with both SQLite files (`sqlite.db`, `cache.db`)
  stored directly on the mounted volume at `/data`. The container boots via
  `start.sh` (runs `prisma migrate deploy`, then the Express server on port
  8080). No LiteFS/replication — the app is single-region, so cache writes go
  straight to the local SQLite with no primary/replica forwarding.

### Caching Strategy

Uses `@epic-web/cachified` for intelligent caching:

- GitHub content cached with TTL
- Cache invalidated via refresh endpoint (`action.refresh-cache.tsx`)
- Cache stored in a separate SQLite database (`cache.db`) to avoid conflicts
  with the main DB; an in-process `LRUCache` sits in front of it

### Performance Considerations

- SSR streaming with 5-second timeout for shell render
- Bot detection (`isbot`) uses `onAllReady` callback for search engine crawlers
- Image optimization via Cloudinary (components:
  `app/components/blog/cloudinary-img.tsx`)
- Tailwind CSS purging configured

## Common Tasks

**Adding a new route:** Create file in `app/routes/` using React Router file
conventions (e.g., `app/routes/new-page.tsx`)

**Adding a component:** Place reusable components in `app/components/` with
TypeScript type definitions

**Creating a utility:** Place in `app/utils/` and use `.server.ts` extension if
it accesses environment or database

**Modifying the database:** Update `prisma/schema.prisma`, then run
`npx prisma migrate dev --name description` to create migration

**Testing changes:** Run `npm run test` for unit tests or `npm run test:e2e:dev`
for E2E testing with Cypress

**Deploying:** Push to main branch. GitHub Actions CI runs validation, then
Fly.io auto-deploys on success
