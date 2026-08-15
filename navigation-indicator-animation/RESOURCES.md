# Navigation Indicator Animation Resources

## Knowledge

- [React Router `NavLink`](https://reactrouter.com/api/components/NavLink)
  Official reference for active-route matching, render props, nested matching,
  and automatic `aria-current="page"`. Use when deriving the persistent route
  state.
- [MDN: `transition`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition)
  Authoritative CSS reference for transitioning specific properties. Use when
  reasoning about interruption and retargeting.
- [MDN: `translate3d()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/transform-function/translate3d)
  Authoritative reference for moving an indicator without changing document
  flow. Use for the horizontal position model.
- [MDN: `:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible)
  Authoritative selector reference for showing focus feedback when the browser
  determines it should be visible. Use for keyboard-visible interaction without
  sticky pointer focus styling.
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
  Authoritative accessibility reference for reducing or replacing non-essential
  movement. Use when verifying the project's zero-duration token strategy.
- [Project motion tokens](vscode://file/Users/hanihusam/Dev/hanihusam.com/app/styles/theme.css:114)
  The local source of truth for duration and easing values. Use instead of
  inventing a parallel timing system.

## Wisdom (Communities)

- [Animations on the Web](https://animations.dev/) Practitioner-oriented motion
  design guidance. Use when judging whether an interaction is purposeful, fast
  enough, and worth animating.

## Gaps

- Stripe Blog is the visual reference, but this course does not claim knowledge
  of Stripe's private source implementation. Compare the finished feel by
  recording both interfaces rather than copying inferred internals.
