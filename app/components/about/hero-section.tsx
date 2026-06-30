import { Grid } from '@/components/grid'
import { Display, Text } from '@/components/typography'
import { DotGrid } from '@/components/ui/dot-grid'

export function AboutHero() {
	return (
		<Grid as="section" className="relative pt-40 md:pb-16 lg:pb-20">
			<DotGrid
				color="sunset"
				rows={9}
				cols={7}
				className="absolute top-0 right-0 hidden lg:block"
			/>

			<div className="relative col-span-full flex h-[82vh] items-end md:h-auto">
				{/* Floating cutout avatar over a tinted square */}
				<div className="absolute top-0 right-0 flex aspect-square w-100 translate-x-[28%] -translate-y-1/3 items-center justify-center overflow-visible rounded-2xl border-(--border-primary) bg-sky-50 md:translate-x-[40%] md:translate-y-0 lg:translate-x-0 dark:bg-sky-900">
					<img
						src="/images/avatar-side.png"
						alt="Portrait of Han"
						width={512}
						height={512}
						className="absolute top-1/2 left-1/2 flex max-w-none shrink-0 -translate-x-1/2 -translate-y-1/2"
					/>
				</div>

				<div className="relative z-1 flex flex-col gap-6 md:gap-12">
					<Display>Hi there! I&apos;m Han.</Display>

					<div className="flex flex-col gap-4 md:max-w-[60%]">
						<Text variant="lead" as="p">
							I started building on the web in 2018 and haven&apos;t stopped
							since.
						</Text>
						<Text variant="lead" as="p">
							I&apos;ve worked as a frontend engineer and UI designer across
							companies and industries, leading frontend teams, building design
							systems, and shipping production interfaces for clients from all
							over the world.
						</Text>
						<Text variant="lead" as="p">
							Besides freelancing, I&apos;m building{' '}
							<a
								href="https://coverse.id"
								className="text-sunset-400 font-medium hover:underline"
							>
								Coverse
							</a>
							, a studio specializing in layout and deck templates, from
							Yogyakarta, Indonesia.
						</Text>
					</div>
				</div>
			</div>
		</Grid>
	)
}
