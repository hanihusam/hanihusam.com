// Copy v3.3, overlap hours v3.5 (Marketing, approved 2026-11-10). Ranges use
// en dashes.

export type ResumeVariant = 'site' | 'upwork'

export const RESUME_EMAIL_HREF = 'mailto:me@hanihusam.com'
export const RESUME_PDF_HREF = '/resume.pdf'
export const RESUME_PDF_FILENAME = 'Hani-Husamuddin-Resume.pdf'
export const FREELANDECK_COMMUNITY_HREF =
	'https://www.figma.com/community/file/1016698474340633848'

export const resumeFacts = (variant: ResumeVariant) => [
	{ label: 'Role', value: 'Frontend & UI Engineer' },
	{
		label: 'Open to',
		value:
			variant === 'upwork'
				? 'Contract work here on Upwork'
				: 'Remote full-time and contract roles',
	},
	{ label: 'Based in', value: 'Yogyakarta, Indonesia (UTC+7)' },
]

/**
 * The fourth fact (copy note v3.5). The page ships the fixed text (no JS,
 * search engines); before first paint it switches once to the hours that fit
 * the visitor's own working day, with the note for that case.
 */
export const resumeOverlapHours = {
	fixed: {
		label: 'Overlap hours',
		value: 'With Asia, Europe or the US',
		note: 'Asia: 09:00–17:00 UTC+7. Europe: 13:00–16:00 UTC. US: 19:00–21:00 UTC.',
	},
	local: {
		label: 'Overlap hours (your time)',
		notes: {
			day: 'During my normal working day.',
			one: 'Kept free for your team.',
			two: 'I keep the one that fits the team.',
		},
	},
}

export const resumeHighlights = [
	'Improved LCP and load times by about 30–40% on production web apps.',
	'Led and architected a production React app’s frontend for nearly four years, fully remote.',
	'Turned Figma design systems into production components, with less rework between design and dev.',
]

export const resumeRoles = [
	{
		title: 'Senior Frontend Engineer, Insvire',
		dates: 'Apr 2022 – Feb 2026',
		location: 'Remote (Bandung, Indonesia)',
		description:
			'Led the frontend of Curious Me, a location-based anonymous social platform, across the app, the marketing site and the admin dashboard.',
		bullets: [
			'Architected the whole frontend and shipped the production app with React Router, Apollo Client and Firebase.',
			'Led the frontend team to ship consistently, without slipping on code quality or performance.',
			'Resolved UI performance bottlenecks together with the backend, QA and product teams.',
			'Owned technical decisions and design implementation, and kept release cycles on track.',
		],
	},
	{
		title: 'Senior Frontend Engineer, Know Your Customer',
		dates: 'Sep 2021 – Jan 2022',
		location: 'Remote (Hong Kong)',
		description:
			'A KYC platform that helps financial institutions verify customers and meet compliance rules.',
		bullets: [
			'Rebuilt core KYC products for their next version, with a faster, more compliant identity check.',
			'Worked with engineers, UI designers and business analysts to match the frontend to new UX and business requirements.',
			'Cleared frontend blockers through the rebuild, so the upgrade shipped on time.',
		],
	},
	{
		title: 'UI Engineer, Currinda',
		dates: 'Oct 2020 – Aug 2021',
		location: 'Remote (Melbourne, Australia)',
		description:
			'A cloud platform that runs registrations, submissions and memberships for conference organizers.',
		bullets: [
			'Designed brand-consistent interfaces that improved the product experience across the platform.',
			'Built reusable React components and a design system, for visual consistency and faster frontend work.',
			'Bridged design and code for a 4-person engineering team, and cut the back-and-forth between them.',
		],
	},
]

export const resumeProduct = {
	title: 'Coverse Studio',
	dates: '2021 – Present',
	location: 'Remote',
	description:
		'I design and build templates that help freelancers and job seekers win work: pitch decks, proposals and resumes.',
	// The first bullet is composed in OwnProductsSection (underline mark, link).
	bullets: [
		'I design and build each product myself: the Figma files and their variables (Freelandeck Premium switches between Light and Dark), the custom landing pages, and the code that generates CV Pro’s Word, Pages and PDF files.',
		'CV Pro, my resume template: an open-source resume parser (OpenResume) read every field of its six one-page examples.',
	],
}

export const resumeSkills = [
	{
		title: 'Frontend performance',
		description:
			'Find real-world bottlenecks; optimize rendering, hydration and asset delivery; improve Web Vitals with measured results.',
	},
	{
		title: 'UI engineering & design systems',
		description:
			'Turn Figma design systems into production components; build reusable, token-based patterns; reduce design–code mismatch.',
		keys: { label: 'Tools', items: ['Figma', 'Storybook'] },
	},
	{
		title: 'Frontend engineering',
		description:
			'Scalable React apps with clean architecture, strict TypeScript, and modern routing and data handling.',
		keys: {
			label: 'Stack',
			items: ['React', 'TypeScript', 'React Router', 'Tailwind CSS', 'GraphQL'],
		},
	},
	{
		title: 'Product & execution',
		description:
			'Turn unclear requirements into shippable features, make pragmatic trade-offs, and own features from planning to production.',
	},
]

export const resumeEducation = {
	title: 'Bachelor’s Degree in Computer Science',
	school: 'Universitas Pembangunan Nasional “Veteran” Yogyakarta',
	year: '2019',
}
