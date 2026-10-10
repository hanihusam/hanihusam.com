import { externalLinks } from '@/external-links'
import { FooterLocation } from '@/components/footer-location'
import { Grid } from '@/components/grid'
import { AnchorOrLink } from '@/components/links/anchor-or-link'
import { Paragraph, Text } from '@/components/typography'
import Logo from '@/components/ui/logo'

const contacts = [
	{
		label: 'About',
		href: '/about',
	},
	{
		label: 'Mail',
		href: 'mailto:me@hanihusam.com',
	},
	{
		label: 'Upwork',
		href: externalLinks.upwork,
	},
	{
		label: 'Resume',
		href: externalLinks.cv,
	},
	{
		label: 'GitHub',
		href: externalLinks.github,
	},
	{
		label: 'LinkedIn',
		href: externalLinks.linkedin,
	},
]

export function Footer() {
	return (
		<Grid as="footer" className="gap-8">
			<div className="col-span-full mx-auto flex flex-col items-center gap-y-4 md:pb-12">
				<Logo className="w-8" />
				<div className="flex flex-wrap items-center justify-center gap-4">
					{contacts.map((contact) => (
						<AnchorOrLink
							key={contact.label}
							href={contact.href}
							className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--text-link)"
						>
							<Paragraph
								prose={false}
								className="transition-colors hover:text-(--text-link) focus:text-(--text-link)"
							>
								{contact.label}
							</Paragraph>
						</AnchorOrLink>
					))}
				</div>
			</div>
			<div className="col-span-full mb-8 flex flex-wrap justify-between gap-4">
				<Text variant="label">Keep calm and stay humble.</Text>
				<FooterLocation />
			</div>
		</Grid>
	)
}
