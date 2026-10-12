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

| CSS token             | JS constant         | Use                                   |
| --------------------- | ------------------- | ------------------------------------- |
| `--duration-fast`     | `DURATION_FAST`     | 150ms — hover, color, press           |
| `--duration-base`     | `DURATION_BASE`     | 200ms — buttons, tooltips, routes     |
| `--duration-slow`     | `DURATION_SLOW`     | 300ms — drawers, larger elements      |
| `--duration-slower`   | `DURATION_SLOWER`   | 500ms — rare, large travel, entrances |
| `--ease-out-quart`    | `EASE_OUT_QUART`    | enter/exit (the house curve)          |
| `--ease-in-out-quart` | `EASE_IN_OUT_QUART` | movement while on screen              |
| `--ease-hover`        | `EASE_HOVER`        | hover                                 |

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
- **One literal**: `0.6` on the about hero avatar, which has no matching token.

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
   the skate brief). `Reveal` and the hero entrances currently break this rule
   (see [Known gaps](#known-gaps)). Don't copy them.
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
     state with `duration: 0`.

   - **GSAP:** build the scene inside
     `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` so it never
     exists under reduce.
   - **Hooks:** gate with `useMediaQuery` (`false` on the server). Mount the
     scroll-driven work only when the query matches, as `CatPeekBody` does with
     its `ScrubbedBody`.
   - **Decorative motion:** turn it off entirely, not "gentler".
3. **Animate `transform` and `opacity`.** The exceptions are both small SVG art:
   - `stroke-dashoffset`, for line drawing (the skate trace);
   - the stick figure's geometry attributes (`cy`, `y1`, `x2`, `y2`), six
     primitives. Paint-only and tiny.
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
- **Smooth scrolling turns on only after hydration**: `html[data-hydrated]` in
  `theme.css`, set by `Document` in `root.tsx` (so error pages get it too).
  React Router restores the scroll position on a reload before hydration, so
  that restore lands in place instead of gliding down from the top. Every other
  scroll keeps the smooth CSS.
- **ScrollTrigger and smooth scrolling.** A full ScrollTrigger refresh scrolls
  the page to 0 and back to measure. `useSkateTrace` handles three things
  ScrollTrigger gets wrong here; keep them if the skate scene moves:
  - It forces `scroll-behavior: auto` for that round trip (`refreshInit` →
    `refresh`).
  - It turns off ScrollTrigger's own smooth handling on both axes. Otherwise it
    leaves an inline `smooth` on `<html>`, based on a one-time check made before
    hydration turned smooth on.
  - It calls `ScrollTrigger.clearScrollMemory('manual')`, so refreshes stop
    resetting React Router's `history.scrollRestoration` to `'auto'`.
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
  - After a client-side navigation, the first measure runs while
    `PageTransition`'s 8px entrance still offsets the route. `PageTransition`
    fires `ROUTE_SETTLED_EVENT` (`app/utils/motion.ts`) when the entrance ends,
    and both bento scenes re-measure on it. A new scroll scene should too.
  - Give every image above a scroll scene its `width` and `height`. One that
    loads without reserved space shifts the layout after the scene has measured.

## Hover, touch, idle

- **Hover-triggered motion goes through `useHoverIntent`** (about 150ms dwell)
  when a pointer sweeping past would trigger it by accident. Leaving is instant.
- **Touch has no hover.** Anything hover-only is decoration that touch users
  never see. Either give it a touch equivalent or accept that knowingly. Gate
  CSS hover effects with `(hover: hover) and (pointer: fine)`. In JS, read it
  with `useMediaQuery` (`useSyncExternalStore`, `false` on the server) so
  hydration matches. The height tile is the worked example
  (`useHeightTileMotion`): touch devices get the grow once the figure is fully
  on stage.
- **No always-on background loops.** An idle loop must run only while its
  element is on screen, stay rare, and be off under reduced motion. Make it a
  finite run, done within 5s (WCAG 2.2.2).
  - The stick figure waves twice per pass, all within ~4s.
  - It re-arms only once the tile is fully off screen, and a hover spends it.
- **Trigger on the moving thing itself being fully on stage**, not on its
  container, which can be half visible while the art is still below the fold.
  Reset when the container is fully off screen. Nothing then plays unseen, or
  resets and replays while the reader can still see it.

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

| Scene                     | Files                                                                             |
| ------------------------- | --------------------------------------------------------------------------------- |
| Route transition          | `components/page-transition.tsx`                                                  |
| Scroll reveals            | `components/reveal.tsx`                                                           |
| Floating nav              | `components/navigation.tsx`, `hooks/useFloatingNavigationMotion.tsx`              |
| Home hero dot field       | `components/hero-dot-field.tsx`, `components/ui/dot-field.ts` (GSAP)              |
| Bento: skate line draw    | `about/skate-trace.tsx`, `about/skate-trace-paths.ts`, `hooks/useSkateTrace.ts`   |
| Bento: cat peek (lg+)     | `about/cat-peek.tsx`, `hooks/useCatPeekReveal.ts`                                 |
| Bento: height grow + wave | `about/height-tile.tsx`, `hooks/useHeightTileMotion.ts`, `about/stick-figure.tsx` |
| Works TOC                 | `works/toc-list.tsx`, `works/toc-drawer.tsx`, `.toc-enter` in `app.css`           |
| Shared hooks              | `hooks/useMediaQuery.ts`, `hooks/useHoverIntent.ts`                               |

## Known gaps

Found on 2026-10-10. Fix these before building on top of them, and remove each
entry once it's fixed.

- **Server HTML hides `Reveal` and the hero entrances.**
  - The home, about and works hero `fadeUp` entrances render Motion's `initial`
    into the server HTML as `style="opacity:0;…"`, and so does `Reveal`. There
    is no `<noscript>` override, so with JS disabled that content never appears.
  - **Reduced-motion users with JS lose the hero too.** Under reduce the hero
    passes `{}`, so nothing ever clears the server's `opacity:0`. A hard load
    leaves the about hero invisible.
  - `Reveal` recovers because it sets an explicit `animate`, but it still logs a
    hydration mismatch.
- **The home hero headline ignores reduced motion.** `#heroDisplay span`
  (`app.css`) runs `revealText` for a literal `1.3s` and has no reduced-motion
  rule.
- **Literal easing curves.** These are not tokens yet:
  - `.TooltipContent` in `tailwind.css`
  - the hero arrow icon (`home/hero-section.tsx`)
  - `#heroDisplay`
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
