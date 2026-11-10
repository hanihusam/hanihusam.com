import resumeFonts from '@/styles/resume-fonts.css?url'

import { type LinkDescriptor } from 'react-router'

export const RESUME_TITLE = 'Hani Husamuddin — Frontend & UI Engineer'
/** The share card shows Han's name in its author row, so its title is just the role. */
export const RESUME_CARD_TITLE = 'Frontend & UI Engineer'
export const RESUME_DESCRIPTION =
	'Frontend & UI Engineer in Yogyakarta, open to remote full-time and contract roles. React, TypeScript, web performance and design systems.'

/** JetBrains Mono and the handwriting face load on the /resume routes only. */
export function resumeLinks(): LinkDescriptor[] {
	return [
		{
			rel: 'preload',
			as: 'font',
			href: '/fonts/JetBrainsMono-Regular.woff2',
			type: 'font/woff2',
			crossOrigin: 'anonymous',
		},
		{
			rel: 'preload',
			as: 'font',
			href: '/fonts/NothingYouCouldDo-Regular.woff2',
			type: 'font/woff2',
			crossOrigin: 'anonymous',
		},
		{ rel: 'stylesheet', href: resumeFonts },
	]
}
