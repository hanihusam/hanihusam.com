// Single source of truth for JS-side motion timing. Values mirror the CSS
// custom properties in app/styles/theme.css — never hardcode these again.
// Unlike the CSS tokens, these are not zeroed under prefers-reduced-motion;
// callers branch on reduced motion themselves.

export const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const
export const EASE_IN_OUT_QUART = [0.77, 0, 0.175, 1] as const
export const EASE_HOVER = [0.25, 1, 0.5, 1] as const

// Seconds, matching --duration-* in theme.css (which are in ms).
export const DURATION_FAST = 0.15
export const DURATION_BASE = 0.2
export const DURATION_SLOW = 0.3
export const DURATION_SLOWER = 0.5

// Scroll scenes keep their visible motion inside a "stage": the viewport
// inset this many px from both edges. Below lg the floating nav
// (navigation.tsx, `fixed bottom-8`, ~50px tall) covers the bottom ~82px, and
// the top-blur overlay (top-blur-overlay.tsx) smears the top 96px (64px below
// `sm`, so the top inset is conservative there). Pixels, not a percentage: on
// short landscape phones a % lands inside the nav.
export const SCROLL_STAGE_INSET = 96
