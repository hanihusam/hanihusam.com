# 002 — Stabilize navbar indicator drag

- **Commit:** 41a4b8d
- **Severity:** MEDIUM
- **Category:** Physicality, interruptibility & performance
- **Estimated scope:** 1 file, ~55 lines

## Problem

The indicator uses appropriate direct tracking and edge resistance, but its
visual layer is not contained. With `MAX_EDGE_OVERSHOOT = 6`, a live 390px
measurement placed the indicator 1px outside the navbar border on the left and
6px inside the Substack slot on the right. The elastic gesture consequently
looks like a geometry bug instead of resistance.

Release targeting also rounds the dragged position and then adds another whole
slot when velocity exceeds 450px/s. Distance and velocity can therefore be
counted twice, allowing a short fast drag from Home toward Projects to resolve
to About.

## Where

| File                            | Lines   | What's there                                          |
| ------------------------------- | ------- | ----------------------------------------------------- |
| `app/components/navigation.tsx` | 44–65   | Item geometry and unbounded `6px` resistance          |
| `app/components/navigation.tsx` | 140–173 | Direct tracking and release targeting                 |
| `app/components/navigation.tsx` | 203–221 | Unmasked indicator rendered with Motion `x` shorthand |

### Current code

```tsx
// app/components/navigation.tsx:143
indicatorX.set(resistIndicatorEdge(dragStartX.current + info.offset.x / scale))

// app/components/navigation.tsx:158
const currentX = clamp(indicatorX.get(), 0, MAX_INDICATOR_X)
let nextIndex = Math.round(currentX / ITEM_SIZE)

if (Math.abs(info.velocity.x) >= VELOCITY_THRESHOLD) {
	nextIndex += Math.sign(info.velocity.x)
}

// app/components/navigation.tsx:212
;<motion.span
	style={{ x: indicatorX, borderRadius: 6 }}
	className="pointer-events-none absolute inset-y-0 left-0 size-10"
/>
```

## Target

Keep the existing values:

```ts
const ITEM_SIZE = 40
const VELOCITY_THRESHOLD = 450
const EDGE_RESISTANCE = 0.15
const MAX_EDGE_OVERSHOOT = 6
```

Contain only the indicator background inside a mask matching the three-item
primary track. Do not apply overflow clipping to links or tooltip content:

```tsx
<span
	aria-hidden
	className="pointer-events-none absolute inset-0 overflow-hidden rounded-md"
>
	<motion.span
		data-navigation-indicator
		style={{ transform: indicatorTransform, borderRadius: 6 }}
		className="absolute inset-y-0 left-0 size-10 bg-(--nav-item-surface-active)"
	/>
</span>
```

Create the transform with a motion template rather than the `x` shorthand:

```tsx
const indicatorTransform = useMotionTemplate`translate3d(${indicatorX}px, 0, 0)`
```

The `6px` resisted motion remains real, but the mask makes the indicator appear
to compress against the track boundary instead of crossing it.

Resolve release once. Velocity may advance one adjacent item only when the
position itself still resolves to the active item:

```ts
const currentX = clamp(indicatorX.get(), 0, MAX_INDICATOR_X)
const positionIndex = Math.round(currentX / ITEM_SIZE)
const hasFlingVelocity = Math.abs(info.velocity.x) >= VELOCITY_THRESHOLD

const targetIndex =
	positionIndex === activeIndex && hasFlingVelocity
		? activeIndex + Math.sign(info.velocity.x)
		: positionIndex

const nextIndex = clamp(targetIndex, 0, routeLinks.length - 1)
```

Keep the existing release spring exactly:

```ts
{ type: 'spring', stiffness: 520, damping: 42, mass: 0.7 }
```

It is overdamped and appropriate for a restrained portfolio: direct tracking
during the gesture, no decorative bounce on settlement.

## Conventions to follow

- Import `useMotionTemplate` from `motion/react` alongside the existing Motion
  imports.
- Motion values must update outside React render; do not put pointer position in
  component state.
- Reuse `DURATION_BASE`, `EASE_IN_OUT_QUART`, and the existing spring rather
  than introducing parallel motion tokens.
- Preserve `touch-pan-y` so vertical page scrolling wins when appropriate.

## Steps

1. Complete plan 001 first so the primary track has an explicit boundary and
   Substack is visibly outside it.
2. Add a background-only indicator mask covering exactly the three route slots.
3. Replace `style={{ x: indicatorX }}` with a `translate3d()` motion template.
4. Replace the release calculation with the position-first, velocity-fallback
   calculation above.
5. Keep edge resistance, scale compensation, click suppression, cancellation,
   reduced-motion snapping, and the release spring unchanged.

## Out of scope

- Do not add the hold/inflation state; plan 003 owns it.
- Do not stretch, blur, refract, or morph the indicator.
- Do not add bounce to the spring.
- Do not make mouse dragging active.
- Do not change navbar scroll scaling.

## Verification

**Build**

- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes with no new warnings.
- [ ] `npm run format:check` passes.

**Behavior**

- [ ] Drag at least 120px left from Home: the transform reaches `-6px`, but no
      painted indicator crosses the primary track or navbar border.
- [ ] Drag at least 120px right from About: the transform reaches `86px`, but no
      painted indicator overlaps Substack or Theme.
- [ ] A slow drag past the midpoint selects the positional target.
- [ ] A short fling below the midpoint advances only one adjacent target.
- [ ] An explicit drag across two slots can still select the destination two
      slots away.
- [ ] Pointer cancellation returns to the active route.
- [ ] Reduced motion snaps without a spring.

**Feel**

- [ ] Record the two edge drags at 60fps and scrub frame by frame. Resistance
      should read as compression against a boundary, not disappearance or a hard
      stop.
- [ ] Test expanded and `scale(0.88)` navbar states on a real touch device.
- [ ] Redirect the gesture during settlement; the spring must retarget from the
      current position without jumping.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

If clipping the last 6px reads as accidental cropping, preserve the same input
resistance but replace the clipped portion with a small horizontal compression
in a later polish pass. Do not make that change without a real-device recording;
the simpler mask is the default.
