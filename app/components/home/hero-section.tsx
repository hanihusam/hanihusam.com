import { Grid } from '@/components/grid'
import { AnchorOrLink } from '@/components/links/anchor-or-link'
import { Display, H3, Paragraph, Text } from '@/components/typography'
import { ButtonLink, LinkButton } from '@/components/ui/button'
import Logo from '@/components/ui/logo'
import { getImageBuilder, getImgProps } from '@/utils/images'

import { ArrowCircleRightIcon, ArrowDownIcon } from '@phosphor-icons/react'

export function HeroSection() {
	return (
		<div className="bg-(--surface-primary)">
			<Grid className="min-h-screen place-content-center pt-20">
				<Logo className="absolute top-8" />

				<img
					className="absolute top-0 right-0 hidden h-auto w-87.5 translate-x-[25%] translate-y-[20vh] md:top-auto md:right-auto md:bottom-0 md:left-0 md:block md:w-lg md:translate-x-[-16%] md:translate-y-0 lg:left-1/2 lg:w-3xl lg:-translate-x-1/2"
					{...getImgProps(
						getImageBuilder(
							'bapak2.dev/images/avatar-front_l3oexq',
							'Avatar of Han large',
						),
						{
							widths: [350, 512, 700, 768, 1024, 1536],
							sizes: [
								'(min-width: 1024px) 768px',
								'(min-width: 768px) 512px',
								'350px',
							],
						},
					)}
				/>

				<div className="col-span-full flex flex-col items-start gap-y-8 self-stretch md:h-[50vh] lg:flex-row lg:items-center">
					<div className="flex flex-col justify-end gap-y-8 lg:h-77.5">
						<Display>I'm Han</Display>
						<ButtonLink
							to="#projects"
							className="hidden self-start md:inline-flex"
							iconRight={<ArrowDownIcon />}
						>
							View My Works
						</ButtonLink>
					</div>
					<div className="flex w-full flex-col gap-y-4 md:ml-auto md:w-90 lg:w-100">
						<H3 className="text-(--text-paragraph)">
							A Frontend Engineer based in Yogyakarta, Indonesia.
						</H3>
						<Text variant="lead">
							Engineer who designs. Designer who ships. End to end, with the
							Figma files and commit history to prove it.
						</Text>
						<AnchorOrLink className="hidden md:inline-flex" to="about">
							<LinkButton className="relative inline-flex items-center justify-center gap-1 text-(--text-paragraph)">
								<Paragraph as="span">More about me</Paragraph>
								<ArrowCircleRightIcon className="size-5 shrink-0" />
							</LinkButton>
						</AnchorOrLink>
						<div className="flex w-full gap-x-2 md:hidden">
							<ButtonLink
								to="#projects"
								size="sm"
								iconRight={<ArrowDownIcon />}
							>
								View My Works
							</ButtonLink>
							<ButtonLink to="about" size="sm" variant="ghost">
								More about me
							</ButtonLink>
						</div>
					</div>
				</div>
			</Grid>
		</div>
	)
}
