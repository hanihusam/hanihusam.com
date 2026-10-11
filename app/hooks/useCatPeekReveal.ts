import { useScroll, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useState, type RefObject } from 'react'

import { SCROLL_STAGE_INSET } from '@/utils/motion'

// The cat box is offset `right: -104px` from the card, so its left 35px sit
// behind the card. cat-peek.png's rightmost opaque pixel (the ear) is column
// 121 of 139, so the art is fully hidden once its right edge (122) is pulled
// to ≤35: -88 leaves 1px to spare. Starting at -104 instead would spend the
// first ~16% of the scroll window moving a cat nobody can see. Revisit if the
// art changes.
const BODY_START = -88

// Scroll px the cat keeps leaning after the skate pen lands, so the two read
// as cause and effect rather than one muddy beat.
const SETTLE_AFTER_LANDING = 32

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
 *             the next section was already visible. It needs both:
 *               · start: the box's top clears the bottom stage line
 *                 (SCROLL_STAGE_INSET above the viewport bottom, the same
 *                 line the skate draw starts on), so the cat's head is on
 *                 screen before it moves — the skate is ~60% drawn by then;
 *               · end: SETTLE_AFTER_LANDING px after the skate's end (grid
 *                 bottom at the stage line). He bails, then the cat leans
 *                 out to see what happened: ~80% out when the pen lands.
 *             The next section is still ~32px below the fold at the end.
 * Frequency:  once per pass over the tile, each direction.
 * Purpose:    a static peeking-cat sticker is decoration. A cat that leans
 *             out from behind its card while its paws stay planted on the
 *             corner is a character — and it's the one place the site's
 *             motion is playful rather than merely tasteful.
 *
 * Enter:      the body translates X -88 → 0, sliding out from behind the
 *             card. Only the body moves. -88 is the last fully hidden
 *             position (see BODY_START), so the ear clears the card edge on
 *             the first scrolled pixel.
 * Exit:       the same value scrubbed backwards — the cat withdraws behind
 *             the card, paws still gripping.
 * Origin:     horizontal only. No scale, no rotation — a rigid thing sliding
 *             out from cover, not an element inflating in.
 * Easing:     none, and no smoothing — locked 1:1 to scroll, the same as the
 *             skate draw (`scrub: true`).
 * Duration:   not time-based. The two thresholds are measured on mount, on
 *             window resize, and when the grid's own box resizes — not
 *             hardcoded, so they track real layout instead of a guessed pixel
 *             range. They are NOT re-measured when the grid moves without
 *             resizing (content above it reflowing, or the PageTransition
 *             entrance still running at mount after a client navigation,
 *             which leaves the range ~5-8px late).
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
 * Open risk:  both thresholds share the stage-line offset, so the viewport
 *             height cancels out of the range: box height + its `bottom-2`
 *             offset + SETTLE_AFTER_LANDING, a fixed ~179px at every lg size.
 *             On very short lg windows (roughly under 450-530px tall) the skate's
 *             landing cap ends the draw early, so the cat's lag after the pen
 *             grows there. Earlier versions slid in the bottom ~147px of the
 *             viewport and settled ~96px before the pen landed.
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
			const stageBottom = window.innerHeight - SCROLL_STAGE_INSET
			const start = boxTop - stageBottom
			// The skate draw ends when the grid's bottom meets the stage line.
			const end = gridBottom - stageBottom + SETTLE_AFTER_LANDING
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
