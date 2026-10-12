import { useSyncExternalStore } from 'react'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
	const query = window.matchMedia(REDUCED_MOTION)
	query.addEventListener('change', onChange)
	return () => query.removeEventListener('change', onChange)
}

function getSnapshot() {
	return window.matchMedia(REDUCED_MOTION).matches
}

function getServerSnapshot() {
	return false
}

/**
 * `prefers-reduced-motion: reduce`, kept live — unlike motion's
 * `useReducedMotion()`, which is read once on mount. It's false on the server
 * and during hydration, so only feed it props that never reach the markup
 * (`exit`, transitions), never `initial` or attributes.
 */
function useReducedMotionQuery() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export { useReducedMotionQuery }
