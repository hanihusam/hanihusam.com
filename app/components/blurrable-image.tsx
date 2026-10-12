import * as React from 'react'

import { clsxm } from '@/utils/clsxm'
import { DURATION_SLOW } from '@/utils/motion'

type LoadState = 'idle' | 'loading' | 'loaded' | 'settled' | 'failed'

/**
 * An image over its blurred placeholder. The server renders the real image
 * visible, stacked above the placeholder: until it loads it has no pixels, so
 * the blur shows through, and once it loads it covers the blur — with JS off,
 * or before hydration, too.
 *
 * Only an image with nothing drawn yet at hydration (the lazy cards further
 * down) is hidden and then fades in over the blur. One that is already
 * drawing (progressive decode, a srcset swap) stays put. The fade sits on a
 * wrapper so it never fights a caller's own transition on the image (the
 * cards' hover zoom), and only the fade-in animates. The placeholder is
 * dropped once the image settles, and kept if it fails to load.
 */
function BlurrableImage({
	img,
	blurDataUrl,
	...rest
}: {
	img: React.ReactElement<Omit<React.ComponentProps<'img'>, 'ref'>>
	blurDataUrl?: string
} & React.HTMLAttributes<HTMLDivElement>) {
	const imgRef = React.useRef<HTMLImageElement>(null)
	const [state, setState] = React.useState<LoadState>('idle')

	React.useEffect(() => {
		const el = imgRef.current
		if (!el) return
		if (el.complete) {
			setState(el.naturalWidth > 0 ? 'settled' : 'failed')
			return
		}

		const painting = el.naturalWidth > 0
		if (!painting) setState('loading')
		const fadeIn =
			!painting &&
			!window.matchMedia('(prefers-reduced-motion: reduce)').matches

		// First outcome only: a later srcset swap fires `load` again.
		const listeners = new AbortController()
		const options = { signal: listeners.signal }
		el.addEventListener(
			'load',
			() => {
				listeners.abort()
				setState(fadeIn ? 'loaded' : 'settled')
			},
			options,
		)
		el.addEventListener(
			'error',
			() => {
				listeners.abort()
				setState('failed')
			},
			options,
		)
		return () => listeners.abort()
	}, [])

	React.useEffect(() => {
		if (state !== 'loaded') return
		const timer = setTimeout(() => setState('settled'), DURATION_SLOW * 1000)
		return () => clearTimeout(timer)
	}, [state])

	return (
		<div {...rest} className={clsxm(rest.className, 'relative')}>
			{blurDataUrl && state !== 'settled' ? (
				<div
					data-blur-placeholder=""
					aria-hidden
					className="pointer-events-none absolute inset-0"
				>
					<img
						key={blurDataUrl}
						src={blurDataUrl}
						alt=""
						className="h-full w-full rounded-lg object-cover object-center"
					/>
					<div className="absolute inset-0 rounded-lg backdrop-blur-xl" />
				</div>
			) : null}
			<div
				className={clsxm(
					'relative',
					(state === 'loading' || state === 'failed') && 'opacity-0',
					state === 'loaded' &&
						'transition-opacity duration-(--duration-slow) ease-out-quart',
				)}
			>
				{React.cloneElement(
					img as React.ReactElement<React.ComponentProps<'img'>>,
					{ ref: imgRef },
				)}
			</div>
		</div>
	)
}

export { BlurrableImage }
