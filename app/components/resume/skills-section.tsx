import { resumeSkills } from './content'
import { ResumeKeys } from './resume-keys'
import { ResumeSection } from './resume-section'
import { resumeBodyClass, resumeTitleClass } from './styles'

export function SkillsSection() {
	return (
		<ResumeSection number="03" title="Skills" className="gap-8">
			<div className="grid gap-6 md:grid-cols-2">
				{resumeSkills.map((skill) => (
					<div
						key={skill.title}
						className="flex flex-col gap-3 border-t border-(--border-default) pt-6"
					>
						<h3 className={resumeTitleClass}>{skill.title}</h3>
						<p className={resumeBodyClass}>{skill.description}</p>
						{skill.keys ? (
							<ResumeKeys label={skill.keys.label} items={skill.keys.items} />
						) : null}
					</div>
				))}
			</div>
		</ResumeSection>
	)
}
