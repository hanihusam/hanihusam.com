# Animation plans

These plans capture the floating-navbar motion work selected on 2026-08-25. They
target the motion behavior of a physical, swipeable tab bar without copying
Instagram's Liquid Glass material.

The source navbar implementation is currently uncommitted relative to commit
`41a4b8d`; each plan quotes the working-tree code it was audited against.

| Order | Plan                                                                                          | Status | Depends on | Purpose                                                                                       |
| ----- | --------------------------------------------------------------------------------------------- | ------ | ---------- | --------------------------------------------------------------------------------------------- |
| 1     | [001 — Separate navbar routes from utilities](./001-separate-navbar-routes-and-utilities.md)  | READY  | —          | Make the three-item draggable track and external utilities visually and semantically explicit |
| 2     | [002 — Stabilize navbar indicator drag](./002-stabilize-navbar-indicator-drag.md)             | READY  | 001        | Contain edge resistance, prevent velocity double-counting, and use a full transform string    |
| 3     | [003 — Add an armed state to the navbar indicator](./003-add-navbar-indicator-armed-state.md) | READY  | 001, 002   | Give the selected indicator touch-down, hold, drag, release, and cancel continuity            |
| 4     | [004 — Synchronize floating navigation state](./004-synchronize-floating-navigation-state.md) | READY  | 003        | Reset route state atomically and coordinate the work drawer with navbar scaling               |

## Execution notes

- Execute in order. Plans 002 and 003 both touch the indicator transform and
  gesture handlers; implementing them out of order creates avoidable conflicts.
- Run the verification checklist in each plan before starting the next one.
- Do not commit automatically. This repository requires explicit user approval
  before commits.
- The explicit 40px navbar size remains a settled visual decision. A 44px
  minimum touch target remains an acknowledged accessibility trade-off,
  especially when the whole navbar is transformed to `scale(0.88)`; revisit it
  only as a separate layout decision rather than quietly widening this scope.

## Deliberate differences from Instagram

- Page content does not scrub interactively with the indicator. Routes commit on
  release because React Router pages are independent SSR destinations.
- Substack is excluded from drag navigation because release must not trigger an
  unexpected cross-origin departure.
- There is no Liquid Glass, refraction, jelly deformation, glow, or haptic
  layer.
- The navbar keeps two stable scroll-scale endpoints (`1` and `0.88`) rather
  than adding continuous scroll-progress geometry.
- The hold state explains direct manipulation but does not open a long-press
  menu.
