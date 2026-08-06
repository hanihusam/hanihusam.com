import { useRef, useState } from 'react'

/**
 * Debounced hover state for one element. `whileHover` alone fires on the
 * first `pointerenter`, which reads as jittery when the cursor is just
 * passing through on its way somewhere else — a fast sweep across a row of
 * hoverable elements clips each one's hover box in turn. Requiring a short
 * dwell before committing to "active" filters that out; leaving is instant,
 * since an intentional hover collapsing the moment the pointer actually
 * leaves is the correct, expected feel.
 *
 * Returns `onHoverStart`/`onHoverEnd` rather than raw DOM listeners so it
 * drops straight into a `motion` component's own hover gesture props (the
 * same recognizer `whileHover` uses), which is what keeps touch behavior
 * unchanged.
 */
function useHoverIntent(delay: number) {
	const [active, setActive] = useState(false)
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

	const onHoverStart = () => {
		clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => setActive(true), delay)
	}
	const onHoverEnd = () => {
		clearTimeout(timeoutRef.current)
		setActive(false)
	}

	return { active, onHoverStart, onHoverEnd }
}

export { useHoverIntent }
