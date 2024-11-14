import { Grid } from '@/components/grid'
import { H1, H5 } from '@/components/typography'

interface BlogTitle {
	title: string
	blogInfo: string
}

export function BlogTitle({ title, blogInfo }: BlogTitle) {
	return (
		<Grid>
			<div className="col-span-full flex flex-col space-y-4 self-stretch">
				<H1>{title}</H1>
				<H5 variant="secondary">{blogInfo}</H5>
			</div>
		</Grid>
	)
}
