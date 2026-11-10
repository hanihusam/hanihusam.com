import { ArrowDownIcon } from '@phosphor-icons/react'

import ArrowRightIcon from '@/assets/arrow-right-icon'
import { ButtonLink } from '@/components/ui/button'
import { clsxm } from '@/utils/clsxm'

import {
	RESUME_EMAIL_HREF,
	RESUME_PDF_FILENAME,
	RESUME_PDF_HREF,
	resumeFacts,
	type ResumeVariant,
} from './content'
import { HandMark } from './hand-mark'
import { OverlapFact } from './overlap-fact'
import { ResumeFact } from './resume-fact'
import { resumeHandClass } from './styles'

export function ResumeHeader({ variant }: { variant: ResumeVariant }) {
	return (
		<header className="flex flex-col gap-8 pt-32 pb-12 md:gap-12 md:pt-20 md:pb-20 lg:pt-32">
			<dl className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
				{resumeFacts(variant).map((fact) => (
					<ResumeFact key={fact.label} {...fact} />
				))}
				<OverlapFact />
			</dl>

			<div className="flex flex-col gap-6">
				{/* The name scales with the viewport so "Husamuddin." always fits on
				    one line, and grows 52 → ~93px from 402 to 639px so there's no
				    jump at md. The note and arrow are placed in em of that size, so
				    they stay beside "Hani" at every width. Below 402px the arrow
				    shortens and the note shrinks with the screen to stay 12px+ clear
				    of the right hairline. */}
				<div className="relative text-[length:min(52px,calc((100vw_-_64px)/6.2))] min-[402px]:text-[length:min(calc(18.57vw_-_22.6px),calc((100vw_-_64px)/6.2))] md:text-[length:min(120px,calc((100vw_-_64px)/6))] lg:text-[length:min(160px,calc((100vw_-_64px)/6))]">
					<h1 className="leading-[0.92] font-black tracking-[-0.03em] text-(--text-title-primary) md:leading-[0.88] md:tracking-[-0.04em]">
						<span className="block">Hani</span>{' '}
						<span className="block">
							Husamuddin<span className="text-(--text-title-secondary)">.</span>
						</span>
					</h1>
					<HandMark
						name="arrowToNameMobile"
						trigger="load"
						delay="calc(var(--duration-slow) * 3)"
						className="top-[0.2em] left-[2.19em] h-[0.385em] w-[0.77em] max-[402px]:h-[0.3em] max-[402px]:w-[0.6em] md:hidden"
					/>
					<HandMark
						name="arrowToName"
						trigger="load"
						delay="calc(var(--duration-slow) * 3)"
						className="hidden md:top-[0.264em] md:left-[2.275em] md:block md:h-[0.4em] md:w-[0.8em] lg:left-[2.2625em] lg:h-[0.375em] lg:w-[0.75em]"
					/>
					<p className="absolute top-[0.135em] left-[2.92em] max-[402px]:left-[2.76em] md:top-[0.233em] md:left-[3.175em] lg:top-[0.219em] lg:left-[3.056em]">
						<span
							className={clsxm(
								resumeHandClass,
								'block rotate-4 text-[19px] max-[402px]:text-[length:min(19px,calc(5.6vw_-_3px))] min-[402px]:text-[length:calc(2.954vw_+_7.13px)] md:text-[26px] lg:text-[30px] leading-[1.1]',
							)}
						>
							<span className="block animate-[handWrite_calc(var(--duration-base)*2)_linear_var(--duration-base)_backwards] motion-reduce:animate-none">
								engineer who designs,
							</span>{' '}
							<span className="block animate-[handWrite_calc(var(--duration-base)*2)_linear_calc(var(--duration-base)*3)_backwards] motion-reduce:animate-none">
								designer who ships
							</span>
						</span>
					</p>
				</div>
				<p className="max-w-160 text-lg leading-(--lead-leading) font-medium text-(--text-lead)">
					I build product interfaces in React and TypeScript, from Figma to
					production.
				</p>
			</div>

			{variant === 'site' ? (
				<div className="flex flex-wrap items-start gap-3">
					<ButtonLink
						href={RESUME_EMAIL_HREF}
						data-umami-event="resume-email-click"
						data-umami-event-place="header"
					>
						Email me
					</ButtonLink>
					<div className="relative">
						<ButtonLink
							href={RESUME_PDF_HREF}
							download={RESUME_PDF_FILENAME}
							variant="secondary"
							iconRight={<ArrowDownIcon aria-hidden />}
							data-umami-event="resume-pdf-click"
							data-umami-event-place="header"
						>
							Download PDF
						</ButtonLink>
						<HandMark
							name="arrowToPdf"
							trigger="load"
							delay="calc(var(--duration-slower) * 3)"
							className="top-[50px] left-[37px] h-8 w-10 md:top-[52px] md:left-[76px]"
						/>
						<p
							className={clsxm(
								resumeHandClass,
								'absolute top-[77px] left-[72px] rotate-3 text-[20px] md:top-16 md:left-30 md:text-[24px] lg:text-[26px] leading-[1.1]',
								'animate-[handWrite_calc(var(--duration-base)*2)_linear_calc(var(--duration-slower)*2_+_var(--duration-base))_backwards] motion-reduce:animate-none',
							)}
						>
							one page, A4
						</p>
					</div>
					<ButtonLink
						to="/works"
						variant="ghost"
						iconRight={<ArrowRightIcon aria-hidden />}
						className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--text-link)"
					>
						See projects
					</ButtonLink>
				</div>
			) : null}
		</header>
	)
}
