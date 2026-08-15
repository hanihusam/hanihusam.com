# Teaching notes

- The learner requested a course-style, learning-by-doing handoff rather than an
  agent implementation.
- The motion brief was confirmed on 2026-08-15.
- Preferred reference feel: Stripe Blog — crisp and restrained, with no bounce.
- The chosen model keeps the active route visible while a separate 55%-opacity
  layer previews hover or keyboard-visible focus.
- Fresh chat quiz on 2026-08-15: 2/3 correct. Route-derived active state and
  hidden-preview staging were answered correctly. Input precedence needs one
  retry: when pointer preview ends and keyboard-visible focus remains, preview
  falls back to the focus index rather than the active route.
- Canonical workspace: `navigation-indicator-animation/` inside `hanihusam.com`.
- Source: local project components at commit
  `c0e2f721bd7dce7360f7ce751a16efb1200f6a59`; there is no hosted ticket or PR
  source.
- Ownership: repository-local teaching material in a shared Git repository.
- Sync check: `origin/main` fetched on 2026-08-15; no existing lesson workspace
  was present.
