import { type ResumeVariant } from './content'
import { EducationSection } from './education-section'
import { ExperienceSection } from './experience-section'
import { Hairlines } from './hairlines'
import { OwnProductsSection } from './own-products-section'
import { ResumeClosing } from './resume-closing'
import { ResumeHeader } from './resume-header'
import { ResumeHighlights } from './resume-highlights'
import { SkillsSection } from './skills-section'

/**
 * Han's resume, on the paper theme. `site` is /resume; `upwork` is the
 * contact-free copy for Upwork proposals: no buttons, PDF, email, footer or
 * outbound links (Upwork's terms).
 */
export function ResumePage({ variant }: { variant: ResumeVariant }) {
	return (
		<>
			<Hairlines />
			<div className="relative w-full px-8">
				<main className="mx-auto w-full max-w-(--container-site)">
					<ResumeHeader variant={variant} />
					<ResumeHighlights />
					<ExperienceSection />
					<OwnProductsSection variant={variant} />
					<SkillsSection />
					<EducationSection />
					<ResumeClosing variant={variant} />
				</main>
			</div>
			{variant === 'site' ? <div aria-hidden className="h-20" /> : null}
		</>
	)
}
