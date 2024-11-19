import { Button } from '@/components/button'
import { Grid } from '@/components/grid'
import { AnchorOrLink } from '@/components/links/anchor-or-link'
import { H3, Paragraph } from '@/components/typography'
import { externalLinks } from '@/external-links'

import logo from '../../public/images/hnh-logo.png'

export default function Links() {
	return (
		<Grid featured>
			<div className="col-span-4 flex flex-col gap-8 lg:col-start-5">
				<div className="flex flex-col items-center space-y-5">
					<img alt="HNH logo" className="h-16 w-16" src={logo} />
					<div className="flex flex-col space-y-2 text-center">
						<H3 className="text-secondary-500 dark:text-light">bapak2dev</H3>
						<Paragraph>
							Fulltime at home. Sometimes push code, sometimes push pixels
						</Paragraph>
					</div>
				</div>
				<div className="flex flex-col gap-5">
					<AnchorOrLink href={externalLinks.telegram}>
						<Button block>Business Inquiry</Button>
					</AnchorOrLink>
					<AnchorOrLink href={externalLinks.pitcDeckFigma}>
						<Button block>Free | Pitch Deck for Freelancer</Button>
					</AnchorOrLink>
					<AnchorOrLink href={externalLinks.linkedin}>
						<Button block>Professional Profile</Button>
					</AnchorOrLink>
					<AnchorOrLink href={externalLinks.github}>
						<Button block>Github Repository</Button>
					</AnchorOrLink>
					<AnchorOrLink href={externalLinks.dribbble}>
						<Button block>Design Showcase</Button>
					</AnchorOrLink>
				</div>
			</div>
		</Grid>
	)
}
