# Code Style Guidelines

Conventions distilled from the existing codebase. Follow these when adding or
changing UI so new code reads like the surrounding code.

## Components

- **One component per file, named function declaration, named export.** Default
  exports are only used where a framework needs them (route modules, a few
  layout wrappers). Prefer `export function Foo() {}` / `export { Foo }`.
- **Group by feature.** Reusable primitives live in `app/components/ui/`
  (`button`, `tag`, `filter-tag`, `logo`, …). Feature-specific compositions live
  in `app/components/<feature>/` (`home/`, `projects/`, `works/`). Cross-cutting
  layout primitives (`grid`, `spacer`, `header`, `footer`, `typography`) sit at
  the root of `app/components/`.
- **Props:** define an explicit `interface`/`type` for props. Extend native
  props with `React.ComponentProps<"div">` / `React.ComponentPropsWithRef<...>`
  when the component forwards DOM attributes. Default values go in the
  destructure (`variant = "primary"`).

## Styling

- **Tailwind utilities only**, composed with `clsxm` (from `@/utils/clsxm`) —
  never hand-concatenate class strings. Pass conditional classes as the object
  form and keep the caller-supplied `className` last so it can override.
- **Themeable colors come from CSS custom properties**, referenced with
  Tailwind's arbitrary-property syntax: `text-(--text-paragraph)`,
  `bg-(--surface-secondary)`, `border-(--border-primary)`. Tokens are declared
  in `app/styles/theme.css` (light + dark). Reach for a raw palette class
  (`text-sunset-400`) only for one-off brand accents that have no token.
- **Mobile-first responsive.** Base styles target mobile; layer `md:` and `lg:`
  for larger screens. Cards stack image-on-top on mobile and go side-by-side at
  `lg:` (`flex-col` → `lg:flex-row`, alternate with `lg:flex-row-reverse`).
- **Radii / spacing** map to tokens too (`rounded-xl`, `rounded-full`,
  `rounded-md`). Vertical rhythm between sections uses the `<Spacer size>`
  component, not ad-hoc margins.

## Typography

Use the typography components from `@/components/typography` instead of raw
heading/paragraph tags:

- `Display`, `H1`–`H4` — titles. `variant="primary"` (sky/blue) or `"secondary"`
  (sunset). Pass `as` to change the rendered tag.
- `Paragraph` — body copy (prose styles by default).
- `Text` — small text with `variant`: `lead`, `label`, `caption`, `overline`.

## Buttons & Links

From `@/components/ui/button`:

- `Button` — `<button>`; `ButtonLink` — looks like a button, renders an anchor /
  router `Link`; `LinkButton` — looks like a text link, renders a `<button>`.
- Variants: `primary` | `secondary` | `ghost`. Sizes: `sm` | `md` | `lg`. Icons
  via `iconLeft` / `iconRight` (wrapped to `size-4`).
- Internal navigation uses `to=`; external uses `href=` (both via
  `AnchorOrLink`).

## Layout

- `Grid` wraps page sections: 4 / 8 / 12 columns at sm / md / lg, `mx-8vw`
  gutters, `max-w-7xl` inner. Children span columns with `col-span-full` etc.
  Use `nested` for grids inside grids.
- Page chrome (`Navigation`) is rendered globally in `root.tsx`; routes render
  their own content and `Footer` where needed.

## Data loading (routes)

- Server-only code uses the `.server.ts(x)` suffix. Loaders return React
  Router's `data(payload, { headers })`.
- Standard cache headers for personalized-but-cacheable pages:
  `"Cache-Control": "private, max-age=3600"`, `Vary: "Cookie"`, and a
  `Server-Timing` header from `getServerTimeHeader(timings)`.
- Client-side list filtering keeps data on the client and syncs the query string
  without navigating via `useUpdateQueryStringValueWithoutNavigation`
  (`@/utils/misc`) so the loader is not re-run.

## Images

Use `getImageBuilder` + `getImgProps` (`@/utils/images`) inside `BlurrableImage`
for Cloudinary-backed responsive images with blur-up placeholders. Provide
`widths`, `sizes`, and `transformations`.

## Imports

- Use the `@/` alias for everything under `app/`.
- Import ordering follows the project ESLint config (run `npm run lint:fix`).
