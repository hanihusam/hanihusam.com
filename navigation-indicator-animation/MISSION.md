# Mission: Build a two-layer navigation indicator

## Why

Implement the confirmed navigation animation in `hanihusam.com` by hand, while
understanding why persistent route state and temporary interaction previews need
separate visual layers.

## Success looks like

- Explain the difference between `activeIndex` and `previewIndex` without
  referring to the finished code.
- Implement an interruptible active indicator and hover/focus preview using
  React state and CSS transitions.
- Preserve route semantics, keyboard-visible focus, and reduced-motion behavior.
- Verify the result across internal routes, the external Substack link, and the
  theme switcher.

## Constraints

- Learn by changing the existing React Router and Tailwind components, not by
  installing another animation system.
- Reuse the project's motion tokens and theme colors.
- Keep the tutorial and its interactive lab usable over `file://` with no build
  step or network dependency.

## Out of scope

- Recreating Stripe's implementation exactly.
- Adding `clip-path`, springs, icon morphing, or navigation entrance animation.
- Implementing the production change automatically.
