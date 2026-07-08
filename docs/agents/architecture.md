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
other/             # build-info.js, validate, content watcher, og preview
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

## Performance

- SSR streaming with a 5s shell-render timeout.
- Bot detection via `isbot` (`onAllReady` for crawlers).
- Cloudinary image optimization (`app/components/blog/cloudinary-img.tsx`,
  `getImageBuilder`/`getImgProps` in `@/utils/images`).
- Tailwind purging on build.
