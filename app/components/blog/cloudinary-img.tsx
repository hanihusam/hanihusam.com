import { getImageBuilder, getImgProps } from '@/utils/images'

function CloudinaryImg({
	cloudinaryId,
	imgProps,
	transparentBackground,
}: {
	cloudinaryId: string
	imgProps: JSX.IntrinsicElements['img']
	transparentBackground?: boolean
}) {
	return (
		<img
			className="w-full rounded-lg object-cover py-8"
			{...getImgProps(getImageBuilder(cloudinaryId, imgProps.alt), {
				widths: [350, 550, 700, 845, 1250, 1700, 2550],
				sizes: [
					'(max-width:1023px) 80vw',
					'(min-width:1024px) and (max-width:1620px) 50vw',
					'850px',
				],
				transformations: {
					background: transparentBackground ? undefined : 'rgb:e6e9ee',
				},
			})}
			{...imgProps}
		/>
	)
}

export { CloudinaryImg }
