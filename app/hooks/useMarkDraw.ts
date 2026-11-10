/*
 * Motion brief — /resume handwriting (HandMark, the header notes, Signature)
 *
 * Verdict:   keep. Benji-style margin notes: pen strokes and handwriting that
 *            write themselves in, pointing at the line they annotate.
 * Trigger:   two kinds.
 *            - Header (tagline note + arrow to the name, "one page, A4" + arrow
 *              to Download PDF): page load, as an entrance. Pure CSS
 *              keyframes, so they play on first paint without waiting for JS.
 *            - Everything below (the underline, the circle, the signature):
 *              the element itself fully on stage (viewport inset by
 *              SCROLL_STAGE_INSET), once. A triggered reveal, not scrubbed.
 * Frequency: once per element per visit; never replays.
 * Purpose:   a pen annotating the page as the reader arrives at it.
 * Enter:     marks: stroke-dashoffset 1.05 → 0 on a pathLength="1" path, the
 *            arrow head after its shaft. Notes and signature: clip-path inset
 *            from the right, so the ink appears left to right.
 * Order:     one pen at a time: write the note, then draw the arrow from it
 *            to what it points at. Tagline line 1 200–600ms, line 2 600–1000,
 *            its arrow 900–1400; "one page, A4" 1200–1600, its arrow
 *            1500–2000. Every line is visible from the first frame of its
 *            own stroke, so the ~2s tail is fine (Design, 2026-11-10). The
 *            signature follows the circle by --duration-slower.
 * Exit:      none.
 * Easing:    --ease-out-quart for strokes (a flick that settles); linear for
 *            handwriting (a pen moves at a steady pace).
 * Duration:  --duration-slower per arrow shaft, the circle and the signature;
 *            2 × --duration-base per header line; --duration-base per arrow
 *            head. Delays are sums and multiples of duration tokens.
 * Interrupt: none; once drawn it stays drawn.
 * Reduced:   never hidden. Every duration and delay is a token, so they zero
 *            out, and motion-reduce:animate-none drops the keyframes too.
 * SSR:       header: the keyframes hold the hidden first frame during the
 *            delay, so the server HTML is visible as soon as CSS runs, with no
 *            JS. Below: ships fully drawn (also the no-JS state). This hook
 *            hides an element only after mount, and only when no part of it is
 *            on screen, so nothing already in view flickers.
 * Stack:     CSS keyframes and transitions; this hook only decides the state
 *            (IntersectionObserver, like Reveal's whileInView).
 * Open risk: an element scrolled past faster than the observer fires is drawn
 *            when it next enters the stage, or stays hidden above it until the
 *            reader scrolls back up.
 */
import { useEffect, useRef, useState, type RefObject } from 'react'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SCROLL_STAGE_INSET } from '@/utils/motion'

type MarkState = 'drawn' | 'hidden'

/** `enabled: false` keeps the element drawn (for marks animated another way). */
function useMarkDraw(
	ref: RefObject<Element | null>,
	enabled = true,
): MarkState {
	const motionAllowed = useMediaQuery('(prefers-reduced-motion: no-preference)')
	const [state, setState] = useState<MarkState>('drawn')
	const done = useRef(false)

	useEffect(() => {
		const element = ref.current
		if (!enabled || !motionAllowed || !element || done.current) {
			setState('drawn')
			return
		}

		const { top, bottom } = element.getBoundingClientRect()
		if (bottom > 0 && top < window.innerHeight) {
			done.current = true
			return
		}

		// Near the end of a page with no footer (/resume/upwork) the element
		// can't scroll above the stage's bottom edge, so that edge comes down
		// to what's left below it.
		const belowElement =
			document.documentElement.scrollHeight - (bottom + window.scrollY)
		const bottomInset = Math.max(
			0,
			Math.min(SCROLL_STAGE_INSET, Math.floor(belowElement) - 1),
		)

		setState('hidden')
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return
				done.current = true
				setState('drawn')
				observer.disconnect()
			},
			{
				rootMargin: `-${SCROLL_STAGE_INSET}px 0px -${bottomInset}px 0px`,
				threshold: 1,
			},
		)
		observer.observe(element)
		return () => observer.disconnect()
	}, [enabled, motionAllowed, ref])

	return state
}

export { useMarkDraw }
export type { MarkState }
