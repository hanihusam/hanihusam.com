import { useIsomorphicLayoutEffect } from '@/utils/helpers'

import { useReducedMotion } from 'motion/react'
import * as React from 'react'
import { useLocation } from 'react-router'

const MOBILE_QUERY = '(max-width: 639px)'
const TOP_THRESHOLD = 16
const MINIMIZE_SCROLL_Y = 96
const MINIMIZE_DISTANCE = 32
const EXPAND_DISTANCE = 16

type FloatingNavigationMotionReason =
	| 'scroll'
	| 'focus'
	| 'interaction'
	| 'route'

type FloatingNavigationMotion = {
	minimized: boolean
	reason: FloatingNavigationMotionReason
	expand: (reason?: Exclude<FloatingNavigationMotionReason, 'scroll'>) => void
}

const FloatingNavigationMotionContext =
	React.createContext<FloatingNavigationMotion | null>(null)

type FloatingNavigationMotionProviderProps = {
	children: React.ReactNode
}

function FloatingNavigationMotionProvider({
	children,
}: FloatingNavigationMotionProviderProps) {
	const { pathname } = useLocation()
	const shouldReduceMotion = useReducedMotion()
	const [motionState, setMotionState] = React.useState<
		Pick<FloatingNavigationMotion, 'minimized' | 'reason'>
	>({ minimized: false, reason: 'route' })
	const frame = React.useRef(0)
	const lastY = React.useRef(0)
	const direction = React.useRef(0)
	const distance = React.useRef(0)
	const awaitingScrollIntent = React.useRef(true)
	const previousPathname = React.useRef(pathname)

	const reset = React.useCallback((reason: 'route') => {
		if (typeof window !== 'undefined') {
			lastY.current = Math.max(window.scrollY, 0)
		}
		direction.current = 0
		distance.current = 0
		awaitingScrollIntent.current = true
		setMotionState((current) =>
			!current.minimized && current.reason === reason
				? current
				: { minimized: false, reason },
		)
	}, [])

	const expand = React.useCallback(
		(reason: 'focus' | 'interaction' | 'route' = 'focus') => {
			if (reason === 'route') {
				reset('route')
				return
			}

			setMotionState((current) =>
				!current.minimized && current.reason === reason
					? current
					: { minimized: false, reason },
			)
		},
		[reset],
	)

	useIsomorphicLayoutEffect(() => {
		if (previousPathname.current === pathname) return

		previousPathname.current = pathname
		if (frame.current) {
			window.cancelAnimationFrame(frame.current)
			frame.current = 0
		}
		reset('route')
	}, [pathname, reset])

	React.useEffect(() => {
		const query = window.matchMedia(MOBILE_QUERY)

		const resetForEnvironment = () => reset('route')
		const acceptScrollIntent = () => {
			if (!awaitingScrollIntent.current) return

			awaitingScrollIntent.current = false
			lastY.current = Math.max(window.scrollY, 0)
			direction.current = 0
			distance.current = 0
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (
				[
					'ArrowDown',
					'ArrowUp',
					'End',
					'Home',
					'PageDown',
					'PageUp',
					' ',
				].includes(event.key)
			) {
				acceptScrollIntent()
			}
		}

		const update = () => {
			frame.current = 0

			if (!query.matches || shouldReduceMotion) {
				resetForEnvironment()
				return
			}

			const y = Math.max(window.scrollY, 0)
			if (awaitingScrollIntent.current) {
				lastY.current = y
				return
			}

			const delta = y - lastY.current
			lastY.current = y

			if (y <= TOP_THRESHOLD) {
				direction.current = 0
				distance.current = 0
				setMotionState((current) =>
					!current.minimized && current.reason === 'scroll'
						? current
						: { minimized: false, reason: 'scroll' },
				)
				return
			}

			if (Math.abs(delta) < 1) return

			const nextDirection = delta > 0 ? 1 : -1
			if (nextDirection !== direction.current) {
				direction.current = nextDirection
				distance.current = 0
			}
			distance.current += Math.abs(delta)

			if (
				direction.current === 1 &&
				y > MINIMIZE_SCROLL_Y &&
				distance.current >= MINIMIZE_DISTANCE
			) {
				setMotionState((current) =>
					current.minimized && current.reason === 'scroll'
						? current
						: { minimized: true, reason: 'scroll' },
				)
				distance.current = 0
			}

			if (direction.current === -1 && distance.current >= EXPAND_DISTANCE) {
				setMotionState((current) =>
					!current.minimized && current.reason === 'scroll'
						? current
						: { minimized: false, reason: 'scroll' },
				)
				distance.current = 0
			}
		}

		const onScroll = () => {
			if (frame.current) return
			frame.current = window.requestAnimationFrame(update)
		}

		resetForEnvironment()
		window.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('touchmove', acceptScrollIntent, { passive: true })
		window.addEventListener('wheel', acceptScrollIntent, { passive: true })
		window.addEventListener('keydown', onKeyDown)
		query.addEventListener('change', resetForEnvironment)

		return () => {
			if (frame.current) window.cancelAnimationFrame(frame.current)
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('touchmove', acceptScrollIntent)
			window.removeEventListener('wheel', acceptScrollIntent)
			window.removeEventListener('keydown', onKeyDown)
			query.removeEventListener('change', resetForEnvironment)
		}
	}, [reset, shouldReduceMotion])

	const value = React.useMemo<FloatingNavigationMotion>(
		() => ({ ...motionState, expand }),
		[expand, motionState],
	)

	return (
		<FloatingNavigationMotionContext value={value}>
			{children}
		</FloatingNavigationMotionContext>
	)
}

function useFloatingNavigationMotion() {
	const context = React.useContext(FloatingNavigationMotionContext)
	if (!context) {
		throw new Error(
			'useFloatingNavigationMotion must be used within FloatingNavigationMotionProvider',
		)
	}
	return context
}

export { FloatingNavigationMotionProvider, useFloatingNavigationMotion }
export type { FloatingNavigationMotion }
