import { useEffect, useRef } from 'react'

import { getVideoBuilder, getVideoPosterUrl } from '@/utils/images'

function CloudinaryVideo({
	cloudinaryId,
	videoProps,
}: {
	cloudinaryId: string
	videoProps?: Omit<React.ComponentPropsWithoutRef<'video'>, 'autoPlay'>
}) {
	const videoRef = useRef<HTMLVideoElement>(null)

	// Autoplay from JS, never the `autoPlay` attribute: the server can't know the
	// reader's motion preference, and the attribute starts playback before
	// hydration. This also stands in for the attribute's viewport gating: play
	// only while on screen, and only playback this effect started. Once the
	// reader pauses (even before hydration), they're in charge and it lets go.
	useEffect(() => {
		const video = videoRef.current
		if (!video) return
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
		let managed = video.played.length === 0
		let pausingForViewport = false

		const pause = () => {
			if (video.paused) return
			pausingForViewport = true
			video.pause()
		}
		const onPause = () => {
			if (!pausingForViewport) managed = false
			pausingForViewport = false
		}
		const observer = new IntersectionObserver(([entry]) => {
			if (!managed) return
			if (entry?.isIntersecting && !reduce.matches) {
				video.play().catch(() => {})
			} else {
				pause()
			}
		})
		const onReduceChange = () => {
			if (reduce.matches && managed) pause()
		}

		video.addEventListener('pause', onPause)
		reduce.addEventListener('change', onReduceChange)
		observer.observe(video)
		return () => {
			observer.disconnect()
			reduce.removeEventListener('change', onReduceChange)
			video.removeEventListener('pause', onPause)
		}
	}, [])

	return (
		<video
			ref={videoRef}
			className="w-full rounded-lg object-cover py-8"
			muted
			loop
			playsInline
			controls
			poster={getVideoPosterUrl(cloudinaryId, { quality: 'auto' })}
			{...videoProps}
			autoPlay={false}
		>
			<source
				src={getVideoBuilder(cloudinaryId)({
					quality: 'auto',
					format: 'auto',
				})}
			/>
		</video>
	)
}

export { CloudinaryVideo }
