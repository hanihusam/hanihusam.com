# 003 — Add an armed state to the navbar indicator

- **Commit:** 41a4b8d
- **Severity:** MEDIUM
- **Category:** Missed opportunity — feedback and physicality
- **Estimated scope:** 1 file, ~65 lines

## Problem

The current pointer-down handler only stores `pointerType`. The selected
indicator remains visually identical until horizontal pan begins, while the icon
alone receives `scale(0.97)` through CSS. Users can discover that the indicator
is draggable only by moving it successfully.

Instagram's interaction reads more physically because the selected pill first
enters an “armed” state under the finger, then the same object follows the drag.
This project should copy that motion grammar without copying Liquid Glass
material, refraction, jelly deformation, or a context-menu-style long press.

## Where

| File                                    | Lines   | What's there                                          |
| --------------------------------------- | ------- | ----------------------------------------------------- |
| `app/components/navigation.tsx`         | 77–82   | Indicator motion value and gesture refs               |
| `app/components/navigation.tsx`         | 122–180 | Pointer-down, pan, release, and cancellation handlers |
| `app/components/navigation.tsx`         | 212–221 | Indicator visual                                      |
| `app/components/ui/navigation-item.tsx` | 38–47   | Existing icon press feedback at `scale(0.97)`         |

### Current code

```tsx
// app/components/navigation.tsx:122
function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
	dragPointerType.current = event.pointerType
}

function handlePanStart() {
	if (
		activeIndex === -1 ||
		(dragPointerType.current !== 'touch' && dragPointerType.current !== 'pen')
	) {
		return
	}

	indicatorX.stop()
	dragStartX.current = indicatorX.get()
	dragging.current = true
	suppressClick.current = true
}
```

## Target

Use four explicit visual states:

| State                       | Indicator transform                                            | Transition                                                        |
| --------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------- |
| Resting                     | `scale(1) translateY(0)`                                       | none                                                              |
| Pointer down on active slot | `scale(1.06) translateY(-1px)`                                 | `150ms`, `cubic-bezier(0.25, 1, 0.5, 1)`                          |
| Dragging                    | Hold `scale(1.06) translateY(-1px)`; `x` tracks input directly | no spring on `x`                                                  |
| Release/cancel              | `scale(1) translateY(0)` while `x` settles                     | `150ms`, `cubic-bezier(0.25, 1, 0.5, 1)` plus existing `x` spring |

Use existing JS tokens:

```ts
import { DURATION_FAST, EASE_HOVER } from '@/utils/motion'
```

Add motion values and extend plan 002's transform template:

```tsx
const indicatorScale = useMotionValue(1)
const indicatorY = useMotionValue(0)
const indicatorTransform = useMotionTemplate`
	translate3d(${indicatorX}px, ${indicatorY}px, 0) scale(${indicatorScale})
`
```

The transform order must keep slot translation independent from scale.

On touch/pen pointer-down, calculate which route slot received the pointer from
the primary track's `getBoundingClientRect()`. Divide the rendered track width
by `routeLinks.length`; this automatically accounts for the navbar's
`scale(0.88)`. Arm only when the pointer starts in `activeIndex`.

Do not add a 500ms long-press timer. Begin the 150ms response immediately. A
quick tap reverses before full inflation; holding allows the state to complete.
Only an armed touch/pen pointer may start indicator dragging. Tapping an
inactive route remains ordinary link navigation.

Create one `settleIndicatorPresence()` helper that stops in-flight scale/y
animations and returns both values to rest. Call it from pointer-up, pan-end,
pointer-cancel, and any path that aborts the gesture.

Under `prefers-reduced-motion: reduce`, keep `indicatorScale = 1` and
`indicatorY = 0`; retain the existing color/background state indication and
immediate position snap.

## Conventions to follow

- Reuse `DURATION_FAST = 0.15` and `EASE_HOVER = [0.25, 1, 0.5, 1]` from
  `app/utils/motion.ts`.
- Reuse the existing `scale(0.97)` icon press feedback; the icon pressing inward
  while the background grows outward creates the depth cue.
- Use motion values rather than React state for animated scale/y values.
- The direct drag path must stay 1:1; never put a spring between the finger and
  `indicatorX`.

## Steps

1. Complete plans 001 and 002 first; the inflated indicator must have a reliable
   mask and an explicit primary track.
2. Add refs for whether the current pointer is armed and which slot received the
   pointer-down.
3. Add `indicatorScale` and `indicatorY` motion values and extend the full
   transform string.
4. On touch/pen pointer-down inside the active slot, animate to `scale(1.06)`
   and `y = -1` over 150ms with `EASE_HOVER`.
5. Reject pan-start when the gesture was not armed.
6. Keep the armed values fixed during direct dragging.
7. Return scale/y to rest on pointer-up, release, cancellation, route change, or
   aborted gesture.
8. Branch movement out under reduced motion.

## Out of scope

- Do not animate the entire navbar on hold.
- Do not expand the navbar from `0.88` to `1` mid-gesture; that changes gesture
  coordinates under the finger.
- Do not add haptics, audio, Liquid Glass, blur, refraction, glow, or jelly
  stretching.
- Do not activate hold/drag from Substack, Theme, mouse input, or an inactive
  route item.
- Do not swipe or preload page content interactively; navigation still commits
  on release.

## Verification

**Build**

- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes with no new warnings.
- [ ] `npm run format:check` passes.

**Behavior**

- [ ] Press and hold the active route: the indicator grows to 1.06 and lifts
      1px.
- [ ] Quick-tap the active route: feedback begins immediately and reverses
      without delaying the click.
- [ ] Press an inactive route without dragging: no armed indicator appears;
      normal navigation still works.
- [ ] Drag from the active indicator: the armed object follows the finger 1:1.
- [ ] Drag starting on an inactive route, Substack, or Theme cannot move the
      indicator.
- [ ] Cancel or begin vertical scrolling: scale and y always return to rest.
- [ ] Reduced motion produces no scale, lift, or spring movement.

**Feel**

- [ ] Record quick tap, 500ms hold, slow drag, fast flick, and cancellation at
      60fps; scrub frame by frame to ensure they read as one interruptible
      object.
- [ ] On a real phone, the 1px lift must not look like a hover effect. If it
      does, remove only the lift and retain `scale(1.06)`; do not increase
      scale.
- [ ] The 1.06 growth should be visible mainly during a hold, not loudly on
      every tap.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

The exact Instagram scale is not public and may vary by app build and iOS
version. `1.06`, `-1px`, and 150ms are restrained starting values aligned with
this repository's existing motion tokens. Real-device recording is the final
judge.
