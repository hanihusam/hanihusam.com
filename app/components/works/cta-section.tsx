import { Grid } from '@/components/grid'
import { H2, Text } from '@/components/typography'
import { ButtonLink } from '@/components/ui/button'
import { DotGrid } from '@/components/ui/dot-grid'

export function CallToAction() {
	return (
		<Grid as="section" className="py-20">
			<DotGrid
				color="sunset"
				rows={6}
				cols={7}
				className="absolute top-8 right-[2%] hidden lg:block"
			/>
			<DotGrid
				color="sky"
				rows={5}
				cols={5}
				className="absolute bottom-2 left-[8%] md:left-[14%]"
			/>

			<div className="col-span-full flex flex-col items-center gap-8 text-center">
				<div className="flex flex-col gap-4">
					<H2>Have a project in mind?</H2>
					<Text variant="lead" as="p">
						I'm available for freelance and contract work.
						<br />
						Let's build something together.
					</Text>
				</div>
				<ButtonLink href="mailto:me@hanihusam.com">Let's Talk</ButtonLink>
			</div>
		</Grid>
	)
}
