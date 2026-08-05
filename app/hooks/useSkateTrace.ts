import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type RefObject } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// A round linecap paints a dot even where the dash has zero length, so each
// stroke hides a little further into the gap than its own length.
const HIDE_BUFFER = 3

/**
 * Motion brief — skate bento line draw (about)
 *
 * Verdict:    animate. The site's one scroll-narrative scene.
 * Trigger:    scroll position, scrubbed. Not `play` on enter — the reader
 *             holds the clock, forward and backward.
 * Frequency:  once per pass over the tile, each direction.
 * Purpose:    the swoosh is inert decoration today. Drawing it like a route
 *             being traced on a map gives the bento a second layer and is the
 *             one place the site demonstrates reader-controlled timing.
 *
 * Enter:      one continuous draw, bottom of the board upward, finishing on
 *             the stroke beside him. Three things make it read as a route
 *             rather than nine separate reveals:
 *               · strictly sequential — a segment finishes before the next
 *                 starts, so there is only ever one pen on the page;
 *               · duration proportional to each path's own length, so the pen
 *                 holds a constant speed instead of giving a 10px dot the
 *                 same time as a 94px sweep;
 *               · direction per segment, hand-set in skate-trace-paths.ts,
 *                 because the artwork's own path directions are inconsistent.
 * Exit:       the same timeline scrubbed backwards. No separate reverse.
 * Origin:     n/a — a length reveal, not a transform.
 * Easing:     `none`, and it has to be: any curve would break the constant pen
 *             speed that sells the route.
 * Duration:   not time-based. Starts as the tile comes up the screen and is
 *             finished by the time the bento's bottom edge reaches the bottom
 *             of the viewport — so the route always completes while the bento
 *             is still the thing on screen, never trailing into the section
 *             below. That is why the end is anchored to the grid rather than
 *             to this tile.
 * Interrupt:  `scrub: 0.5` retargets from the current value.
 *
 * Reduced motion: the scene is never constructed, so every segment renders
 *             drawn at once. A render path, not a disabled animation.
 * SSR:        every segment ships fully drawn; JS only ever adds a dash offset
 *             on top of complete decorative art. The tile sits well below the
 *             fold, so the pre-hydration state is never seen.
 * Stack:      GSAP + ScrollTrigger. There is deliberately no hover or click
 *             behaviour here: this is decoration sitting inside a text tile,
 *             and a pointer-driven version read as twitchy against copy the
 *             reader is trying to read.
 *
 * Open risk:  the route and each stroke's direction are hand-set against this
 *             exact artwork. Redrawing the trace means re-deciding both.
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
						trigger: scope,
						start: 'top 90%',
						endTrigger: grid ?? scope,
						end: 'bottom bottom',
						scrub: 0.5,
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
