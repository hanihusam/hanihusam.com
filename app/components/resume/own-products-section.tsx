import {
	FREELANDECK_COMMUNITY_HREF,
	resumeProduct,
	type ResumeVariant,
} from './content'
import { HandMark } from './hand-mark'
import { ResumeBullets } from './resume-bullets'
import { ResumeRow } from './resume-row'
import { ResumeSection } from './resume-section'

export function OwnProductsSection({ variant }: { variant: ResumeVariant }) {
	return (
		<ResumeSection number="02" title="Own products">
			<ResumeRow
				title={resumeProduct.title}
				dates={resumeProduct.dates}
				location={resumeProduct.location}
			>
				<p>{resumeProduct.description}</p>
				<ResumeBullets>
					<li>
						Freelandeck, my client pitch deck template, is used by{' '}
						<span className="relative inline-block whitespace-nowrap">
							55,000+ people
							<HandMark
								name="underline"
								className="top-[17px] -left-px h-2.5 w-[calc(100%+8px)]"
							/>
						</span>{' '}
						on{' '}
						{variant === 'site' ? (
							<a
								href={FREELANDECK_COMMUNITY_HREF}
								target="_blank"
								rel="noreferrer"
								className="rounded-sm text-(--text-link) underline decoration-(--text-caption) underline-offset-[3px] transition-colors hover:decoration-(--text-link) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--text-link)"
							>
								Figma Community
							</a>
						) : (
							'Figma Community'
						)}
						.
					</li>
					{resumeProduct.bullets.map((bullet) => (
						<li key={bullet}>{bullet}</li>
					))}
				</ResumeBullets>
			</ResumeRow>
		</ResumeSection>
	)
}
