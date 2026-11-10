import { useId } from 'react'

import { ButtonLink } from '@/components/ui/button'

import {
	RESUME_EMAIL_HREF,
	RESUME_PDF_FILENAME,
	RESUME_PDF_HREF,
	type ResumeVariant,
} from './content'
import { HandMark } from './hand-mark'
import { Signature } from './signature'

const headingClass =
	'text-4xl leading-(--h1-leading-mobile) font-black text-(--text-title-primary) md:text-5xl md:leading-(--h1-leading-desktop)'
const leadClass =
	'text-lg leading-(--lead-leading) font-medium text-(--text-paragraph)'

export function ResumeClosing({ variant }: { variant: ResumeVariant }) {
	const headingId = useId()

	return (
		<section aria-labelledby={headingId} className="py-20 md:py-16 lg:py-20">
			{variant === 'site' ? (
				<div className="flex flex-col gap-6 border-t-2 border-(--text-title-primary) pt-8">
					<div className="flex flex-col gap-2">
						<h2 id={headingId} className={headingClass}>
							Hiring for a remote frontend or UI role?
						</h2>
						<p className={leadClass}>
							Email me, or download the PDF. Every email about a role gets a
							reply from me. Sales pitches get a quiet archive.
						</p>
					</div>
					{/* From md up the signature sits beside the buttons without
					    growing the row, as in the frames. */}
					<div className="relative flex flex-wrap items-center gap-4">
						<div className="relative">
							<ButtonLink
								href={RESUME_EMAIL_HREF}
								data-umami-event="resume-email-click"
								data-umami-event-place="closing"
							>
								Email me
							</ButtonLink>
							<HandMark
								name="circle"
								className="-top-[13px] -left-3 h-[74px] w-32 md:-top-5 md:-left-[26px] md:h-[86px] md:w-[150px]"
							/>
						</div>
						<ButtonLink
							href={RESUME_PDF_HREF}
							download={RESUME_PDF_FILENAME}
							variant="secondary"
							data-umami-event="resume-pdf-click"
							data-umami-event-place="closing"
						>
							Download PDF
						</ButtonLink>
						<Signature className="basis-full pl-[122px] md:absolute md:-top-3 md:left-[313px] md:pl-0 lg:-top-[13px] lg:left-[306px]" />
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-2 border-t-2 border-(--text-title-primary) pt-8">
					<h2 id={headingId} className={headingClass}>
						Like what you see?
					</h2>
					<div className="relative flex flex-wrap gap-y-3">
						<p className={leadClass}>Let’s keep talking here on Upwork.</p>
						<Signature className="basis-full pl-[122px] md:absolute md:top-0.5 md:left-[330px] md:pl-0" />
					</div>
				</div>
			)}
		</section>
	)
}
