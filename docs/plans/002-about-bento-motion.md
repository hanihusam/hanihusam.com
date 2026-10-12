# Plan 002: About bento motion — review findings and the skate rework

## Status

- Reviewed: 2026-10-10, against commit `fb76262` plus the uncommitted working
  tree. Rules live in [`docs/agents/motion.md`](../agents/motion.md).
- Status: review complete, docs corrected. Batch A (skate rework) implemented on
  2026-10-11 with Hani's go-ahead and the neutral-400 light stroke. It is
  waiting on Hani's visual sign-off. The cat window from batch C was retimed the
  same day to finish with the skate (see below). Batch B done on 2026-10-11 (see
  below). The rest of C and D are not started.
- Risk: low. Every change is scoped to the About page bento, except batch B,
  which touches the shared hero pattern.

### How the review was run

- **Lenses.** Five code-review lenses (lifecycle, motion craft, performance,
  accessibility, doc accuracy).
- **Live measurement.** Playwright at 390×844, 768×1024, 1024×768, 1280×800,
  1440×900 and 1920×1080.
- **Verification.** One adversarial verifier per lens. Refuted findings are
  dropped below.
- **Skate design.** Four independent skate concepts, scored by three judges (an
  Emil-standards judge, an owner-taste judge and an engineering-risk judge).

## What moves today

As of batch A. Before it, the skate draw ran bottom-up with `scrub: 0.5`.

| Tile   | Motion                                                    | Library            |
| ------ | --------------------------------------------------------- | ------------------ |
| Skate  | Scrubbed line draw, 9 strokes, top-down, `scrub: true`    | GSAP ScrollTrigger |
| Cat    | Scrubbed peek from behind the card, lg+ only              | Motion `useScroll` |
| Height | Hover-intent grow (spring) plus idle both-arms wave (~3s) | Motion variants    |
| Others | Static on purpose (married, top 10, Hani, desk)           | —                  |

Confirmed working:

- Reduced motion builds no scroll scene. `ScrollTrigger.getAll()` returns 0 and
  the cat has no transform.
- No ScrollTrigger leaks across three client-side round trips.
- The measured scroll model matches ScrollTrigger to the pixel.
- No console errors with motion enabled.

## Verified findings

Severity is the verifier's corrected severity.

| #   | Sev    | Finding                                                                                                                                                                                                                                                                 | Batch |
| --- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 1   | high   | **Skate:** 23–36% of the route draws off-screen or under the floating nav at every viewport (worst: 36% at 1280×800). The route starts at the board, which is the last part of the photo to scroll in.                                                                  | A     |
| 2   | medium | **Skate:** the pen climbs while the page rises, so it crosses the screen at about 1.4× scroll speed. At lg only 241–305px of scroll draws anything the reader can see.                                                                                                  | A     |
| 3   | medium | **Skate:** the light-mode stroke is 1.39:1 against the tile (neutral-300 on neutral-100); dark mode is 9.58:1. In light mode the draw barely registers.                                                                                                                 | A     |
| 4   | low    | **Skate:** `scrub: 0.5` keeps drawing for about 0.4s after the hand stops (72% caught up at 100ms). The cat is 1:1, so the two scenes respond differently.                                                                                                              | A     |
| 5   | low    | **Skate:** mounting mid-window (restored scroll, back/forward) hides the trace, then it redraws itself over 0.5s with no input.                                                                                                                                         | A     |
| 6   | high   | **About hero (outside the bento):** reduced-motion users with JS see the hero stuck at `opacity:0`. Under reduce the hero passes `{}`, so nothing clears the server style.                                                                                              | B     |
| 7   | medium | **Height:** a reduced-motion hard load keeps the crouched server pose and logs a hydration mismatch (`initial` is branched on `useReducedMotion()`, which is `null` on the server).                                                                                     | B     |
| 8   | low    | **Height:** touch never triggers the grow, so phones only get the wave. This was deliberate per `useHoverIntent`, but the '180 cm tall' punchline is lost there. It's a product call.                                                                                   | C     |
| 9   | low    | **Height:** the idle wave runs on a fixed 3.05s cycle with no end while the tile is in view. That is technically WCAG 2.2.2 territory and against motion.md's loop rule.                                                                                                | C     |
| 10  | low    | **Height:** leaving the viewport mid-wave leaves the arms raised, frozen for about 3s after re-entry.                                                                                                                                                                   | C     |
| 11  | nit    | **Height:** hover-out reuses the bouncy grow spring (0.6s, bounce 0.25).                                                                                                                                                                                                | C     |
| 12  | medium | **Cat:** the range is a fixed 147px whatever the viewport size, so the whole 104px slide plays in the bottom 147px of the viewport.                                                                                                                                     | C     |
| 13  | low    | **Both scenes:** after a client-side navigation they measure while `PageTransition` is still translated, so ranges run 5–8px late. Separately, `hani-letter.png` has no `height`, so on mobile the grid shifts about 61px after measuring on a first client-side visit. | D     |
| 14  | low    | **Images:** the bento images load eagerly below the fold, and two of them total 552KB (WebP would be about 120KB).                                                                                                                                                      | D     |
| 15  | nit    | **Cat hook:** it runs scroll and resize work below lg and under reduce, where nothing animates.                                                                                                                                                                         | D     |
| 16  | nit    | **Height tile:** its hover and in-view state live at section level, so every toggle re-renders all 7 tiles.                                                                                                                                                             | D     |
| 17  | nit    | **`useHoverIntent`:** it never clears its pending timeout on unmount.                                                                                                                                                                                                   | D     |

Static-layout note for Hani, not motion: at 1024px wide the cat box overflows
the viewport by 22px, so the cat's right side is clipped.

Docs fixed in this pass:

- Briefs in `useSkateTrace.ts`, `useCatPeekReveal.ts` and `stick-figure.tsx`.
  Wrong claims: "the site's one scroll scene", the start anchor, scrub lag,
  restore replay, the cat's open risk, the re-measure claim, the reduced-motion
  pose, and "not metronomic".
- The three hero comments, which claimed SSR content stayed visible.
- The `theme.css` comment, which claimed utilities that don't exist.
- `motion.ts`: added that the JS mirrors aren't reduced-motion-safe.
- `code-style.md`: replaced ESLint with oxlint/oxfmt and added a motion pointer.
- New: `docs/agents/motion.md`, linked from `AGENTS.md` and `docs/README.md`.

## Batch A — skate rework (implemented, awaiting visual sign-off)

**Diagnosis.** The idea is right; the geometry is wrong. The reader can't feel
their scroll drawing the line, because:

- a third of the draw happens before it's on screen;
- the pen runs away upward;
- the line keeps moving after they stop;
- in light mode it's nearly invisible.

The photo is a bail: Han falls back while the board shoots out. The strokes are
the action lines of that fall.

**Proposal.** Keep the scrubbed one-pen draw, and make it run with the scroll:

1. **Reverse the route, top-down.** This is a data-only change in
   `skate-trace-paths.ts`: the `d` strings are untouched and every `from` is
   flipped. The fall now draws in the direction of gravity and of the scroll. On
   the long strokes the photo feeds up under a pen that nearly holds still, and
   every pen-lift gap stays the same.

   | New | Old | `from`  | Stroke                                     |
   | --- | --- | ------- | ------------------------------------------ |
   | 1   | 9   | `end`   | beside his raised arm (the opening flick)  |
   | 2   | 8   | `start` | over the helmet, down his back             |
   | 3   | 7   | `end`   | dot                                        |
   | 4   | 6   | `start` | down the left side                         |
   | 5   | 5   | `end`   | dot                                        |
   | 6   | 4   | `start` | under the body, left to right              |
   | 7   | 3   | `start` | above the board, right to left             |
   | 8   | 2   | `end`   | dot                                        |
   | 9   | 1   | `start` | curl around the board's nose (the landing) |

2. **Start on the first stroke, not the photo's edge.** Use
   `trigger: segments[0]` and
   `` start: `bottom bottom-=${SCROLL_STAGE_INSET}` ``.
   - `SCROLL_STAGE_INSET = 96` (`app/utils/motion.ts`) clears the floating nav
     (`navigation.tsx`, `fixed bottom-8`, about 50px tall).
   - Use px, never %: percentage anchors land inside the nav band on short
     landscape phones.
3. **End when the grid's bottom clears the nav.** First shipped as
   `` end: `bottom bottom-=${SCROLL_STAGE_INSET}` `` on the grid. It is now
   capped on the landing stroke for short viewports (see the follow-ups below).
   - The two spacers below the grid (128–160px) are taller than 96, so the next
     section is still off-screen when the draw ends.
   - This first shipped with the cat settling about 96px before the pen landed.
     Hani then had the cat retimed to finish with the skate (batch C, below).
4. **`scrub: true`** — 1:1, matching the cat. If a wheel mouse with OS smooth
   scrolling off looks stepped, use `scrub: 0.1`, never 0.2 or more. This also
   removes finding 5's self-draw.
5. **Light-mode stroke:** `--skate-trace-stroke` neutral-300 → neutral-400
   (about 2.2:1), chosen by Hani. neutral-500 (about 3.4:1) is the next step if
   it still reads faint. Dark mode is unchanged.

**Measured result (Playwright, 2026-10-11).** ScrollTrigger's start and end
match the model to the pixel at all six viewports.

| Viewport  | Runway | Line px / scroll px | Drawn unseen (was) | Next section at end |
| --------- | ------ | ------------------- | ------------------ | ------------------- |
| 390×844   | 523px  | 1.00                | 0% (23%)           | 40px below fold     |
| 768×1024  | 569px  | 1.13                | 0% (27%)           | 32px below fold     |
| 1024×768  | 342px  | 1.46                | 0% (35%)           | 64px below fold     |
| 1280×800  | 384px  | 1.67                | 0% (36%)           | 72px below fold     |
| 1440×900  | 423px  | 1.52                | 0% (35%)           | 72px below fold     |
| 1920×1080 | 435px  | 1.47                | 0% (35%)           | 64px below fold     |

- **No tail.** Dash offsets are identical at 0, 100 and 200ms after scrolling
  stops, and scrolling back un-draws from the nib within one frame.
- **The nib nearly holds still on the long downward strokes** (≤17px of vertical
  drift at 1440). The two strokes that run uphill in the art (beside the arm,
  along the board) still ride up at about 1.2–1.5× scroll speed.
- **Unchanged and still passing:** reduced motion builds no scene, with JS
  disabled the trace is fully drawn, and three client-side round trips leave
  exactly one trigger.
- **Light stroke:** 2.16:1 on the tile (was 1.39:1).
- **Wheel notches.** Headless Chromium applies a notch instantly, which draws
  about 24–30% of the route per notch. Real browsers smooth notches; confirm on
  a device.

Two follow-ups landed after this run, from the verifier:

- **End cap.** The end is now
  `min(grid bottom at the bottom stage line, landing stroke's top at the top stage line)`.
  Without it, short viewports (mostly landscape phones, on either grid) would
  draw 24–48% of the route above the screen. A first version capped on the
  landing's _bottom_, which still let the curl draw 11–20px into the top blur.
  Capping on its _top_ keeps the whole landing clear.
  - **Re-checked on the production build:** 0% under the blur at every capped
    size (the pen stays 30–50px clear), and the six viewports above are
    unchanged.
  - **Trade-off:** the cap is conservative, which costs about 15% of the runway
    on capped sizes (568×320: 214px, about 2.4px of line per px of scroll).
  - **Where it binds:** landscape phones, short md windows, and small portrait
    phones. A progress-aware cap could win the runway back, but it would depend
    on the curl's first point being its top. It isn't worth that coupling to the
    artwork.
- **Refresh on mount.** An explicit `refresh()` after building the timeline
  removes the empty frame on a mid-window reload: 0 of 814 post-hydration frames
  were empty.

**Rejected by the panel. Don't build these:**

- A wheel, rider or nib dot riding the path. It's a second moving object
  competing with the real skater, and the round linecap already reads as the
  nib.
- Speed-reactive "hot ink", speed stretch, landing squash. Each is a time-based
  clock inside a 1:1 scene, beside copy.
- Pen-lift "air" that costs scroll. Scroll that draws nothing reads as the
  coupling dropping out.
- A gravity-eased playhead. Scrubbed must stay linear.
- A triggered "bail" completion beat. It's a second clock with fragile
  re-arm/restore edge cases, and it collides with the cat's finish.
- Keeping bottom-up order and only re-anchoring. That squeezes the lg route into
  about 126–258px.
- CSS `animation-timeline`. `stroke-dashoffset` isn't composited, the scene
  needs two anchors, and Firefox support is weak.
- Smooth-scroll layers, pinning, parallax. These are scroll hijacking or already
  rejected.

**Verify.**

- Run `npm run validate`.
- At all six viewports, check that `st.start` and `st.end` match the model.
- Replay the pen tip and confirm it stays between the stage lines (clear of the
  nav and the top blur), including at 844×390, 932×430 and 667×375.
- Stop mid-stroke. With no tail, `strokeDashoffset` should read the same at 0,
  100 and 200ms.
- Reduced motion: no scene, all 9 strokes drawn.
- JS disabled: the trace is fully drawn.
- Resize across md/lg.
- Three client-side round trips: still exactly one trigger.
- Real devices: a wheel mouse at 1024×768, a trackpad, and iPhone momentum
  scrolling.

## Batch B — reduced-motion and SSR correctness (done)

**Done 2026-10-11.** Findings 6 and 7 are fixed, and the no-JS gap is closed.

- **Shared hook.** `hooks/useEntrance.ts` now builds the hero entrances (home,
  about, works). `initial` is unconditional. Under reduce, `animate` lands the
  final state with `duration: 0`. `Reveal` follows the same contract.
- **`data-entrance`.** Both mark their elements with it.
  - `no-script.css` forces it visible with JS disabled.
  - `app.css` does the same under `prefers-reduced-motion: reduce`, so reduce
    doesn't wait for the deferred (`requestIdleCallback`) hydration.
  - Normal motion still plays the hard-load entrance.
- **Height tile.** `initial` is always `rest`. Hover is the only way to `grown`,
  and it's off under reduce, so reduce holds the server pose.
- **Works grid.** Under reduce the cards drop their `exit`. The `!important` pin
  would otherwise freeze an exiting card in place for the 0.35s exit spring.
- **Rejected: a hydration-gated marker** (dropping `data-entrance` on
  hydration).
  - It showed a frame where the hero sat at opacity 0, after the marker went and
    before Motion wrote its final style.
  - It let the works cards' own spring fade them in under reduce.
- **Verified** in Playwright at 1440×900:
  - Normal motion: hard-load and client-nav entrances animate.
  - Reduced motion: zero sub-1 opacity frames, no hydration warning, and a
    static stick figure.
  - JS disabled: every `[data-entrance]` is at opacity 1 with no transform.

Original scope:

1. Hero `fadeUp` (home, about, works) and the height tile:
   - keep `initial` unconditional;
   - under reduce, set `animate` to the final state with `duration: 0`;
   - or gate on hydration with `useSyncExternalStore`, as `PageTransition` does.

   Afterwards, confirm a reduced-motion hard load shows no hydration error.

2. Content stays invisible without JS (`Reveal` and the hero entrances). Fix it
   with a hydration-gated `initial`, or with a `<noscript>` rule that forces
   `opacity: 1` and `transform: none` on marked elements.

## Batch C — height and cat polish

- Finite wave: one or two waves per entry into view, re-armed only after the
  tile leaves the viewport. Use `useInView(…, { amount: 0.5 })`.
- Split the `posing` and `waving` flags so the arms always lower (fixes 10).
- Add a non-bouncy rest transition (fixes 11).
- Touch grow, if Hani wants it: under `(hover: none)`, grow once about 300ms
  after the tile is half in view.
- **Cat window (done 2026-10-11, Hani's direction):**
  - **Start:** when the box's top clears the bottom stage line, about 60% into
    the skate draw, with the cat's head already on screen.
  - **End:** `SETTLE_AFTER_LANDING` (32px) of scroll after the pen lands. The
    cat is about 80% out at the landing: he bails, then the cat looks.
  - **Window:** a fixed ~179px at every lg size (was 147px in the bottom edge of
    the viewport).
  - **Slide start:** `BODY_START` is -88, not -104. The art has a 17px
    transparent right margin, so the first 16% of the old travel moved a cat
    nobody could see.
  - **Verified (Playwright, production, 5 lg sizes):** thresholds match the
    model to the pixel. The skate is 57–66% drawn when the cat starts; the cat
    is 82% out when the pen lands and finishes 32px later; the next section is
    still ~32px below the fold.
  - **Shared constant:** `SCROLL_STAGE_INSET` moved to `app/utils/motion.ts`.
  - **Ideas Hani raised and that were rejected:**
    - Starting when the cat reaches mid-screen: that only happens about 280px
      after the bento has ended.
    - Starting when the skate starts: the cat's box would still be 180px below
      the fold.

## Batch D — hygiene

- Use `width={186} height={67}` on `hani-letter.png`.
- Refresh both scenes once `PageTransition` settles. One shared signal, e.g. the
  cat re-measures on ScrollTrigger's `refresh`.
- Add `loading="lazy" decoding="async"` to the bento images.
- Re-encode the skate and desk photos as WebP. Check the cutout's alpha edges.
- Mount the cat's scroll work only when `active`, and skip `setRange` when
  nothing changed.
- Extract `HeightTile` and make `Tile` a plain `div`.
- Clear `useHoverIntent`'s timeout on unmount.
- Site-wide, not bento: `html { scroll-behavior: smooth }` also animates React
  Router's scroll restoration on reload (see motion.md Known gaps).
