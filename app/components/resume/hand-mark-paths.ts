// Exported from Figma "Personal site | hanihusam" (Resume frames, v1.2), paths
// unchanged. Arrows list the shaft first, then the head.

export const HAND_MARKS = {
	arrowToName: {
		viewBox: '0 0 120 60',
		paths: ['M114 10C88 4 48 12 16 46', 'M18 30L16 46L32 41'],
	},
	arrowToNameMobile: {
		viewBox: '0 0 40 20',
		paths: [
			'M38 3.33333C29.3333 1.33333 16 4 5.33333 15.3333',
			'M6 10L5.33333 15.3333L10.6667 13.6667',
		],
	},
	arrowToPdf: {
		viewBox: '0 0 40 32',
		paths: ['M36 28C26 26 14 20 8 6', 'M7 18L8 6L19 10'],
	},
	underline: {
		viewBox: '0 0 120 10',
		paths: ['M1.5 6C22.5 2 46.5 9 69 4C88.5 0 106.5 8 118.5 3'],
	},
	circle: {
		viewBox: '0 0 150 86',
		paths: [
			'M23.5714 22.6316C25.0435 21.5951 26.663 20.6106 28.4123 19.6796M28.4123 19.6796C35.7444 15.7777 45.3566 12.8177 55.9463 10.9247M28.4123 19.6796C13.9037 26.929 6.42857 36.8329 6.42857 47.5263C6.42857 70.1579 45 84.8684 87.8571 80.3421C137.143 74.6842 156.429 43 141.429 24.8947C126.368 8.98907 86.964 5.37991 55.9463 10.9247M28.4123 19.6796C35.7907 15.993 44.988 12.9929 55.9463 10.9247M55.9463 10.9247C59.9237 10.174 64.1329 9.54607 68.5714 9.05263',
		],
	},
} as const

export type HandMarkName = keyof typeof HAND_MARKS
