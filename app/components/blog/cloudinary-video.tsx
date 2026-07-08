import { getVideoBuilder, getVideoPosterUrl } from '@/utils/images'

function CloudinaryVideo({
	cloudinaryId,
	videoProps,
}: {
	cloudinaryId: string
	videoProps?: React.ComponentPropsWithoutRef<'video'>
}) {
	return (
		<video
			className="w-full rounded-lg object-cover py-8"
			autoPlay
			muted
			loop
			playsInline
			controls
			poster={getVideoPosterUrl(cloudinaryId, { quality: 'auto' })}
			{...videoProps}
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
