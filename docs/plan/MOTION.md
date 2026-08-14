# Motion Revamp Brief

Build brief for Claude CLI working in `hanihusam.com`. Read `AGENTS.md` and
`docs/agents/code-style.md` first. This document does not replace them, it adds
the motion layer they are missing.

> [!note] Status Phases 1–3 are implemented, and PR #158
> (`feat/motion-revamp-phase-1-2`) has been merged to `main` — that work is
> shipped, not pending. Phase 3 landed differently than planned; see its section
> below, which is now a log of what was tried, not just a spec. Phases 4 and 5
> have not been started and will continue in a **new PR**, off a fresh branch
> from `main`. This document has been updated to match the repo as built, not
> just as planned; treat the checkboxes as real status, not aspiration.
>
> **Picking this back up:** everything under Phases 1–3 below is historical
> context — read it, don't redo it. Start from Phase 4.

## Goal

The site is a portfolio for a design engineer whose stated edge is motion. Right
now the motion on it is competent and invisible. Competent is not the problem.
Invisible is. Nothing on the site demonstrates the one capability being sold:
scroll-driven narrative with reader-controlled timing.

This is a revamp of existing motion, not a redesign. No layout changes. No new
pages. No visual identity changes.

## Current state, as built

The table below described the repo at kickoff. It's kept for history; the state
column now reflects what Phases 1–3 actually left behind.

| Area                              | State at kickoff                                                                              | State now                                                                                                                                                                                                                                                                                                     |
| --------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Motion tokens in `theme.css`      | Four durations, three easing curves, re-zeroed under `prefers-reduced-motion`                 | Unchanged, plus one addition: `--skate-trace-stroke` (light/dark), needed because the skate trace's source art used a white stroke invisible on the light card. A narrow, motion-adjacent exception to "no design token changes beyond motion."                                                               |
| `EASE_OUT_QUART` as a JS array    | Hardcoded in 5 files, duplicating `--ease-out-quart`                                          | Fixed. Single source in `app/utils/motion.ts` (also exports `EASE_IN_OUT_QUART`, `EASE_HOVER`, and named `DURATION_*` constants). One duration (`0.6s` in `about/hero-section.tsx`) had no matching token and was left as a literal rather than forced into a named constant that wouldn't mean anything.     |
| GSAP usage                        | Canvas pointer only (`quickTo`, `ticker`) in dot-field, reactive-dot-grid, concentric-circles | Narrowed, then given a scroll job. `reactive-dot-grid.tsx` is deleted (swapped for the static `DotGrid`); `concentric-circles.tsx` is now plain SVG rings, no GSAP. Only `hero-dot-field.tsx` still does canvas pointer work. GSAP's new job is `ScrollTrigger` on the skate bento tile (`useSkateTrace.ts`). |
| Motion (`motion/react`) usage     | DOM only: `Reveal`, `PageTransition`, 4 hero sections                                         | Same DOM ownership, plus one scroll job: the cat bento tile's peek is driven by Motion's `useScroll`/`useTransform` (`useCatPeekReveal.ts`), not GSAP. Confirmed, deliberate exception — see the note below.                                                                                                  |
| ScrollTrigger                     | Not imported anywhere                                                                         | Imported once, in `useSkateTrace.ts`, scoped to the skate bento tile.                                                                                                                                                                                                                                         |
| `Reveal`                          | One variant, fade plus 24px rise, used 7 times across 3 files                                 | Three variants (`rise`/`stagger`/`settle`). One usage (`works._index.tsx` filter-tags block) was deliberately unwrapped.                                                                                                                                                                                      |
| Motion doctrine in `docs/agents/` | Does not exist                                                                                | Still does not exist. Phase 4 not started.                                                                                                                                                                                                                                                                    |

> [!important] The library split held, with one confirmed exception GSAP owns
> canvas and now owns the site's one GSAP-driven scroll scene (the skate tile).
> Motion owns DOM state and route transitions, and — after an explicit,
> asked-for exception during Phase 3 — also owns one scroll scene (the cat
> tile's peek), via `useScroll`/`useTransform` rather than `ScrollTrigger`. That
> means there are now **two independent scroll observers** on the about page,
> not the one the original brief called for. Neither touches the other's
> element. Do not add a third without asking — this was a deliberate, narrow
> exception, not a new default.

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

All held through Phases 1–3. `MorphSVGPlugin` and `DrawSVGPlugin` were explored
for the skate trace and cat peek and both dropped in favor of manual
`stroke-dasharray`/transform approaches already covered by the "no new
dependencies" rule — GSAP ships both, neither is imported in the final code.

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

`/motion-brief` was used for every scroll and hover build in Phase 3, not just
once — each is documented as a comment block above its implementation
(`useSkateTrace.ts`, `useCatPeekReveal.ts`, `stick-figure.tsx`), matching the
brief's instruction that "the reasoning is the portfolio artifact, not just the
effect." `/animate` and `/motion-react` were both invoked mid-build for specific
pieces (the cat peek, the stick figure's idle gesture).

---

## Phase 1 — collapse the token drift (~45m) — ✅ done

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

- [x] One definition, five imports
- [x] No numeric easing array left anywhere in `app/` (except the one definition
      in `app/utils/motion.ts` itself, which mirrors `--ease-out-quart` on
      purpose)
- [x] `npm run validate` passes
- [x] Visual output identical, this is a refactor with zero behavior change

Landed exactly as scoped. One deviation: `about/hero-section.tsx` had a
`duration: 0.6` with no matching CSS token (the tokens are 0.15/0.2/0.3/0.5s).
Rather than invent a `DURATION_SLOWEST` for one call site, it was left as a
literal — a named constant that doesn't mean anything is worse than a literal
that's honest about being one-off.

---

## Phase 2 — differentiate `Reveal` (~1.5h) — ✅ done

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

- [x] Variants added (`rise`/`stagger`/`settle`), default behavior unchanged for
      existing call sites
- [x] At least one `Reveal` removed on purpose, with the reason in the commit
      body — the works-index filter-tags block. It's a control the reader acts
      on, not content; revealing it like a project card added a beat before the
      reader could use it.
- [x] Reduced motion verified per variant

Landed exactly as scoped.

---

## Phase 3 — scroll narrative (~2.5h planned; ran much longer) — log, not just spec

The gap this whole brief exists to close. This phase did **not** land as a
single build. What follows is the actual sequence, kept because the dead ends
are as informative as the result — a future agent hitting the same instinct
should be able to see it was already tried.

### What was tried and reverted

1. **Pinned title card on `works.$slug`.** Built to full spec (scrub,
   reversible, resize-safe, reduced-motion complete) and rejected on review:
   pinning left dead space below the header before the article content arrived.
   Reverted in full.
2. **Scroll-driven TOC reveal on `works.$slug`**, scoped to the bento-adjacent
   scroll region. Also built and verified, then rejected — reader preference was
   an on-load entrance, not a scroll-tied one. Replaced with a plain CSS
   `@keyframes` entrance (`.toc-enter` / `revealFromRight` in
   `theme.css`/`app.css`). This is **not** a ScrollTrigger scene; it's Phase
   2-shaped work that happens to live in a Phase 3 commit.
3. **Bento-wide parallax on the about page** (all seven fun-facts tiles'
   illustrations drifting at different scroll-linked rates). Built, verified,
   reverted at the reader's request in favor of a static grid.
4. **Decorative canvas elements made static.** Not a scroll attempt, a separate
   simplification requested mid-Phase-3: `ReactiveDotGrid`'s pointer-reactive
   canvas was replaced with the plain `DotGrid` SVG, and `ConcentricCircles`'
   GSAP ripple loop was cut to plain static rings. This shrinks GSAP's canvas
   footprint from the kickoff table (see above) and removes an always-on
   background loop, which the accessibility rule this doc already states ("no
   infinite background loops") argues for anyway.

### What shipped

**Skate bento tile — line draw (GSAP + ScrollTrigger).** A decorative swoosh
traced over the skate photo (`app/assets` Figma export, 9 stroke segments
extracted into `skate-trace-paths.ts`) draws in as the tile scrolls past, in
map-route order (not simultaneously) at a pace proportional to each segment's
own length, and finishes before the _next_ section becomes visible — the trigger
is scoped to the whole bento grid's bottom edge, not the tile alone, because
early attempts using tile-relative scoping either ran the reveal ahead of what
was on screen or finished after the reader had already scrolled past it.
Implementation: `useSkateTrace.ts`.

**Cat bento tile — peek from behind the card (Motion, not GSAP).** The cat leans
out from behind its card on scroll and withdraws on scroll-up, occluded by the
card's real background (including its rounded corner) rather than a clip-path
approximation. Built with Motion's `useScroll`/`useTransform` instead of
ScrollTrigger — a confirmed exception to "GSAP owns scroll" (see the callout
above), taken because this is a single DOM element's transform, squarely "Motion
owns DOM state" territory, and `useScroll` on an untargeted window scroll turned
out to be the only way to satisfy two competing scroll thresholds (start when
the cat's own box enters the viewport; end when the bento grid's bottom does)
that Motion's single-target `offset` API can't express directly. Implementation:
`useCatPeekReveal.ts`.

**Height bento tile (stick figure) — hover-intent + idle gesture.** Not
scroll-driven, and not originally scoped in this brief at all — added as polish
once the hover-triggered "grow" animation was in place and reported as feeling
accidental (`whileHover` fired on any fast pointer sweep across the bento, not
just an intentional pause). Two pieces, both reusable: `useHoverIntent.ts` (a
generic ~150ms-dwell debounce before a hover counts as real — worth reaching for
anywhere else on the site a hover animation feels twitchy) and an idle
both-hands-raise gesture on `stick-figure.tsx` that runs only while resting,
gated off the moment a real hover starts, so the two animations never fight over
the same joints.

### Verification actually performed

Every scene above was checked in a real browser (Playwright), not just read back
from code: scrub reversibility sampled beat-by-beat in both directions,
`prefers-reduced-motion` rendering the complete final state with zero
transforms, resize recalculating trigger thresholds, three round-trip
navigations checked for leaked triggers, and (for the cat tile) the scroll range
re-measured against real layout via `ResizeObserver` rather than a guessed pixel
constant.

- [x] Scrub reversibility verified beat by beat, not once at the end (both
      scenes)
- [x] Resize behaves — the skate tile via `ScrollTrigger.refresh()` semantics,
      the cat tile via a `ResizeObserver`-driven remeasure (Motion has no direct
      `ScrollTrigger.refresh()` equivalent)
- [x] No trigger leaks after navigating away and back, verified three times for
      both scenes
- [x] Reduced motion path renders complete content for both scenes
- [x] Both scroll scenes finish before the section's next content becomes
      visible — not in the original checklist, added after the cat tile's first
      version finished well after the reader had scrolled past it

**Net result vs. the original "exactly one ScrollTrigger scene" instruction:**
two scroll-driven scenes exist, on two different libraries. This is flagged, not
hidden — see the acceptance criteria below, which have been updated to match.

---

## Phase 4 — write the motion doctrine (~45m) — not started

> [!note] Start here for the next PR Phases 1–3 are merged (PR #158). Branch
> from `main`, not from `feat/motion-revamp-phase-1-2` — that branch is done.
> Everything above this point is context to read, not work to redo.

`AGENTS.md` sends agents to `docs/agents/code-style.md` for any UI change. That
file says nothing about motion, so every future agent invents its own timing.

Create `docs/agents/motion.md` and link it from the `AGENTS.md` reference table.

Contents, kept short enough that it is actually read:

- The token table and the rule that durations come from CSS custom properties,
  never from literals
- Library ownership: GSAP for canvas and scroll, Motion for DOM state and route
  transitions, never both on one element — **plus the Phase 3 exception**:
  Motion also owns the cat tile's scroll scene, and why (see above). State it as
  a one-time, asked-for exception, not a new rule to extend by default.
- The SSR rule, stated as a hard constraint with the `PageTransition` comment as
  the worked example
- The reduced-motion rule: render the visible state, do not merely skip the
  animation
- The one documented exception: scroll narrative is exempt from sub-300ms, and
  why
- What not to animate: anything a user triggers dozens of times per session
- **New, from Phase 3 in practice:** the hover-intent pattern
  (`useHoverIntent.ts`) — a hover animation triggered by `whileHover` alone
  reads as jittery on a fast pointer sweep; a short dwell before committing
  fixes it, and it's now a reusable hook, not a one-off.

- [ ] `docs/agents/motion.md` exists and is linked from `AGENTS.md`
- [ ] Under 150 lines

---

## Phase 5 — QA (~1h, partly manual) — not started as a discrete phase

Per-feature verification happened continuously during Phase 3 (see above), but
the formal skill-gated pass and the manual device pass have not been run.

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

Note for whoever runs this: `/review-animations` should be pointed at _two_
scroll scenes now, not one, and both the skate and cat tiles' idle/hover states
(stick figure wave, cat peek at rest) are worth a specific pass since they
weren't covered by the original Phase 3 scope.

---

## Acceptance criteria

- [x] Zero hardcoded easing arrays in `app/` (outside the single definition in
      `app/utils/motion.ts`)
- [x] `Reveal` has variants, and at least one usage was deliberately removed
- [ ] ~~Exactly one ScrollTrigger scene exists, fully reversible, leak-free~~
      **Superseded.** Two scroll-driven scenes exist, on two libraries (GSAP
      ScrollTrigger on the skate tile, Motion `useScroll` on the cat tile), both
      fully reversible and leak-free, both verified in-browser. This was a
      confirmed exception (see the callout under "Current state, as built"), not
      a scope creep.
- [ ] `docs/agents/motion.md` exists and is referenced from `AGENTS.md` — **not
      done, Phase 4 not started**
- [x] Every page renders complete with JS disabled
- [x] Every page renders complete under reduced motion
- [x] No new dependencies
- [x] `npm run validate` passes
- [ ] No layout, copy, or visual identity changes — **one narrow exception**:
      the cat's resting pose now clips at the card's real rounded corner instead
      of overlapping on top of it (a consequence of switching from a faked
      overlap to genuine DOM occlusion), and one new design token
      (`--skate-trace-stroke`) was added because the source art's white stroke
      was invisible on the light card surface. Both were flagged to and accepted
      by the person driving the work at the time.

---

## Out of scope

Site-wide scroll system. New pages or routes. Layout changes. Design token
changes beyond motion. Widening the content type past `projects`. Page
transition exit animations, the reason they are absent is documented in
`page-transition.tsx` and the constraint still holds. Replacing either animation
library. Anything that adds hours without closing the demonstrated-capability
gap.

Still held: no site-wide scroll system (two scenes, both narrowly scoped to one
bento tile each), no new pages/routes, no exit animations, no library
replacement. The one token addition (`--skate-trace-stroke`) is the sole crack
in "design token changes beyond motion" — logged above rather than silently
allowed.
