import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'

import { DURATION_BASE, EASE_OUT_QUART } from '@/utils/motion'

/**
 * Entrance-only route transition. Re-keying on pathname remounts the incoming
 * page so it fades/slides in. We deliberately avoid AnimatePresence exit
 * animations: keeping the outgoing route mounted crashes it, because React
 * Router 7 injects `loaderData` as a prop that is already gone once navigation
 * starts. The first (SSR) mount is not animated so the server renders content
 * fully visible — no FOUC / no invisible content without JS.
 */
function PageTransition() {
	const location = useLocation()
	const shouldReduceMotion = useReducedMotion()
	const hasMounted = useRef(false)

	useEffect(() => {
		hasMounted.current = true
	}, [])

	const animateIn = hasMounted.current && !shouldReduceMotion

	return (
		<motion.div
			key={location.pathname}
			className="flex grow flex-col"
			initial={animateIn ? { opacity: 0, y: 8 } : false}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: animateIn ? DURATION_BASE : 0,
				ease: EASE_OUT_QUART,
			}}
		>
			<Outlet />
		</motion.div>
	)
}

export { PageTransition }
