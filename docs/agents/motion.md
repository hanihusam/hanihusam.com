# Motion

Read this before adding, changing, or removing any animation. It is the motion
layer `code-style.md` does not cover. The site belongs to a design engineer
whose edge is motion, so motion here is authored on purpose. Keep it rare,
reasoned, and documented.

## Tokens

Durations and easing come from CSS custom properties in `app/styles/theme.css`.
`app/utils/motion.ts` mirrors them for JS. Don't add new easing arrays,
cubic-beziers, or UI durations as literals. The ones that already exist are
listed under [Known gaps](#known-gaps).

| CSS token             | JS constant         | Use                                               |
| --------------------- | ------------------- | ------------------------------------------------- |
| `--duration-fast`     | `DURATION_FAST`     | 150ms — hover, color, press                       |
| `--duration-base`     | `DURATION_BASE`     | 200ms — buttons, tooltips, routes                 |
| `--duration-slow`     | `DURATION_SLOW`     | 300ms — drawers, larger elements                  |
| `--duration-slower`   | `DURATION_SLOWER`   | 500ms — rare, large travel, entrances             |
| `--ease-out-quart`    | `EASE_OUT_QUART`    | enter/exit (the house curve)                      |
| `--ease-out-expo`     | —                   | sharp enter, long settle: hero headline, tooltips |
| `--ease-in-out-quart` | `EASE_IN_OUT_QUART` | movement while on screen                          |
| `--ease-hover`        | `EASE_HOVER`        | hover                                             |

The duration tokens drop to `0ms` under `prefers-reduced-motion: reduce`, so CSS
built on them is reduced-motion-safe for free. JS durations are not. JS has to
branch on its own (see below).

In Tailwind, the `--ease-*` tokens are real utilities (`ease-out-quart`).
`--duration-*` is not a Tailwind namespace, so write
`duration-(--duration-base)`.

Exempt from the token rule:

- **Springs** (`{ type: 'spring', duration, bounce }`), which settle on their
  own parameters.
- **Scrubbed scroll scenes**, where scroll position is the clock.
- **Two literals**, neither of which matches a token:
  - `0.6` on the about hero avatar.
  - `1.3s` per letter, with its `0.25s` lead-in and `0.03s` stagger, on the home
    headline reveal (`#heroDisplay span`), the one signature entrance allowed
    past the UI duration scale.

## Who owns what

| Layer                   | Owns                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| CSS                     | Hover/focus (`.underlined` wipe), theme toggle, tooltip, `.toc-enter`, hero text `revealText` |
| Motion (`motion/react`) | DOM state, `PageTransition`, `Reveal`, hero entrances, floating nav, TOC, stick figure        |
| GSAP                    | Canvas pointer work (`hero-dot-field.tsx`) and the skate tile's ScrollTrigger scene           |
| Motion, as an exception | The cat tile's scroll peek (`useScroll`); see below                                           |

Use CSS when the motion is predetermined: entrance, hover, keyframes. Use Motion
when it reacts to state or gestures. Never drive one element from two libraries.

There are exactly two scroll-driven scenes: the skate tile (GSAP) and the cat
tile (Motion). The cat tile being on Motion was a deliberate, one-time owner
exception, not a pattern. Ask before adding a third scroll observer.

## Hard rules

1. **SSR output is fully visible.** Never ship server HTML where content sits at
   `opacity: 0` and only JS reveals it. Worked example: `PageTransition` skips
   its first mount with a `useSyncExternalStore` hydration check. The bento
   scroll scenes follow the same rule: the server ships the skate trace fully
   drawn and the cat fully out, and JS adds the hidden starting state only after
   mount, below the fold at common sizes. On viewports taller than ~1230px, or
   on a mount with restored scroll, the trace can visibly change on mount (see
   the skate brief).
   - **Exception: mount entrances that must play on a hard load** (the heroes,
     `Reveal`). These ship Motion's hidden `initial` and carry `data-entrance`.
     CSS forces `[data-entrance]` visible with JS disabled (`no-script.css`) and
     under reduced motion (`app.css`), so neither case waits on JS.
   - Build new mount entrances with `useEntrance` (`enter()` / `fadeUp()`).
     Don't hand-roll the `initial`/`animate` pair.
2. **Reduced motion is a render path, not a disabled animation.** Render the
   finished, visible state:
   - **CSS:** tokens or a `prefers-reduced-motion: reduce` block. Watch for
     delays: `.toc-enter` drops its animation outright because a delay alone
     would hold the element at opacity 0.
   - **Motion:** branch on `useReducedMotion()`, with two traps:
     - It returns `null` on the server and is read once on the client, so it
       doesn't update if the preference changes mid-visit.
     - Never pick SSR-affecting props (`initial`, attribute values) from it. The
       server and a reduced-motion client then render different markup, and
       React 19 does not patch the mismatch.

     Keep `initial` unconditional. Under reduce, set `animate` to the final
     state with `duration: 0`. `useEntrance` and `Reveal` already do this. Under
     reduce, `[data-entrance]` is pinned visible with `!important`, which
     freezes any opacity/transform `exit` on it. Drop the exit under reduce, as
     the works grid does.

   - **GSAP:** build the scene inside
     `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` so it never
     exists under reduce.
   - **Hooks:** gate on `matchMedia` in an effect, as `useCatPeekReveal` does.
   - **Decorative motion:** turn it off entirely, not "gentler".
3. **Animate `transform` and `opacity`.** The single exception is SVG
   `stroke-dashoffset`, for line drawing on a small element.
4. **No new animation dependencies.** Plugins that ship inside the installed
   `gsap` package are allowed.
5. **No exit animations on route change.** The reason is in
   `page-transition.tsx`: React Router 7 pulls `loaderData` away from the
   outgoing route.

## Scroll

- Decide first whether it is a **triggered reveal** (crossing a threshold starts
  a timed animation) or **scrubbed** (scroll position is the clock). Tuning
  cannot fix the wrong choice.
- **Triggered reveals play once.** Use `Reveal` (`rise` / `stagger` / `settle`)
  rather than a new wrapper. Don't reveal controls the reader acts on; the works
  filter tags were unwrapped for this reason.
- **Scrubbed scenes use `linear` easing**, are fully reversible, and are exempt
  from the sub-300ms rule because the reader holds the clock.
- **Scrubbed scenes map scroll 1:1.** Use `scrub: true` or raw `useScroll`. Any
  smoothing shows as the line still moving after the hand stops, so 0.1 is the
  ceiling.
- **Start a scrubbed scene on its first visible pixel**, not on its container's
  edge. Draw in the direction the reader scrolls, so content arrives under the
  motion instead of after it.
- **Draw inside the stage.** The viewport has fixed chrome at both edges:
  - the floating nav covers the bottom ~82px (it overlaps the photo below lg);
  - the top-blur overlay smears the top 96px.

  The skate draw keeps its pen between both with `SCROLL_STAGE_INSET` (96px).
  Use px, never a percentage: on short landscape phones a percentage lands
  inside the nav.

- **A scene must finish while its section is still what's on screen.**
  - The skate draw ends when the grid's bottom clears the nav (the stage line).
  - The cat (lg+) starts when its box clears the same stage line, at about 60%
    through the draw. It ends `SETTLE_AFTER_LANDING` (32px) of scroll after the
    pen lands: he bails, then the cat leans out to look.
  - Both hooks read `SCROLL_STAGE_INSET` from `app/utils/motion.ts`.
  - On short viewports (mostly landscape phones) the skate draw ends sooner,
    capped so the landing stroke stays below the top blur.
  - The spacers below the bento are taller than the inset plus the cat's lag, so
    the next section is still off-screen when the cat finishes (~32px to spare
    at lg).
- **Measure ranges from real layout** and re-measure on resize
  (`ResizeObserver`, ScrollTrigger refresh). Never guess pixel offsets.
  - Neither scene re-measures after a client-side navigation. They measure while
    `PageTransition`'s 8px entrance is still running.
  - Images without a reserved height shift the grid after the scenes have
    measured.

## Hover, touch, idle

- **Hover-triggered motion goes through `useHoverIntent`** (about 150ms dwell)
  when a pointer sweeping past would trigger it by accident. Leaving is instant.
- **Touch has no hover.** Anything hover-only is decoration that touch users
  never see. Either give it a touch equivalent or accept that knowingly. Gate
  CSS hover effects with `(hover: hover) and (pointer: fine)`.
- **No always-on background loops.** An idle loop must run only while its
  element is on screen (`useInView`), stay rare, and be off under reduced
  motion. Prefer a finite run: a few waves per entry into view, done within 5s
  (WCAG 2.2.2). The stick figure doesn't meet this yet: it waves on a fixed ~3s
  cycle for as long as the tile is in view.

## What stays still

Every candidate for motion should first be checked against this list:

- **Anything triggered dozens of times a session.** Keep it instant or near
  instant.
- **The four static bento tiles** (married, top 10, Hani, desk). Three moving
  tiles out of seven keeps the motion pointing at something.
- **Built, then rejected by the owner.** Don't rebuild these:
  - bento-wide scroll parallax
  - a pinned title card on works pages
  - a scroll-tied TOC reveal
  - pointer-reactive dot grids and the concentric-circle ripple loop

## Where motion lives

| Scene                     | Files                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------- |
| Route transition          | `components/page-transition.tsx`                                                   |
| Hero entrances            | `hooks/useEntrance.ts`, `{home,about,works}/hero-section.tsx`                      |
| Scroll reveals            | `components/reveal.tsx`                                                            |
| Floating nav              | `components/navigation.tsx`, `hooks/useFloatingNavigationMotion.tsx`               |
| Home hero dot field       | `components/hero-dot-field.tsx`, `components/ui/dot-field.ts` (GSAP)               |
| Bento: skate line draw    | `about/skate-trace.tsx`, `about/skate-trace-paths.ts`, `hooks/useSkateTrace.ts`    |
| Bento: cat peek (lg+)     | `about/cat-peek.tsx`, `hooks/useCatPeekReveal.ts`                                  |
| Bento: height grow + idle | `about/stick-figure.tsx`, `hooks/useHoverIntent.ts`, `about/fun-facts-section.tsx` |
| Works TOC                 | `works/toc-list.tsx`, `works/toc-drawer.tsx`, `.toc-enter` in `app.css`            |

## Known gaps

Found on 2026-10-10; a full timing sweep on 2026-10-11 added the rest. Fix these
before building on top of them, and remove each entry once it's fixed.

- **Three places ignore reduced motion.**
  - **Works TOC drawer.** Vaul (`works/toc-drawer.tsx`) injects its own CSS. The
    sheet slides its full height, and the overlay fades, on a literal `0.5s`
    `cubic-bezier(.32, .72, 0, 1)`. Vaul 1.1.2 has no reduced-motion handling.
    Override both with the tokens. Vaul's rules are unlayered and load last, so
    the override needs higher specificity than `[data-vaul-drawer]` /
    `[data-vaul-overlay]`.
  - **Hard-load view transitions.** `@view-transition` (`theme.css`) runs the
    browser's default `0.25s` crossfade, and browsers don't skip it under
    reduce. Gate it on `no-preference`.
  - **Case-study videos.** `blog/cloudinary-video.tsx` sets `autoPlay loop`
    unconditionally. The controls satisfy WCAG 2.2.2, but rule 2 wants
    decorative motion off, so drop autoplay under reduce.
- **Tailwind's default transition timing isn't overridden.** A bare
  `transition`, `transition-colors` or `transition-opacity` with no `ease-*` or
  `duration-(--…)` class falls back to Tailwind's `150ms`
  `cubic-bezier(.4, 0, .2, 1)`, which reduced motion doesn't zero. That covers
  about ten colour hovers and the image fades in `blurrable-image.tsx`. Point
  `--default-transition-duration` and `--default-transition-timing-function` in
  `@theme` at the tokens.
- **Off-token curves.** These durations are tokens; the curves aren't:
  - `ease` on the underline wipes (`.underlined` in `app.css`, headings in
    `prose.css`)
  - Tailwind's `ease-in-out` on the Substack image hover
    (`writing/article-card.tsx`)
  - a bare `ease` class, which generates nothing in Tailwind v4:
    `projects/project-card.tsx` (both banners), `ui/theme-switcher.tsx` (hover
    fill)
  - no ease class: `top-blur-overlay.tsx`, `ui/filter-tag.tsx`
  - the legacy `button.tsx` (`/links` only): no `transition-*` class, so it gets
    `transition: all` on the browser's `ease`
  - `duration: 0.35, ease: 'power3'` on the dot-field pointer follow
    (`hero-dot-field.tsx`). `power3` is GSAP's ease-out quart, so give it a name
    in `motion.ts`.
- **Literal delays.** All are reduce-safe; none are tokens:
  - `fadeUp(0.1)` / `fadeUp(0.18)` in all three heroes
  - `STAGGER_STEP = 0.08` (`reveal.tsx`), copied as `idx * 0.08` in
    `works._index.tsx`. Both stagger stacked full-width cards that each reveal
    on their own, so lower cards wait after scrolling in.
  - `.toc-enter`'s `200ms` (`app.css`), which is `--duration-base`
- **Two keyframes named `fadeOut`.** Vaul injects an unlayered
  `@keyframes fadeOut`, which beats the tooltip's layered one in `tailwind.css`.
  After a works page loads, the tooltip exit loses its 2px drift. Rename the
  tooltip's keyframe.
- **Reloads replay the scroll restore as a smooth scroll.** `html` has
  `scroll-behavior: smooth`, which also animates React Router's
  `<ScrollRestoration>`. On short viewports a mid-page reload visibly scrolls
  down from the top. Scope smooth scrolling to in-page anchors, or restore with
  `behavior: 'instant'`.
- **About bento.** The verified review, the skate rework, and the fix batches
  are in [plan 002](../plans/002-about-bento-motion.md).

## Working on motion

1. **Write the brief before the code.** Use the `motion-brief` skill. The brief
   lives as a comment block above the implementation:
   - Verdict, Trigger, Frequency, Purpose
   - Enter, Exit, Origin, Easing, Duration, Interrupt
   - Reduced motion, SSR, Stack, Open risk

   `useSkateTrace.ts` is the model. Update the brief whenever the behavior
   changes.

2. **Use the animations.dev skills** in this order: `motion-brief` → `animate` /
   `scroll-animations` / `css-animations` → `animation-performance` →
   `animation-accessibility` → `review-animations`. Emil's sub-300ms guidance
   governs UI. It does not govern scrubbed scenes.
3. **Verify in a real browser**, not just by reading code:
   - scrub forward and back at several points
   - reduced motion emulated
   - JS disabled
   - resize
   - navigate away and back three times (no leaked triggers)
   - mobile width with a touch pointer

The original motion brief (phases 1–3, including the dead ends) is in git
history: `git show fb76262:docs/plans/MOTION.md`. It is history, not a source of
truth: a few details (asset provenance, which files carry briefs) are stale.
