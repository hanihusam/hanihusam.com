# Content & Data

How MDX case studies are loaded, cached, and how views/likes and the database
work. See [`architecture.md`](./architecture.md) for the surrounding runtime.

## Content model

`ContentType = "projects"` — intentionally narrowed to a single literal. There
is **no blog** on this site; long-form writing lives on Substack. Generic
`<T extends ContentType>` signatures in `mdx.server.ts` have been collapsed to
concrete types. **Do not widen this back to `"blog" | "projects"`.**

Case studies are flat MDX files at `contents/projects/<slug>.mdx` (no colocated
subdirectories). Images are served via Cloudinary, referenced by
`bannerCloudinaryId` in frontmatter — not colocated.

## MDX pipeline (hybrid local-dev / GitHub-production)

Adapted from kentcdodds.com. The branch point is `useLocalContent` at the top of
`app/utils/github.server.ts`:

```ts
const useLocalContent = process.env.NODE_ENV === 'development'
```

- **Development:** `github.server.ts` reads directly from the working tree via
  `node:fs`. New or edited `.mdx` files appear immediately — no push required.
- **Production:** the same functions fall through to the GitHub API (Octokit),
  fetching by SHA.

Both `downloadMdxFileOrDirectory` and `downloadDirList` honor the flag.

Per-request flow:

1. `downloadDirList("contents/projects")` → slugs
2. `downloadMdxFileOrDirectory("projects/<slug>")` → raw `GitHubFile[]`
3. `compileMdx()` (`mdx-bundler` + Shiki/rehype) → `{ code, frontmatter }`
4. Blur URL injected from Cloudinary for `bannerCloudinaryId`
5. Result cached in `other/cache.db` via `@epic-web/cachified`

The watcher `other/refresh-on-content-change.ts` invalidates the cache when
local content files change during dev.

**Stale cache in dev.** If the works list looks empty after switching branches
or clearing content, clear the cache manually:

```sh
sqlite3 other/cache.db "DELETE FROM cache WHERE key LIKE 'projects:%'"
```

## Caching

`@epic-web/cachified` with a two-tier setup:

- An in-process `LRUCache` sits in front of a separate SQLite cache
  (`other/cache.db`) so cache writes never conflict with the main DB.
- GitHub content is cached with a TTL and invalidated via the refresh endpoint
  (`action.refresh-cache.tsx`, gated by `REFRESH_TOKEN`).

## Views & likes

Tracked in the `ContentMeta` Prisma table, keyed purely by `slug`. The
`getContentViews` / `incrementViews` / `incrementLikes` functions in
`app/utils/blog.server.ts` serve both the list and detail pages unchanged.

## Database

- **ORM:** Prisma (SQLite).
- **Databases:** main `prisma/data.db`, cache `other/cache.db`.
- **Setup:** `npm run setup` (generate → `migrate deploy` → seed). Seed data
  uses Faker (`prisma/seed.ts`).
- **New migration:** edit `prisma/schema.prisma`, then
  `npx prisma migrate dev --name <description>`.
- **Fly.io:** a single machine holds both SQLite files on the mounted volume at
  `/data`. The container boots via `start.sh` (runs `prisma migrate deploy`,
  then Express on port 8080). No LiteFS/replication — single-region, so cache
  writes go straight to local SQLite.
