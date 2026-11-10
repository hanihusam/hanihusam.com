import { resumeEducation } from './content'
import { ResumeRow } from './resume-row'
import { ResumeSection } from './resume-section'

export function EducationSection() {
	return (
		<ResumeSection number="04" title="Education">
			<div>
				<ResumeRow title={resumeEducation.title} dates={resumeEducation.year}>
					<p>{resumeEducation.school}</p>
				</ResumeRow>
			</div>
		</ResumeSection>
	)
}
