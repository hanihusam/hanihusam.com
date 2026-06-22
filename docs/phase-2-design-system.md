# Phase 2: Design System v2

_Synced with Figma: 2026-04-22_

---

## Status: What exists in Figma

| Collection          | State                                                                            |
| ------------------- | -------------------------------------------------------------------------------- |
| Primitives          | ✅ Complete — sunset, sky, neutral palettes                                      |
| Typography          | ✅ Font sizes, families, weights; ⚠️ line-heights incomplete (only tight + snug) |
| Tokens (Light/Dark) | ✅ Core tokens; fixed 4 dark mode bugs; added 4 missing tokens                   |

---

## 1. Color Palettes

### Primitive names (Figma → CSS)

| Figma name             | CSS custom property |
| ---------------------- | ------------------- |
| `color/brand/sunset/*` | `--color-sunset-*`  |
| `color/brand/sky/*`    | `--color-sky-*`     |
| `color/neutral/*`      | `--color-neutral-*` |

### Sunset palette (warm orange — primary brand)

| Step    | Hex           | Key usage                                   |
| ------- | ------------- | ------------------------------------------- |
| 50      | `#fdebde`     | Background tint                             |
| 100     | `#fbd7bd`     |                                             |
| 200     | `#f2bb97`     |                                             |
| 300     | `#ec9e6a`     |                                             |
| 400     | `#e6813e`     | Button hover (dark mode), focus ring (dark) |
| **500** | **`#d4651b`** | **Primary CTA, border/focus (light)**       |
| 600     | `#a75016`     | Button hover (light)                        |
| 700     | `#8b4212`     |                                             |
| 800     | `#72360f`     |                                             |
| 900     | `#5e2d0d`     |                                             |
| 950     | `#381a07`     |                                             |

### Sky palette (blue-slate — secondary brand, titles)

| Step    | Hex           | Key usage                                                           |
| ------- | ------------- | ------------------------------------------------------------------- |
| 50      | `#f1f5fa`     |                                                                     |
| 100     | `#d9e4f2`     | Project card gradient, surface/thumbnail                            |
| 200     | `#b3c9e5`     |                                                                     |
| 300     | `#87a5d1`     |                                                                     |
| 400     | `#7398c7`     | Link (dark mode)                                                    |
| 500     | `#55749b`     |                                                                     |
| **600** | **`#45577b`** | **text/title/primary (light), secondary button, text/link (light)** |
| 700     | `#304258`     | Secondary button hover                                              |
| 800     | `#1f2a38`     | surface/thumbnail (dark)                                            |
| 900     | `#18212d`     |                                                                     |
| 950     | `#0d1219`     |                                                                     |

### Neutral palette (warm-gray — body, borders, backgrounds)

| Step   | Hex           | Key usage                                               |
| ------ | ------------- | ------------------------------------------------------- |
| **50** | **`#ffffff`** | **surface/primary (light) — white** ⚠️                  |
| 100    | `#f2f3f2`     | surface/secondary (light)                               |
| 200    | `#e0e3e2`     | border/primary                                          |
| 300    | `#cbd1d1`     | border/default                                          |
| 400    | `#a2a8ac`     | icon/secondary (light)                                  |
| 500    | `#7a8391`     | text/caption, text/overline                             |
| 600    | `#5f6571`     | icon/secondary (dark, fixed)                            |
| 700    | `#50555f`     | text/label, border/default (dark, fixed)                |
| 800    | `#434343`     | button ghost text (light), border/primary (dark, fixed) |
| 900    | `#46434e`     | text/paragraph — slightly warm dark                     |
| 950    | `#28262d`     | surface/primary (dark)                                  |

> ⚠️ **Naming note:** `neutral/50` = `#ffffff` in Figma, which is atypical (50
> usually means near-white, not white). This is kept faithful to the Figma
> source. In CSS it maps to `--color-neutral-50: #ffffff`.

---

## 2. Semantic Token Map

### Tokens collection — Light / Dark

| Figma variable                               | CSS property               | Light                | Dark                  |
| -------------------------------------------- | -------------------------- | -------------------- | --------------------- |
| `surface/primary`                            | `--surface-primary`        | neutral/50 (#fff)    | neutral/950 (#28262d) |
| `surface/secondary`                          | `--surface-secondary`      | neutral/100          | neutral/900 _(added)_ |
| `surface/thumbnail`                          | `--surface-thumbnail`      | sky/100              | sky/800 _(fixed)_     |
| `text/title/primary`                         | `--text-title-primary`     | sky/600 (#45577b)    | neutral/100           |
| `text/title/secondary`                       | `--text-title-secondary`   | sunset/400           | sunset/400            |
| `text/paragraph`                             | `--text-paragraph`         | neutral/900          | neutral/200           |
| `text/lead`                                  | `--text-lead`              | neutral/900          | neutral/200           |
| `text/caption`                               | `--text-caption`           | neutral/500          | neutral/400           |
| `text/overline`                              | `--text-overline`          | neutral/500          | neutral/400           |
| `text/label`                                 | `--text-label`             | neutral/700          | neutral/300           |
| `text/code`                                  | `--text-code`              | neutral/800          | neutral/200           |
| `text/link`                                  | `--text-link`              | sky/600 _(added)_    | sky/400 _(added)_     |
| `text/inverse`                               | `--text-inverse`           | neutral/50 _(added)_ | neutral/950 _(added)_ |
| `border/primary`                             | `--border-primary`         | neutral/200          | neutral/800           |
| `border/default`                             | `--border-default`         | neutral/300          | neutral/700 _(fixed)_ |
| `border/focus`                               | `--border-focus`           | sunset/500 _(added)_ | sunset/400 _(added)_  |
| `icon/primary`                               | `--icon-primary`           | neutral/900          | neutral/200           |
| `icon/secondary`                             | `--icon-secondary`         | neutral/400          | neutral/600 _(fixed)_ |
| `component/button/primary/surface-default`   | `--btn-primary-bg`         | sunset/500           | sunset/500            |
| `component/button/primary/surface-hover`     | `--btn-primary-bg-hover`   | sunset/600           | sunset/400            |
| `component/button/primary/text-default`      | `--btn-primary-text`       | neutral/50           | neutral/50            |
| `component/button/secondary/surface-default` | `--btn-secondary-bg`       | sky/600              | sky/600               |
| `component/button/secondary/surface-hover`   | `--btn-secondary-bg-hover` | sky/700              | sky/500               |
| `component/button/secondary/text-default`    | `--btn-secondary-text`     | neutral/50           | neutral/50            |
| `component/button/ghost/surface-default`     | `--btn-ghost-bg`           | transparent          | transparent           |
| `component/button/ghost/surface-hover`       | `--btn-ghost-bg-hover`     | neutral/100          | neutral/800 _(fixed)_ |
| `component/button/ghost/text-default`        | `--btn-ghost-text`         | neutral/800          | neutral/50            |
| `component/button/ghost/text-hover`          | `--btn-ghost-text-hover`   | neutral/900          | neutral/200           |

**4 dark mode bugs fixed:** `border/default`, `icon/secondary`,
`button/ghost/surface-hover`, `surface/thumbnail` **4 tokens added:**
`surface/secondary`, `border/focus`, `text/link`, `text/inverse`

---

## 3. Typography

### Text styles (Figma local styles)

| Style name         | Size | Weight        | Line height          |
| ------------------ | ---- | ------------- | -------------------- |
| `desktop/title/h1` | 48px | Black (900)   | 60px                 |
| `desktop/title/h2` | 36px | Bold (700)    | 45px                 |
| `desktop/title/h3` | 30px | Bold (700)    | 37.5px               |
| `desktop/title/h4` | 24px | Medium (500)  | 37.5px               |
| `mobile/title/h1`  | 36px | Black (900)   | 45px                 |
| `mobile/title/h2`  | 30px | Bold (700)    | —                    |
| `lead`             | 18px | Medium (500)  | 25.2px               |
| `paragraph`        | 16px | Regular (400) | 20px                 |
| `label`            | 12px | Medium (500)  | 12px, tracking 0.8px |

### What's missing in Typography collection

Line-height variables only have `tight` (1.25) and `snug` (1.375). The pixel
values used in text styles (60px, 45px, 37.5px, 25.2px, 20px, 12px) are not
tokenized. Low priority — text styles cover this — but worth adding for the paid
file's developer handoff.

---

## 4. Spacing

Variables are in `spacing/*` format. Value = step × 4px (4pt grid).

**Name typos in Figma** — `spacing/,5`, `spacing/1,5`, `spacing/2,5` (comma
instead of dot). These can't be renamed programmatically (Figma rejects dots in
variable names). Leave as-is in Figma, document the mapping:

| Figma name    | Actual value | CSS property    |
| ------------- | ------------ | --------------- |
| `spacing/,5`  | 2px          | `--spacing-0-5` |
| `spacing/1,5` | 6px          | `--spacing-1-5` |
| `spacing/2,5` | 10px         | `--spacing-2-5` |

---

## 5. Border Radius

All in `border/radius-*` variables (no Light/Dark modes — same both):

| Figma                | Value | CSS                           |
| -------------------- | ----- | ----------------------------- |
| `border/radius-xs`   | 2px   | `--radius-xs`                 |
| `border/radius-sm`   | 4px   | `--radius-sm`                 |
| `border/radius-md`   | 6px   | `--radius-md` — buttons, dock |
| `border/radius-lg`   | 8px   | `--radius-lg`                 |
| `border/radius-xl`   | 12px  | `--radius-xl` — cards         |
| `border/radius-2xl`  | 16px  | `--radius-2xl`                |
| `border/radius-full` | 100px | `--radius-full`               |

---

## 6. What still needs to be done in Figma (Phase 2 remaining)

- [ ] Design dark mode — all page frames in dark. Token values estimated until
      then.
- [ ] Add missing text style variants: `paragraph/lead`, `caption`, `overline`,
      `code-inline`, `code-block`
- [ ] Mobile text styles: only h1 exists. Need h2–h4 + paragraph + label for
      mobile.
- [ ] Components not yet in Figma: Code block (inline, multiline, diff),
      Callout, Split-view shell, Tooltip
- [ ] Style guide page — specimens for all tokens + component states
- [ ] Peer review checkpoint 1

## 7. What's ready for Phase 5 (codebase)

- [x] `theme.css` — all primitive + semantic tokens, light + dark, `@theme` +
      `:root`
- [x] Token naming is 1:1 with Figma (slash → hyphen)
- [x] `motion.ts` — spring configs
- [ ] Component stubs (Button, Card, Avatar, Tag, Nav) — can start after peer
      review

---

## Decision Log

- `2026-04-22 | Semantic token naming follows Figma variable names exactly | Reduces translation errors at Phase 5`
- `2026-04-22 | neutral/50 = white, kept faithful | Renaming would require touching all existing component bindings`
- `2026-04-22 | Dark mode not shipped until designed in Figma | Estimated values are placeholder only`
- `2026-04-22 | Figma spacing names with commas can't be renamed via API | Document mapping in CSS comments instead`
