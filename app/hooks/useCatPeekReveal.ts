import { useScroll, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useState, type RefObject } from 'react'

// The cat box is offset `right: -104px` from the card, so its left 35px sit
// behind the card and its right 104px stick out. Pulling it a full 104px left
// therefore tucks it entirely out of sight.
const BODY_START = -104

/**
 * Motion brief — cat bento peek (about)
 *
 * Verdict:    animate at `lg:` and up. Cut below `lg` — `cat-front.png` is a
 *             different, head-only asset with nothing to peek with, and stays
 *             static, untouched.
 * Trigger:    raw window scroll position (`useScroll()` with no target),
 *             remapped through two measured pixel thresholds rather than
 *             Motion's `target`/`offset` API — that only accepts one target,
 *             and this scene genuinely needs two. Third attempt at this:
 *             scoping to the grid or the tile made the reveal run ahead of
 *             what was on screen (the tile sits at the grid's bottom-right,
 *             and the cat hangs off the tile's own bottom edge); scoping to
 *             the box alone fixed that but let the reveal finish long after
 *             the next section was already visible. It needs both — start
 *             when the box enters the viewport, end when the grid's bottom
 *             reaches the viewport's bottom, same deadline the skate tile's
 *             line draw uses, so neither scroll piece in this section is
 *             still animating once the next section appears.
 * Frequency:  once per pass over the tile, each direction.
 * Purpose:    a static peeking-cat sticker is decoration. A cat that leans
 *             out from behind its card while its paws stay planted on the
 *             corner is a character — and it's the one place the site's
 *             motion is playful rather than merely tasteful.
 *
 * Enter:      the body translates X -104 → 0, sliding out from behind the
 *             card. Only the body moves.
 * Exit:       the same value scrubbed backwards — the cat withdraws behind
 *             the card, paws still gripping.
 * Origin:     horizontal only. No scale, no rotation — a rigid thing sliding
 *             out from cover, not an element inflating in.
 * Easing:     none — scroll velocity is the easing, matching every other
 *             scrubbed scene on the site.
 * Duration:   not time-based. The two thresholds are measured on mount and
 *             on resize (mirroring GSAP's `invalidateOnRefresh` on the skate
 *             tile), not hardcoded, so they track real layout instead of a
 *             guessed pixel range.
 * Interrupt:  scroll-linked motion values retarget continuously; there is no
 *             discrete state to restart from.
 *
 * The paws:   deliberately NOT animated. They are a separate, static layer
 *             painted in FRONT of the card, so they read as gripping the
 *             corner the whole time while the cat leans out from behind it.
 * Occlusion:  three paint layers, ordered by DOM position within the grid
 *             area — body (behind) → card → paws (in front). The card's own
 *             opaque background does the occluding, including its rounded
 *             corner, rather than a clip-path approximating the card's edge.
 *
 * Reduced motion: never engaged — `active` gates on
 *             `prefers-reduced-motion: no-preference`, so the body renders at
 *             rest with no transform, ever.
 * SSR:        `active` starts false on the server and the first client
 *             render, so the cat ships fully out. JS only ever pulls it back
 *             behind the card after mount, and the section is well below the
 *             fold, so that frame is never seen.
 * Stack:      Motion (`useScroll` + `useTransform`) — one DOM element and one
 *             transform, squarely "Motion owns DOM state". It does mean a
 *             second scroll-observer alongside the skate tile's GSAP
 *             ScrollTrigger: a deliberate, confirmed exception.
 *
 * Open risk:  if the grid's bottom ever sits close enough to the viewport
 *             height that start and end land within a few px of each other
 *             (a very short or very tall viewport), the reveal would
 *             compress into an abrupt snap. Not observed at common
 *             breakpoints, not exhaustively tested at extremes.
 */
function useCatPeekReveal(boxRef: RefObject<HTMLElement | null>): {
	active: boolean
	bodyX: MotionValue<number>
} {
	const [active, setActive] = useState(false)
	const [range, setRange] = useState<[number, number]>([0, 1])

	useEffect(() => {
		const query = window.matchMedia(
			'(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
		)
		const update = () => setActive(query.matches)
		update()
		query.addEventListener('change', update)
		return () => query.removeEventListener('change', update)
	}, [])

	useEffect(() => {
		const box = boxRef.current
		const grid = box?.closest<HTMLElement>('[data-bento-grid]')
		if (!box || !grid) return

		const measure = () => {
			const boxTop = box.getBoundingClientRect().top + window.scrollY
			const gridBottom = grid.getBoundingClientRect().bottom + window.scrollY
			const vh = window.innerHeight
			// Start: the box's top edge reaches the viewport's bottom edge.
			const start = boxTop - vh
			// End: the grid's bottom edge reaches the viewport's bottom edge —
			// identical deadline to the skate tile's `endTrigger`/`end: 'bottom
			// bottom'`, so both scroll pieces resolve by the same point.
			const end = gridBottom - vh
			setRange([start, Math.max(end, start + 1)])
		}

		measure()
		window.addEventListener('resize', measure)
		const ro = new ResizeObserver(measure)
		ro.observe(grid)
		return () => {
			window.removeEventListener('resize', measure)
			ro.disconnect()
		}
	}, [boxRef])

	const { scrollY } = useScroll()
	const bodyX = useTransform(scrollY, range, [BODY_START, 0], {
		clamp: true,
	})

	return { active, bodyX }
}

export { useCatPeekReveal }
