import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type RefObject } from 'react'

import { SCROLL_STAGE_INSET } from '@/utils/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// A round linecap paints a dot even where the dash has zero length, so each
// stroke hides a little further into the gap than its own length.
const HIDE_BUFFER = 3

function pageEdges(element: Element) {
	const rect = element.getBoundingClientRect()
	return {
		top: rect.top + window.scrollY,
		bottom: rect.bottom + window.scrollY,
	}
}

/**
 * Motion brief — skate bento line draw (about)
 *
 * Verdict:    animate. One of the bento's two scrubbed scroll scenes (the
 *             other is the cat peek, useCatPeekReveal.ts).
 * Trigger:    scroll position, scrubbed 1:1. The reader holds the clock,
 *             forward and backward.
 *               · start: the FIRST stroke's bottom reaches the bottom stage
 *                 line (SCROLL_STAGE_INSET above the viewport bottom). Keyed
 *                 to the first pixel that moves, not the photo's edge, so
 *                 nothing draws below the fold or under the nav.
 *               · end: the bento grid's bottom reaches that same line — or,
 *                 if sooner, the landing stroke's top reaches the top stage
 *                 line. The cap only binds on short viewports — landscape
 *                 phones, short md windows (under ~650-730px tall), small
 *                 portrait phones — where waiting for the grid would draw the
 *                 board strokes under the top blur or past the top edge. It
 *                 is deliberately conservative: the pen stays 30-50px below
 *                 the blur, at the cost of a ~15% shorter runway there.
 * Frequency:  once per pass over the tile, each direction.
 * Purpose:    the photo is a bail — he falls back as the board shoots out —
 *             and the swoosh is its action lines. Drawing them top-down as
 *             the page rises feeds the photo up under the pen, so the
 *             reader's own scroll visibly draws the fall, in the direction he
 *             falls. On the long downward strokes (down his back, down his
 *             side, the landing curl) the nib nearly holds still on screen;
 *             the two strokes that run uphill in the art (beside the arm,
 *             along the board) still ride up at ~1.2-1.5x scroll speed.
 *
 * Enter:      one continuous draw: the flick beside his raised arm, a pen
 *             lift to the helmet, down his back, under the body, along the
 *             top of the board, and the curl around its end (the landing).
 *             Three things make it read as one line rather than nine reveals:
 *               · strictly sequential — a segment finishes before the next
 *                 starts, so there is only ever one pen on the page;
 *               · duration proportional to each path's own length, so the pen
 *                 holds a constant speed instead of giving a 10px dot the
 *                 same time as a 94px sweep;
 *               · direction per segment, hand-set in skate-trace-paths.ts,
 *                 because the artwork's own path directions are inconsistent.
 *             Top-down replaced an earlier bottom-up route, which started on
 *             the board — the last part of the photo to scroll in — so about
 *             a third of it drew below the fold, and its pen climbed while the
 *             page rose, racing away from the reader at ~1.4x scroll speed.
 * Exit:       the same timeline scrubbed backwards; it un-draws from the nib.
 * Origin:     n/a — a length reveal, not a transform.
 * Easing:     `none`, and it has to be: any curve would break the constant pen
 *             speed and let the nib drift on screen.
 * Duration:   not time-based. The runway is the page distance from the first
 *             stroke to the grid's bottom, roughly 340-440px at lg and
 *             520-570px below it. Where the landing cap binds it's shorter:
 *             ~215-345px on landscape phones, a smaller trim on short md
 *             windows (800x620: 534px). It ends while the bento is on screen:
 *             the spacers below the grid (128-160px) are taller than
 *             SCROLL_STAGE_INSET, so the next section hasn't arrived (measured
 *             32-72px below the fold at the end). At lg the cat peek
 *             (useCatPeekReveal.ts) starts once the draw is ~60% done and
 *             finishes just after the pen lands: he bails, then the cat leans
 *             out to see what happened.
 * Interrupt:  `scrub: true` — progress is the scroll position, with no
 *             catch-up. Stop mid-stroke and the line stops with the hand. Any
 *             smoothing shows as the nib sliding along the photo after the
 *             hand stops; if a wheel mouse ever looks stepped, `scrub: 0.1`
 *             is the ceiling.
 *
 * Reduced motion: the scene is never constructed, so every segment renders
 *             drawn at once. A render path, not a disabled animation.
 * SSR:        every segment ships fully drawn; JS only ever adds a dash offset
 *             on top of complete decorative art, below the fold at common
 *             sizes. Mounting with the tile in view (restored scroll) jumps
 *             from fully drawn straight to the correct partial state; the
 *             explicit refresh after building the timeline removes the empty
 *             frame ScrollTrigger's deferred first refresh used to paint.
 * Stack:      GSAP + ScrollTrigger, no other plugins. The trigger is the first
 *             `[data-trace-segment]` path itself. There is deliberately no
 *             hover, click or speed-reactive layer: this is decoration inside
 *             a text tile, and a pointer-driven version read as twitchy
 *             against copy the reader is trying to read.
 *
 * Open risk:  the route and each stroke's direction are hand-set against this
 *             exact artwork; redrawing the trace means re-deciding both.
 *             SCROLL_STAGE_INSET is tied to the nav's and the top blur's sizes;
 *             change either, revisit it. On viewports tall enough to show the
 *             photo at hydration (~1230px+), the trace visibly hides on mount.
 *             With OS smooth scrolling off, a wheel notch draws ~24-30% of
 *             the route in one frame; real browsers smooth notches by default.
 *             After a client-side navigation the range measures ~6-8px late
 *             (PageTransition's entrance is still running; plan 002 batch D).
 */
function useSkateTrace(scopeRef: RefObject<HTMLElement | null>) {
	useGSAP(
		() => {
			const scope = scopeRef.current
			if (!scope) return

			const segments = gsap.utils.toArray<SVGPathElement>(
				scope.querySelectorAll('[data-trace-segment]'),
			)
			if (!segments.length) return

			// The draw is paced against the whole bento, not this tile, so it can
			// never still be running once the next section arrives.
			const grid = scope.closest<HTMLElement>('[data-bento-grid]')

			const mm = gsap.matchMedia()

			mm.add('(prefers-reduced-motion: no-preference)', () => {
				const lengths = segments.map((segment) => segment.getTotalLength())
				const total = lengths.reduce((sum, length) => sum + length, 0)

				segments.forEach((segment, i) => {
					const length = lengths[i] ?? 0
					const hidden = length + Math.min(HIDE_BUFFER, length * 0.25)
					gsap.set(segment, {
						// Gap twice the dash so the pattern never wraps back into view
						// at the far end of a stroke.
						strokeDasharray: `${length} ${length * 2}`,
						strokeDashoffset: segment.dataset.from === 'end' ? -hidden : hidden,
					})
				})

				const timeline = gsap.timeline({
					defaults: { ease: 'none' },
					scrollTrigger: {
						trigger: segments[0],
						start: `bottom bottom-=${SCROLL_STAGE_INSET}`,
						end: () => {
							const gridEnd =
								pageEdges(grid ?? scope).bottom -
								(window.innerHeight - SCROLL_STAGE_INSET)
							// On short viewports the grid's bottom arrives so late that the
							// board strokes would draw up under the top blur, or past the
							// top edge. Finish no later than the landing stroke's top
							// reaching the top stage line, so the whole landing stays clear.
							const landing = segments[segments.length - 1]
							const landingEnd = landing
								? pageEdges(landing).top - SCROLL_STAGE_INSET
								: gridEnd
							return Math.min(gridEnd, landingEnd)
						},
						scrub: true,
						invalidateOnRefresh: true,
					},
				})

				// No position parameter: each tween appends after the last, so only
				// one segment is ever drawing. Duration tracks length, which is what
				// holds the pen at a constant speed across all nine.
				segments.forEach((segment, i) => {
					timeline.to(segment, {
						strokeDashoffset: 0,
						duration: (lengths[i] ?? 0) / total,
					})
				})

				// ScrollTrigger defers its first refresh a tick, so mounting with the
				// tile already in view (restored scroll) painted an empty frame
				// before the correct partial state. Measure now instead.
				timeline.scrollTrigger?.refresh()

				return () => {
					gsap.set(segments, {
						clearProps: 'strokeDasharray,strokeDashoffset',
					})
				}
			})

			return () => mm.revert()
		},
		{ scope: scopeRef },
	)
}

export { useSkateTrace }
