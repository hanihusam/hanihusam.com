import { useCallback, useSyncExternalStore } from 'react'

function getServerSnapshot() {
	return false
}

/**
 * Live `matchMedia` result. The server (and so the hydration render) always
 * sees `false`; the client then re-renders with the real value, so markup
 * never mismatches. Use it for capability gates (`hover`, width, reduced
 * motion) that decide whether motion runs, never for SSR-visible output.
 */
function useMediaQuery(query: string) {
	const subscribe = useCallback(
		(onChange: () => void) => {
			const list = window.matchMedia(query)
			list.addEventListener('change', onChange)
			return () => list.removeEventListener('change', onChange)
		},
		[query],
	)
	const getSnapshot = useCallback(
		() => window.matchMedia(query).matches,
		[query],
	)

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export { useMediaQuery }
