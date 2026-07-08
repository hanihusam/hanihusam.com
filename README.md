# hanihusam.com

My personal website — [hanihusam.com](https://hanihusam.com). A full-stack React
Router app with MDX case studies, light/dark theming, and SSR streaming.

## Tech

- **React Router 8** (full-stack, SSR + streaming)
- **Tailwind CSS v4** for styling
- **Prisma + SQLite** for views/likes and content caching
- **MDX** case studies (working tree in dev, GitHub API in production)
- **Fly.io** for hosting, **Cloudinary** for images

## Getting started

Requires **Node >=22.22.0**.

```sh
npm install
npm run setup   # Prisma generate + migrate + seed
npm run dev     # http://localhost:3000
```

Create a `.env` with the variables listed in
[`docs/agents/architecture.md`](./docs/agents/architecture.md#environment-variables)
(`SESSION_SECRET`, `BOT_GITHUB_TOKEN`, database paths, etc.).

## Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Dev server with content hot-reload |
| `npm run build`    | Production build                   |
| `npm run start`    | Run the production server          |
| `npm run validate` | Lint + typecheck + build           |

## Docs

- [`AGENTS.md`](./AGENTS.md) — guide for AI agents and contributors
- [`docs/agents/`](./docs/agents) — architecture, content pipeline, code style

## License

MIT © [Hani Husamuddin](https://hanihusam.com)
