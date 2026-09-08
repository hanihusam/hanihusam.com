# 004 — Synchronize floating navigation state

- **Commit:** 41a4b8d
- **Severity:** MEDIUM
- **Category:** Cohesion, hierarchy & spatial consistency
- **Estimated scope:** 5–7 files, ~140 lines

## Problem

Navbar minimization is local state in `useMinimizedNavigation()`, so it persists
when the globally mounted navbar crosses route boundaries and cannot be shared
with the work-detail table-of-contents trigger. React Router scroll restoration
is also affected by global `scroll-behavior: smooth`. During a reproduced mobile
navigation, the pathname changed while the viewport was still around 593px; the
navbar stayed at `scale(0.88)`, interpreted programmatic restoration as upward
user scrolling, and expanded mid-route.

On work detail pages, both floating controls share `bottom: 32px`, but scrolling
changes the navbar from 46px to approximately 40.48px while the 44px drawer
trigger remains unchanged. They read as unrelated layers despite occupying one
floating-control plane.

## Where

| File                                  | Lines          | What's there                                                |
| ------------------------------------- | -------------- | ----------------------------------------------------------- |
| `app/hooks/useMinimizedNavigation.ts` | 9–87           | Local scroll state with no route dependency or shared owner |
| `app/components/navigation.tsx`       | 68–72, 190–200 | Navbar consumes local state and animates `scale(1 ↔ 0.88)`  |
| `app/components/works/toc-drawer.tsx` | 28–35          | Fixed 44px trigger with independent entrance animation      |
| `app/root.tsx`                        | 220, 252–259   | Scroll restoration and globally persistent navbar           |
| `app/styles/theme.css`                | 374–377        | Global smooth scrolling under no-preference                 |
| `app/styles/app.css`                  | 125–139        | `.toc-enter` owns `transform` during its entrance           |

### Current code

```tsx
// app/hooks/useMinimizedNavigation.ts:85
React.useEffect(() => {
	// local lastY, direction, and distance
}, [])

// app/components/navigation.tsx:193
animate={{
	scale: shouldReduceMotion || !minimized ? 1 : MINIMIZED_SCALE,
}}

// app/components/works/toc-drawer.tsx:30
<Drawer.Trigger
	className="toc-enter fixed right-8 bottom-8 ... size-11 ... lg:hidden"
>

// app/styles/theme.css:374
@media (prefers-reduced-motion: no-preference) {
	html {
		scroll-behavior: smooth;
	}
}
```

## Target

Create one shared floating-navigation motion owner above both route content and
the persistent navbar. It must expose:

```ts
type FloatingNavigationMotion = {
	minimized: boolean
	reason: 'scroll' | 'focus' | 'route'
	expand: (reason?: 'focus' | 'route') => void
}
```

The state contract is:

| Event                                       | Navbar        | Work drawer trigger   | Transition                   |
| ------------------------------------------- | ------------- | --------------------- | ---------------------------- |
| Phone scroll down after existing thresholds | `scale(0.88)` | `scale(0.88)`         | 200ms, `[0.77, 0, 0.175, 1]` |
| Phone scroll up 16px or focus               | `scale(1)`    | `scale(1)`            | 200ms, `[0.77, 0, 0.175, 1]` |
| Any pathname change                         | `scale(1)`    | `scale(1)` if mounted | 0ms before destination paint |
| Width 640px and above                       | `scale(1)`    | `scale(1)`            | no scale transition          |
| Reduced motion                              | `scale(1)`    | `scale(1)`            | no movement                  |

Keep the existing scroll thresholds exactly:

```ts
TOP_THRESHOLD = 16
MINIMIZE_SCROLL_Y = 96
MINIMIZE_DISTANCE = 32
EXPAND_DISTANCE = 16
```

On pathname change, synchronously cancel the compact transition, set expanded
state, and reset `lastY`, `direction`, and `distance`. Route reset is state
correction, not an animation. It must not depend on focus, because pointer taps,
keyboard navigation, and drag-release navigation have different focus timing.

Remove global `html { scroll-behavior: smooth; }` so React Router's cross-route
scroll restoration uses `auto`. Preserve smooth behavior only for deliberate
same-page TOC/hash navigation: explicitly call `scrollIntoView` with
`behavior: shouldReduceMotion ? 'auto' : 'smooth'` from the TOC link
interaction.

For the drawer trigger, keep `.toc-enter` on a fixed-position outer wrapper and
apply scale on a separate inner Motion element so two animations never write the
same `transform`. Use `transform-origin: 100% 100%`. Do not scale the Vaul
sheet, overlay, or drawer content.

## Conventions to follow

- Reuse `DURATION_BASE = 0.2` and `EASE_IN_OUT_QUART = [0.77, 0, 0.175, 1]` from
  `app/utils/motion.ts`.
- Keep the media boundary `(max-width: 639px)` aligned with the project's `md`
  breakpoint.
- Use one passive scroll listener and one rAF throttle; do not mount a second
  independent listener in `WorkTocDrawer`.
- Follow the provider/hook patterns already used by the application rather than
  introducing an external state library.

## Steps

1. Move the current minimization state machine into a shared provider/context
   mounted in `app/root.tsx` above `PageTransition` and `Navigation`.
2. Preserve the existing phone media query, thresholds, passive listener, and
   rAF batching.
3. Add route-aware reset keyed by `pathname`; reset motion and scroll
   accumulators before the destination paints.
4. Expose one hook consumed by `Navigation` and `WorkTocDrawer`.
5. Make route-reset transitions 0ms while retaining 200ms scroll/focus
   transitions.
6. Wrap the drawer trigger so `.toc-enter` and scroll scale operate on separate
   elements; scale only on phones and use bottom-right origin.
7. Remove global smooth scrolling from `theme.css`.
8. Preserve smooth no-preference behavior for same-page TOC navigation with an
   explicit, reduced-motion-aware `scrollIntoView` call.
9. Ensure plan 003's armed indicator state always settles on pathname change.

## Out of scope

- Do not collapse the navbar to one item.
- Do not introduce continuous scroll-progress scaling; retain the existing
  hysteresis thresholds and two stable endpoints.
- Do not scale the drawer sheet, overlay, or desktop TOC aside.
- Do not alter PageTransition timing or direction.
- Do not add Liquid Glass material or blur.
- Do not preserve compact navbar state across browser history entries; route
  changes reveal navigation, and the next intentional scroll decides its state.

## Verification

**Build**

- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes with no new warnings.
- [ ] `npm run format:check` passes.
- [ ] `npm run build` passes.

**Behavior**

- [ ] On a 390px viewport, scroll down until compact, then navigate by tap: the
      destination's first painted navbar frame is `scale(1)`.
- [ ] Repeat using indicator drag release: behavior is identical to tap.
- [ ] Cross-route scroll restoration reaches the destination immediately rather
      than smoothly moving through the destination page.
- [ ] Browser Back restores position without a navbar scale tween; navbar starts
      expanded and responds to the next intentional scroll.
- [ ] On a work detail page, navbar and drawer trigger enter/leave compact state
      from one shared signal and retain the same bottom edge.
- [ ] At 640–1023px, the drawer remains visible but neither control scales.
- [ ] At 1024px and above, the drawer trigger is absent.
- [ ] TOC hash navigation remains smooth under no-preference and instant under
      reduced motion.

**Feel**

- [ ] Record scroll-down, scroll-up, tap navigation, drag navigation, browser
      Back, and TOC jump at 60fps. Scrub frame by frame for state changes that
      begin after the destination appears.
- [ ] Test on a real phone; synthetic scrolling does not reproduce momentum and
      browser chrome interaction accurately.
- [ ] The drawer and navbar should feel related without appearing mechanically
      mirrored; their shared bottom anchor is the cohesion cue.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Instagram owns the whole native navigation stack and can coordinate scroll,
content, tab selection, and platform material internally. This plan deliberately
coordinates only the floating controls and route reset. Interactive page swiping
would be a separate routing architecture project, not motion polish.
