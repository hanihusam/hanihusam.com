import { resumeRoles } from './content'
import { ResumeBullets } from './resume-bullets'
import { ResumeRow } from './resume-row'
import { ResumeSection } from './resume-section'

export function ExperienceSection() {
	return (
		<ResumeSection number="01" title="Experience">
			<div>
				{resumeRoles.map((role) => (
					<ResumeRow
						key={role.title}
						title={role.title}
						dates={role.dates}
						location={role.location}
					>
						<p>{role.description}</p>
						<ResumeBullets>
							{role.bullets.map((bullet) => (
								<li key={bullet}>{bullet}</li>
							))}
						</ResumeBullets>
					</ResumeRow>
				))}
			</div>
		</ResumeSection>
	)
}
