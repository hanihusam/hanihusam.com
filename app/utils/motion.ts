// Single source of truth for JS-side motion timing. Values mirror the CSS
// custom properties in app/styles/theme.css — never hardcode these again.

export const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const
export const EASE_IN_OUT_QUART = [0.77, 0, 0.175, 1] as const
export const EASE_HOVER = [0.25, 1, 0.5, 1] as const

// Seconds, matching --duration-* in theme.css (which are in ms).
export const DURATION_FAST = 0.15
export const DURATION_BASE = 0.2
export const DURATION_SLOW = 0.3
export const DURATION_SLOWER = 0.5
