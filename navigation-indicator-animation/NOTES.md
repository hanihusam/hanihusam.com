# Teaching notes

- The learner requested a course-style, learning-by-doing handoff rather than an
  agent implementation.
- The motion brief was confirmed on 2026-08-15.
- Preferred reference feel: Stripe Blog — crisp and restrained, with no bounce.
- On 2026-08-18 the learner replaced the two-background model. Inactive icons
  are dim; hover and keyboard-visible focus brighten only the icon; active route
  changes move one persistent background and then activate the icon color.
- Hover wins during the active sequence: an icon already bright from hover does
  not dim merely to replay the delayed active-color phase.
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
- Revision sync check: `origin` fetched on 2026-08-18 before authoring Lesson 2.
- Lesson 2 fresh chat quiz on 2026-08-18: 3/3 correct. The learner correctly
  predicted the delayed active icon phase, icon-only external hover, and
  immediate reduced-motion settlement.
