# Styles

CSS source files live in `app/styles/`. Tailwind CSS v4 runs through the
`@tailwindcss/vite` plugin in `vite.config.ts`.

| File            | Purpose                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| `tailwind.css`  | Tailwind entry point, theme import, typography plugin, and component styles |
| `theme.css`     | Theme tokens and light/dark values                                          |
| `app.css`       | Shared application styles                                                   |
| `fonts.css`     | Font definitions                                                            |
| `prose.css`     | MDX prose styles                                                            |
| `no-script.css` | Styles for visitors with JavaScript disabled                                |

`app/root.tsx` loads the stylesheets. Read the
[UI code conventions](agents/code-style.md) before changing components or
styles.
