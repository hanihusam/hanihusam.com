import { Grid } from '@/components/grid'
import { H2, Text } from '@/components/typography'
import { ButtonLink } from '@/components/ui/button'
import { DotGrid } from '@/components/ui/dot-grid'
import { clsxm } from '@/utils/clsxm'

interface CallToActionProps {
	page: 'home' | 'works'
}

export function CallToAction({ page }: CallToActionProps) {
	return (
		<Grid
			as="section"
			className={clsxm({
				'py-16 lg:py-20': page === 'home',
				'py-20': page === 'works',
			})}
		>
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

			<div
				className={clsxm(
					'col-span-full flex flex-col items-center text-center',
					{
						'gap-6': page === 'home',
						'gap-8': page === 'works',
					},
				)}
			>
				<div
					className={clsxm('flex flex-col', {
						'gap-2': page === 'home',
						'gap-4': page === 'works',
					})}
				>
					<H2>Have a project in mind?</H2>
					<Text variant="lead" as="p">
						{page === 'works' ? (
							<>
								I'm available for freelance and contract work.
								<br />
							</>
						) : null}
						Tell me what you're building and where you could use a hand.
					</Text>
				</div>
				<ButtonLink
					href="mailto:me@hanihusam.com?subject=Project%20inquiry"
					data-umami-event="lets-talk-click"
					data-umami-event-page={page}
				>
					Let's Talk
				</ButtonLink>
			</div>
		</Grid>
	)
}
