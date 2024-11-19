import { Grid } from '@/components/grid'
import { Header } from '@/components/header'
import { H4, H5, Paragraph } from '@/components/typography'

import { ComputerDesktopIcon, PaintBrushIcon } from '@heroicons/react/24/solid'

export function ServicesSection() {
	return (
		<Grid rowGap>
			<div className="col-span-full row-start-1 flex flex-col space-y-8 lg:col-span-6 lg:col-start-1">
				<Header
					title="Best solution to boost your project and business"
					subTitle="Service"
					nested
				/>

				<div className="flex flex-col space-y-2 self-stretch">
					<Paragraph>
						Are you a professional who needs an attractive website for your
						business or service? Does your current website looks like it
						&quot;old-fashioned&quot;? Is it not mobile responsive? It
						doesn&apos;t have a modern look and optimal user experience across
						various devices, and browsers?
					</Paragraph>
					<H5 className="text-dark dark:text-light">
						Well, you&apos;re in the right place.
					</H5>
				</div>
			</div>

			<div className="col-span-full grid grid-cols-6 gap-8 md:gap-10 lg:col-span-6 lg:col-start-7">
				<div className="col-span-full lg:col-span-3">
					<div className="relative h-full w-full pt-10">
						<ComputerDesktopIcon className="absolute left-8 top-0 z-[1] h-20 w-20 text-secondary-500 dark:text-primary-500" />
						<div className="relative flex h-full w-full flex-col space-y-2.5 rounded-xl bg-white px-8 pb-8 pt-16 dark:bg-black">
							<div className="flex flex-col space-y-6 self-stretch">
								<H4 variant="secondary">Frontend Web Developer</H4>
								<Paragraph>
									Details in the code and verbose documentation. I guaranteed
									free session until you can run my code on your system.
								</Paragraph>
							</div>
						</div>
					</div>
				</div>

				<div className="col-span-full lg:col-span-3">
					<div className="relative h-full w-full pt-10">
						<PaintBrushIcon className="absolute left-8 top-0 z-[1] h-20 w-20 text-secondary-500 dark:text-primary-500" />
						<div className="relative flex h-full w-full flex-col space-y-2.5 rounded-xl bg-white px-8 pb-8 pt-16 dark:bg-black">
							<div className="flex flex-col space-y-6 self-stretch">
								<H4 variant="secondary">User Interface Designer</H4>
								<Paragraph>
									I look at every UI design project as a process in solving a
									problem. I am considering all the aspects until the UI design
									is “work”.
								</Paragraph>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Grid>
	)
}
