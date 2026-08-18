# Mission: Build a sequenced active navigation indicator

## Why

Implement the revised navigation animation in `hanihusam.com` by hand. Learn to
coordinate persistent route state, icon-color interaction feedback, and a
sequenced active transition without making hover and active look identical.

## Success looks like

- Give inactive, hovered, focused, and active icons distinct visual roles.
- Implement a shared active background that translates between internal routes.
- Sequence the active icon color after the background arrives while allowing an
  already-hovered icon to remain bright.
- Preserve route semantics, keyboard-visible focus, and reduced-motion behavior.
- Verify the result across internal routes, the external Substack link, and the
  theme switcher.

## Constraints

- Learn by changing the existing React Router and Tailwind components, not by
  installing another animation system.
- Reuse the project's motion tokens and theme colors.
- Hover changes icon color only; it never shows or moves a button background.
- Keep the tutorial and its interactive lab usable over `file://` with no build
  step or network dependency.

## Out of scope

- Recreating Stripe's implementation exactly.
- Keeping a second traveling hover-preview background.
- Adding `clip-path`, springs, icon morphing, or navigation entrance animation.
- Implementing the production change automatically.
