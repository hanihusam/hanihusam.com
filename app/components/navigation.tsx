import { SubstackLogo } from '@/components/writing/substack-logo'
import { useFloatingNavigationMotion } from '@/hooks/useFloatingNavigationMotion'
import { useIsomorphicLayoutEffect } from '@/utils/helpers'
import {
	DURATION_BASE,
	DURATION_FAST,
	EASE_HOVER,
	EASE_IN_OUT_QUART,
} from '@/utils/motion'

import { ExternalNavigationItem } from './ui/external-navigation-item'
import NavigationItem from './ui/navigation-item'
import ThemeSwitcher from './ui/theme-switcher'

import { HouseIcon, WrenchIcon, UserCircleIcon } from '@phosphor-icons/react'
import {
	animate,
	motion,
	useMotionTemplate,
	useMotionValue,
	useReducedMotion,
	type PanInfo,
} from 'motion/react'
import * as React from 'react'
import { useLocation, matchPath, useNavigate } from 'react-router'
import { clsxm } from '@/utils/clsxm'

const routeLinks = [
	{
		href: '/',
		label: 'Home',
		icon: HouseIcon,
	},
	{
		href: '/works',
		label: 'Projects',
		icon: WrenchIcon,
	},
	{
		href: '/about',
		label: 'About',
		icon: UserCircleIcon,
	},
]

const substackLink = {
	href: 'https://bapak2dev.substack.com/',
	label: 'Substack',
	icon: SubstackLogo,
}

const ITEM_SIZE = 40
const MAX_INDICATOR_X = ITEM_SIZE * (routeLinks.length - 1)
const VELOCITY_THRESHOLD = 450
const EDGE_RESISTANCE = 0.15
const MAX_EDGE_OVERSHOOT = 6
const MINIMIZED_SCALE = 0.88
const ARMED_INDICATOR_SCALE = 1.06
const EDGE_INDICATOR_SCALE_X = 1.075

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

function getIndicatorDragState(value: number) {
	if (value < 0) {
		const overshoot = Math.min(
			Math.abs(value) * EDGE_RESISTANCE,
			MAX_EDGE_OVERSHOOT,
		)
		return {
			x: 0,
			edgeProgress: overshoot / MAX_EDGE_OVERSHOOT,
			originX: 100,
		}
	}
	if (value > MAX_INDICATOR_X) {
		const overshoot = Math.min(
			(value - MAX_INDICATOR_X) * EDGE_RESISTANCE,
			MAX_EDGE_OVERSHOOT,
		)
		return {
			x: MAX_INDICATOR_X,
			edgeProgress: overshoot / MAX_EDGE_OVERSHOOT,
			originX: 0,
		}
	}
	return { x: value, edgeProgress: 0, originX: 50 }
}

export function Navigation() {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const shouldReduceMotion = useReducedMotion()
	const { minimized, reason, expand } = useFloatingNavigationMotion()

	const activeIndex = routeLinks.findIndex(({ href }) =>
		matchPath({ path: href, end: href === '/' }, pathname),
	)
	const indicatorX = useMotionValue(Math.max(activeIndex, 0) * ITEM_SIZE)
	const indicatorScaleX = useMotionValue(1)
	const indicatorScaleY = useMotionValue(1)
	const indicatorY = useMotionValue(0)
	const indicatorOriginX = useMotionValue(50)
	const indicatorTransform = useMotionTemplate`translate3d(${indicatorX}px, ${indicatorY}px, 0) scaleX(${indicatorScaleX}) scaleY(${indicatorScaleY})`
	const indicatorTransformOrigin = useMotionTemplate`${indicatorOriginX}% 50%`
	const navigationScale = useMotionValue(1)
	const navigationTransform = useMotionTemplate`scale(${navigationScale})`
	const primaryTrackRef = React.useRef<HTMLDivElement>(null)
	const pointerGrabOffset = React.useRef(ITEM_SIZE / 2)
	const dragging = React.useRef(false)
	const draggingAtEdge = React.useRef(false)
	const dragPointerType = React.useRef('')
	const armed = React.useRef(false)
	const pointerDownIndex = React.useRef<number | undefined>(undefined)
	const suppressClick = React.useRef(false)
	const releasedIndex = React.useRef<number | undefined>(undefined)

	useIsomorphicLayoutEffect(() => {
		navigationScale.stop()
		const target = shouldReduceMotion || !minimized ? 1 : MINIMIZED_SCALE

		if (shouldReduceMotion || reason === 'route') {
			navigationScale.set(target)
			return
		}

		const isInteraction = reason === 'interaction'
		const controls = animate(navigationScale, target, {
			duration: isInteraction ? DURATION_FAST : DURATION_BASE,
			ease: isInteraction ? EASE_HOVER : EASE_IN_OUT_QUART,
		})
		return () => controls.stop()
	}, [minimized, navigationScale, reason, shouldReduceMotion])

	const settleIndicatorShape = React.useCallback(() => {
		indicatorScaleX.stop()
		indicatorScaleY.stop()
		indicatorY.stop()
		indicatorOriginX.stop()

		if (shouldReduceMotion) {
			indicatorScaleX.set(1)
			indicatorScaleY.set(1)
			indicatorY.set(0)
			indicatorOriginX.set(50)
			return
		}

		animate(indicatorScaleX, 1, {
			duration: DURATION_FAST,
			ease: EASE_HOVER,
		})
		animate(indicatorScaleY, 1, {
			duration: DURATION_FAST,
			ease: EASE_HOVER,
		})
		animate(indicatorY, 0, {
			duration: DURATION_FAST,
			ease: EASE_HOVER,
		})
		animate(indicatorOriginX, 50, {
			duration: DURATION_FAST,
			ease: EASE_HOVER,
		})
	}, [
		indicatorOriginX,
		indicatorScaleX,
		indicatorScaleY,
		indicatorY,
		shouldReduceMotion,
	])

	const settleIndicatorPresence = React.useCallback(() => {
		armed.current = false
		draggingAtEdge.current = false
		pointerDownIndex.current = undefined
		dragPointerType.current = ''
		settleIndicatorShape()
	}, [settleIndicatorShape])

	React.useEffect(() => {
		settleIndicatorPresence()
		if (activeIndex === -1 || dragging.current) return

		const target = activeIndex * ITEM_SIZE
		if (releasedIndex.current === activeIndex) {
			releasedIndex.current = undefined
			return
		}

		if (shouldReduceMotion) {
			indicatorX.set(target)
			return
		}

		const controls = animate(indicatorX, target, {
			duration: DURATION_BASE,
			ease: EASE_IN_OUT_QUART,
		})
		return () => controls.stop()
	}, [activeIndex, indicatorX, settleIndicatorPresence, shouldReduceMotion])

	function snapIndicator(index: number) {
		const target = index * ITEM_SIZE
		indicatorX.stop()

		if (shouldReduceMotion) {
			indicatorX.set(target)
			return
		}

		animate(indicatorX, target, {
			type: 'spring',
			stiffness: 520,
			damping: 42,
			mass: 0.7,
		})
	}

	function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
		dragPointerType.current = event.pointerType
		armed.current = false
		pointerDownIndex.current = undefined

		if (
			activeIndex === -1 ||
			(event.pointerType !== 'touch' && event.pointerType !== 'pen')
		) {
			settleIndicatorPresence()
			return
		}

		const trackBounds = event.currentTarget.getBoundingClientRect()
		const slotWidth = trackBounds.width / routeLinks.length
		const pointerIndex = clamp(
			Math.floor((event.clientX - trackBounds.left) / slotWidth),
			0,
			routeLinks.length - 1,
		)

		pointerDownIndex.current = pointerIndex
		if (pointerIndex !== activeIndex) {
			settleIndicatorPresence()
			return
		}

		armed.current = true
		pointerGrabOffset.current = clamp(
			((event.clientX - (trackBounds.left + activeIndex * slotWidth)) /
				slotWidth) *
				ITEM_SIZE,
			0,
			ITEM_SIZE,
		)
		indicatorScaleX.stop()
		indicatorScaleY.stop()
		indicatorY.stop()
		indicatorOriginX.stop()
		indicatorOriginX.set(50)

		if (minimized) expand('interaction')

		if (shouldReduceMotion) {
			indicatorScaleX.set(1)
			indicatorScaleY.set(1)
			indicatorY.set(0)
			return
		}

		animate(indicatorScaleX, ARMED_INDICATOR_SCALE, {
			duration: DURATION_FAST,
			ease: EASE_HOVER,
		})
		animate(indicatorScaleY, ARMED_INDICATOR_SCALE, {
			duration: DURATION_FAST,
			ease: EASE_HOVER,
		})
		animate(indicatorY, -1, {
			duration: DURATION_FAST,
			ease: EASE_HOVER,
		})
	}

	function handlePointerUp() {
		settleIndicatorPresence()
	}

	function handleFocusCapture() {
		if (
			dragPointerType.current === 'touch' ||
			dragPointerType.current === 'pen'
		) {
			return
		}

		expand('focus')
	}

	function handlePanStart() {
		if (
			activeIndex === -1 ||
			!armed.current ||
			pointerDownIndex.current !== activeIndex ||
			(dragPointerType.current !== 'touch' && dragPointerType.current !== 'pen')
		) {
			settleIndicatorPresence()
			return
		}

		indicatorX.stop()
		dragging.current = true
		draggingAtEdge.current = false
		suppressClick.current = true
		settleIndicatorShape()
	}

	function handlePan(event: PointerEvent) {
		if (!dragging.current) return

		const trackBounds = primaryTrackRef.current?.getBoundingClientRect()
		if (!trackBounds?.width) return

		const pointerX =
			((event.clientX - trackBounds.left) / trackBounds.width) *
			ITEM_SIZE *
			routeLinks.length
		const dragState = getIndicatorDragState(
			pointerX - pointerGrabOffset.current,
		)
		indicatorX.set(dragState.x)

		if (shouldReduceMotion) {
			indicatorScaleX.set(1)
			indicatorScaleY.set(1)
			indicatorOriginX.set(50)
			return
		}

		if (dragState.edgeProgress === 0) {
			if (draggingAtEdge.current) {
				draggingAtEdge.current = false
				settleIndicatorShape()
			}
			return
		}

		draggingAtEdge.current = true
		indicatorScaleX.stop()
		indicatorOriginX.stop()
		indicatorScaleX.set(
			1 + dragState.edgeProgress * (EDGE_INDICATOR_SCALE_X - 1),
		)
		indicatorOriginX.set(50 + dragState.edgeProgress * (dragState.originX - 50))
	}

	function handlePanEnd(_: PointerEvent, info: PanInfo) {
		if (!dragging.current) {
			settleIndicatorPresence()
			return
		}

		dragging.current = false
		settleIndicatorPresence()
		window.setTimeout(() => {
			suppressClick.current = false
		}, 0)

		if (activeIndex === -1) return

		const currentX = clamp(indicatorX.get(), 0, MAX_INDICATOR_X)
		const positionIndex = Math.round(currentX / ITEM_SIZE)
		const hasFlingVelocity = Math.abs(info.velocity.x) >= VELOCITY_THRESHOLD

		const targetIndex =
			positionIndex === activeIndex && hasFlingVelocity
				? activeIndex + Math.sign(info.velocity.x)
				: positionIndex

		const nextIndex = clamp(targetIndex, 0, routeLinks.length - 1)
		const nextLink = routeLinks[nextIndex]
		if (!nextLink) return

		snapIndicator(nextIndex)
		if (nextIndex !== activeIndex) {
			releasedIndex.current = nextIndex
			void navigate(nextLink.href)
		}
	}

	function handlePointerCancel() {
		const wasDragging = dragging.current

		dragging.current = false
		suppressClick.current = false
		settleIndicatorPresence()
		if (wasDragging && activeIndex !== -1) snapIndicator(activeIndex)
	}

	function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
		if (!suppressClick.current) return
		event.preventDefault()
		event.stopPropagation()
		suppressClick.current = false
	}

	return (
		<motion.div
			initial={false}
			onFocusCapture={handleFocusCapture}
			style={{
				transform: navigationTransform,
				transformOrigin: '50% 100%',
			}}
			data-state={minimized ? 'minimized' : 'expanded'}
			className="fixed inset-x-0 bottom-8 z-20 mx-auto flex w-fit items-center rounded-md border border-(--border-primary) bg-(--surface-primary) shadow-lg transition-colors"
		>
			<div className="flex items-center p-1">
				<nav aria-label="Primary">
					<motion.div
						ref={primaryTrackRef}
						onPointerDown={handlePointerDown}
						onPointerUp={handlePointerUp}
						onPointerCancel={handlePointerCancel}
						onPanStart={handlePanStart}
						onPan={handlePan}
						onPanEnd={handlePanEnd}
						onClickCapture={handleClickCapture}
						className="relative flex touch-pan-y"
					>
						<span
							aria-hidden
							className="pointer-events-none absolute -inset-y-1 -right-0.75 -left-0.75 overflow-hidden rounded-md"
						>
							<motion.span
								data-navigation-indicator
								style={{
									transform: indicatorTransform,
									transformOrigin: indicatorTransformOrigin,
									borderRadius: 6,
								}}
								className={clsxm(
									'absolute top-1 left-0.75 size-10',
									'bg-(--nav-item-surface-active)',
									activeIndex === -1 && 'opacity-0',
								)}
							/>
						</span>
						{routeLinks.map((link) => (
							<NavigationItem
								key={link.href}
								href={link.href}
								label={link.label}
							>
								<link.icon className="size-5" />
							</NavigationItem>
						))}
					</motion.div>
				</nav>

				<div
					aria-hidden
					className="mx-1 h-10 w-px bg-(--border-primary) transition-colors"
				/>

				<div role="group" aria-label="Utilities" className="flex items-center">
					<ExternalNavigationItem
						href={substackLink.href}
						label={substackLink.label}
					>
						<substackLink.icon aria-hidden className="size-5" />
					</ExternalNavigationItem>

					<ThemeSwitcher />
				</div>
			</div>
		</motion.div>
	)
}
