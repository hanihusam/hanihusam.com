import { Grid } from '@/components/grid'
import { H2, Text } from '@/components/typography'
import { ButtonLink } from '@/components/ui/button'
import { DotGrid } from '@/components/ui/dot-grid'

import { ArrowRightIcon } from '@phosphor-icons/react'

export function AboutCta() {
	return (
		<Grid as="section" className="py-20 md:py-16 lg:py-20">
			<DotGrid
				color="sunset"
				rows={6}
				cols={7}
				className="absolute top-8 right-[2%] hidden md:block"
			/>
			<DotGrid
				color="sky"
				rows={5}
				cols={5}
				className="absolute bottom-2 left-[14%] hidden md:block"
			/>

			<div className="col-span-full mx-auto flex w-full max-w-(--container-site) flex-col items-center gap-6 text-center">
				<div className="flex w-full flex-col gap-2">
					<H2 className="text-4xl leading-(--h2-leading-desktop)">
						Want to work together?
					</H2>
					<Text
						variant="lead"
						as="p"
						className="font-medium text-(--text-paragraph)"
					>
						Take a look at my work, or tell me what you’re building.
					</Text>
				</div>
				<div className="flex flex-wrap items-start justify-center gap-4">
					<ButtonLink
						to="/works"
						iconRight={<ArrowRightIcon className="size-4" aria-hidden />}
					>
						View my work
					</ButtonLink>
					<ButtonLink
						href="mailto:me@hanihusam.com?subject=Project%20inquiry"
						variant="ghost"
						data-umami-event="about-inquiry-click"
						data-umami-event-page="about"
						className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--text-link)"
					>
						Let’s talk
					</ButtonLink>
				</div>
			</div>
		</Grid>
	)
}
