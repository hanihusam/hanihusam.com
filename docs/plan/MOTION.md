# Motion Revamp Brief

Build brief for Claude CLI working in `hanihusam.com`. Read `AGENTS.md` and
`docs/agents/code-style.md` first. This document does not replace them, it adds
the motion layer they are missing.

## Goal

The site is a portfolio for a design engineer whose stated edge is motion. Right
now the motion on it is competent and invisible. Competent is not the problem.
Invisible is. Nothing on the site demonstrates the one capability being sold:
scroll-driven narrative with reader-controlled timing.

This is a revamp of existing motion, not a redesign. No layout changes. No new
pages. No visual identity changes.

## Current state, verified

Do not re-audit. This was measured from the repo.

| Area                              | State                                                                                         | Action                      |
| --------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------- |
| Motion tokens in `theme.css`      | Four durations, three easing curves, re-zeroed under `prefers-reduced-motion`                 | Keep. Do not redefine.      |
| `EASE_OUT_QUART` as a JS array    | Hardcoded in 5 files, duplicating `--ease-out-quart`                                          | Fix. Single source.         |
| GSAP usage                        | Canvas pointer only (`quickTo`, `ticker`) in dot-field, reactive-dot-grid, concentric-circles | Keep. Ownership is correct. |
| Motion (`motion/react`) usage     | DOM only: `Reveal`, `PageTransition`, 4 hero sections                                         | Keep. Ownership is correct. |
| ScrollTrigger                     | Not imported anywhere                                                                         | Add, narrowly.              |
| `Reveal`                          | One variant, fade plus 24px rise, used 7 times across 3 files                                 | Extend, do not replace.     |
| Motion doctrine in `docs/agents/` | Does not exist                                                                                | Write.                      |

> [!important] The library split is already right GSAP owns canvas, Motion owns
> DOM. That is the clean separation, and no element is animated by both. Do not
> "consolidate" onto one library. Any change that has GSAP and Motion touching
> the same property on the same element is wrong.

---

## Constraints

- **No layout or copy changes.** If a motion fix requires moving an element,
  stop and flag it instead.
- **SSR safety is non-negotiable.** Content must render fully visible without
  JS. `PageTransition` already documents why the first mount is not animated.
  Every new motion follows the same rule: never ship a state where SSR output is
  `opacity: 0` and only JS reveals it.
- **`prefers-reduced-motion` is not a fallback, it is a first-class render
  path.** Every addition must be verified in both states.
- **No new dependencies.** GSAP, `@gsap/react`, and `motion` are already
  installed. ScrollTrigger ships inside `gsap`. Nothing else gets added.
- **Conventional Commits.** `oxlint` and `oxfmt` run on commit. Run
  `npm run validate` before pushing.
- Tabs, no semicolons, single quotes. Function declarations. Ternary over `&&`
  in JSX.
- One component per file, named export, `clsxm` for class composition.

---

## animations.dev skills: what to invoke and when

Order matters. Do not start with `/animate`.

| Step    | Skill                           | Purpose here                                                                                                               |
| ------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Phase 1 | `/animation-vocabulary`         | Name what each existing motion does, precisely, before changing any of it. The output becomes the doctrine doc in Phase 4. |
| Phase 2 | `/motion-brief`                 | Required before the scroll work. Properties, transform-origin, easing, duration, interruption, reduced-motion.             |
| Phase 2 | `/find-animation-opportunities` | Run inverted. The output that matters is what should stay still.                                                           |
| Phase 3 | `/animate`                      | Execution only, after the brief exists.                                                                                    |
| Phase 3 | `/css-animations`               | Prefer CSS for entrance and hover. Keep them off the JS timeline.                                                          |
| Phase 5 | `/animation-performance`        | Before device testing, not after.                                                                                          |
| Phase 5 | `/animation-accessibility`      | Reduced motion plus no infinite background loops.                                                                          |
| Phase 5 | `/review-animations`            | Final gate.                                                                                                                |

> [!warning] Where the doctrine does not apply These skills encode UI
> micro-interaction standards: sub-300ms, ease-out, do not animate what a user
> performs a hundred times a day. Correct, and it governs almost everything on
> this site. It does not govern the scroll narrative section in Phase 3, where
> duration is the point and the reader holds the clock.
>
> Expect `/review-animations` to flag the scrubbed timeline for exceeding 300ms.
> Override it there and only there. Apply it strictly to nav, buttons, theme
> toggle, filter tags, tooltips, and the TOC drawer.
>
> `/pick-ui-library` may read `package.json` and suggest consolidating. Ignore
> it. The canvas-versus-DOM split is deliberate.

---

## Phase 1 — collapse the token drift (~45m)

The smallest change with the highest leverage. Do this first because everything
after depends on there being one source of truth.

`--ease-out-quart` lives in `theme.css`. The same curve is hardcoded as
`[0.165, 0.84, 0.44, 1]` in:

- `app/components/reveal.tsx`
- `app/components/page-transition.tsx`
- `app/components/home/hero-section.tsx`
- `app/components/works/hero-section.tsx`
- `app/components/about/hero-section.tsx`

Create `app/utils/motion.ts` exporting the curves and durations as typed
constants, with a comment naming `theme.css` as the origin. Replace all five
copies. Durations currently passed as bare numbers (`0.5`, `0.2`) get named
constants too, matching the CSS token they mirror.

- [ ] One definition, five imports
- [ ] No numeric easing array left anywhere in `app/`
- [ ] `npm run validate` passes
- [ ] Visual output identical, this is a refactor with zero behavior change

---

## Phase 2 — differentiate `Reveal` (~1.5h)

`Reveal` currently does one thing: fade plus 24px rise, `once: true`,
`amount: 0.2`. It is applied to a project grid, a newsletter section, and the
works index. Three different content types, one motion.

Uniform motion across unlike content is why the site reads as tasteful rather
than authored. The fix is not more motion, it is motion that distinguishes.

Add variants to the existing component. Do not create a second component.

- A `variant` prop with a small closed set. Suggested starting point: `rise`
  (current behavior, stays the default), `stagger` (children offset by index,
  for grids), and `settle` (shorter travel, faster, for dense text blocks that
  should not float).
- `stagger` replaces the manual `delay` prop arithmetic at call sites where it
  is being used to fake a stagger.
- Every variant respects `useReducedMotion` the same way the current one does,
  by rendering the visible state immediately rather than skipping the trigger.

Then run `/find-animation-opportunities` and use the inverse list. Pick at least
one place currently wrapped in `Reveal` that should not animate at all, and
unwrap it. A grid where every cell rises is a grid where nothing is emphasized.

- [ ] Variants added, default behavior unchanged for existing call sites
- [ ] At least one `Reveal` removed on purpose, with the reason in the commit
      body
- [ ] Reduced motion verified per variant

---

## Phase 3 — one scroll narrative section (~2.5h)

The gap this whole brief exists to close. ScrollTrigger is not used anywhere on
a site whose author sells scroll-driven work.

Build exactly one. Not a site-wide scroll system.

**Where:** a single section on `works.$slug` or the home page. Pick the one with
content that has a sequence to it. If neither does, pick the home page
hero-adjacent section and keep the scene small.

**What it must demonstrate**, because these are the properties that distinguish
a real scroll build from a tutorial:

- Frame tied to scroll position via `scrub`, not `play` on enter
- Scrolling up fully reverses the scene
- Pin behavior that recalculates correctly on resize
- Complete, readable render under `prefers-reduced-motion: reduce` with zero
  movement
- No layout shift on load

**How it integrates:**

- Import ScrollTrigger from `gsap/ScrollTrigger`, register once alongside the
  existing `gsap.registerPlugin(useGSAP)` pattern already used in the dot-field
  components
- Use `useGSAP` with a `scope` ref, matching the existing convention exactly
- Client-only. Guard SSR. Server render is the final visual state, not the
  initial one
- Kill and refresh on route change. `PageTransition` remounts on pathname, so a
  ScrollTrigger created in a route component must clean up or it leaks across
  navigations

Write the `/motion-brief` output into the repo as a comment block above the
timeline. The reasoning is the portfolio artifact, not just the effect.

- [ ] Scrub reversibility verified beat by beat, not once at the end
- [ ] `ScrollTrigger.refresh()` on resize behaves
- [ ] No trigger leaks after navigating away and back
- [ ] Reduced motion path renders complete content

---

## Phase 4 — write the motion doctrine (~45m)

`AGENTS.md` sends agents to `docs/agents/code-style.md` for any UI change. That
file says nothing about motion, so every future agent invents its own timing.

Create `docs/agents/motion.md` and link it from the `AGENTS.md` reference table.

Contents, kept short enough that it is actually read:

- The token table and the rule that durations come from CSS custom properties,
  never from literals
- Library ownership: GSAP for canvas and scroll, Motion for DOM state and route
  transitions, never both on one element
- The SSR rule, stated as a hard constraint with the `PageTransition` comment as
  the worked example
- The reduced-motion rule: render the visible state, do not merely skip the
  animation
- The one documented exception: scroll narrative is exempt from sub-300ms, and
  why
- What not to animate: anything a user triggers dozens of times per session

- [ ] `docs/agents/motion.md` exists and is linked from `AGENTS.md`
- [ ] Under 150 lines

---

## Phase 5 — QA (~1h, partly manual)

Run the skills in order: `/animation-performance`, then
`/animation-accessibility`, then `/review-animations`.

Then the part that cannot be delegated:

- [ ] Open on a real phone. Tune against thumb-scroll velocity, not trackpad.
- [ ] 60fps held through the scroll section
- [ ] Reduced motion enabled at the OS level, every page walked
- [ ] JS disabled, every page renders complete
- [ ] Navigate away from the scroll section and back three times, check for
      leaks
- [ ] Theme toggled mid-scroll, canvas colors resolve without a repaint stall

---

## Acceptance criteria

- [ ] Zero hardcoded easing arrays in `app/`
- [ ] `Reveal` has variants, and at least one usage was deliberately removed
- [ ] Exactly one ScrollTrigger scene exists, fully reversible, leak-free
- [ ] `docs/agents/motion.md` exists and is referenced from `AGENTS.md`
- [ ] Every page renders complete with JS disabled
- [ ] Every page renders complete under reduced motion
- [ ] No new dependencies
- [ ] `npm run validate` passes
- [ ] No layout, copy, or visual identity changes

---

## Out of scope

Site-wide scroll system. New pages or routes. Layout changes. Design token
changes beyond motion. Widening the content type past `projects`. Page
transition exit animations, the reason they are absent is documented in
`page-transition.tsx` and the constraint still holds. Replacing either animation
library. Anything that adds hours without closing the demonstrated-capability
gap.
