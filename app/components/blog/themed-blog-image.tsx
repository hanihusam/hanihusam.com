import { Themed } from '@/utils/theme'

import { CloudinaryImg } from './cloudinary-img'

function ThemedBlogImage({
	darkCloudinaryId,
	lightCloudinaryId,
	imgProps,
	transparentBackground,
}: {
	darkCloudinaryId: string
	lightCloudinaryId: string
	imgProps: React.ComponentPropsWithoutRef<'img'>
	transparentBackground?: boolean
}) {
	return (
		<Themed
			light={
				<CloudinaryImg
					cloudinaryId={lightCloudinaryId}
					imgProps={imgProps}
					transparentBackground={transparentBackground}
				/>
			}
			dark={
				<CloudinaryImg
					cloudinaryId={darkCloudinaryId}
					imgProps={imgProps}
					transparentBackground={transparentBackground}
				/>
			}
		/>
	)
}

export { ThemedBlogImage }
