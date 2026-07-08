# AGENTS.md

Guidance for AI agents (Claude Code, Cursor, etc.) working in this repo. Keep
changes matching the surrounding code. Detailed references live in
[`docs/agents/`](./docs/agents) — read the relevant one before non-trivial work.

## Reference docs

| Doc                                                        | Read it when                                                     |
| ---------------------------------------------------------- | ---------------------------------------------------------------- |
| [`architecture.md`](./docs/agents/architecture.md)         | You need the runtime shape, entry points, routes, or env vars.   |
| [`content-and-data.md`](./docs/agents/content-and-data.md) | Touching MDX content, the GitHub pipeline, caching, or the DB.   |
| [`code-style.md`](./docs/agents/code-style.md)             | **Writing or changing any UI** — components, styling, data load. |

## Quick start

**Node:** `>=22.22.0` (required).

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Dev server + content watcher (Vite middleware) |
| `npm run build`     | Build the React Router app + build info        |
| `npm run start`     | Run the production server                      |
| `npm run setup`     | Prisma generate + migrate + seed               |
| `npm run lint`      | Lint (oxlint); `lint:fix` also formats (oxfmt) |
| `npm run typecheck` | React Router typegen + `tsc`                   |
| `npm run validate`  | Lint + typecheck + build (run before pushing)  |

There is **no automated test suite** — the prior Vitest/Cypress/MSW setup was
removed as unused. Add tooling back before writing tests.

## Conventions (essentials)

- **Stack:** React Router 7 (SSR) · Tailwind v4 · Prisma/SQLite · MDX content.
- **Server-only code** uses a `.server.ts(x)` suffix (env, Prisma, Octokit,
  sessions). `@/` aliases `app/`.
- **UI:** one component per file, named export; compose classes with `clsxm`;
  themeable colors come from CSS custom-property tokens in
  `app/styles/theme.css`. Full rules in
  [`code-style.md`](./docs/agents/code-style.md).
- **Content type is `"projects"` only** — no blog. Do not widen it. See
  [`content-and-data.md`](./docs/agents/content-and-data.md).

## Committing

- Conventional Commits (`commitlint` enforces this); `lint-staged` + Husky run
  on commit.
- Do **not** add AI attribution/co-author trailers to commit messages.
- Comment sparingly — only genuinely complex code.

## Deploying

Push to `main`. GitHub Actions runs `validate`; Fly.io auto-deploys on success.
