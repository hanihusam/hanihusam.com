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
 * Trigger:    scroll position, scrubbed against the CAT BOX's own transit
 *             through the viewport — not the bento grid, and not even the
 *             cat's tile. Both were tried and both ran ahead of what the
 *             reader can see: the grid because this tile sits at its
 *             bottom-right corner (progress hit ~78% before the tile was on
 *             screen at all), and the tile because the cat hangs off its
 *             bottom edge (~28% gone by the time the cat appeared). Scoping
 *             to the 139x139 box itself is the only framing where the whole
 *             reveal happens in view.
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
 * Duration:   not time-based. Starts as the cat box's top edge enters the
 *             viewport (`start end`), finishes once its bottom reaches 60%
 *             up the viewport (`end 60%`) — fully out while comfortably on
 *             screen, not at the last possible moment.
 * Interrupt:  scroll-linked motion values retarget continuously; there is no
 *             discrete state to restart from.
 *
 * The paws:   deliberately NOT animated. They are a separate, static layer
 *             painted in FRONT of the card, so they read as gripping the
 *             corner the whole time while the cat leans out from behind it.
 *             An earlier version animated them too, which made the grip look
 *             like it was sliding rather than holding.
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
 * Open risk:  the travel distance is tied to the box's `-right-26` offset. If
 *             that offset changes, BODY_START has to change with it or the
 *             cat will not fully hide.
 */
function useCatPeekReveal(boxRef: RefObject<HTMLElement | null>): {
	active: boolean
	bodyX: MotionValue<number>
} {
	const [active, setActive] = useState(false)

	useEffect(() => {
		const query = window.matchMedia(
			'(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
		)
		const update = () => setActive(query.matches)
		update()
		query.addEventListener('change', update)
		return () => query.removeEventListener('change', update)
	}, [])

	const { scrollYProgress } = useScroll({
		target: boxRef,
		offset: ['start end', 'end 60%'],
	})

	const bodyX = useTransform(scrollYProgress, [0, 1], [BODY_START, 0], {
		clamp: true,
	})

	return { active, bodyX }
}

export { useCatPeekReveal }
