import { config as defaultConfig } from '@epic-web/config/eslint'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const vitestFiles = ['app/**/__tests__/**/*', 'app/**/*.{spec,test}.*']
const testFiles = ['**/tests/**', ...vitestFiles]
const appFiles = ['app/**']

export default [
	...defaultConfig,
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'no-console': 'off',
			'@typescript-eslint/no-floating-promises': 'off', // we don't want to enforce this

			'jsx-a11y/alt-text': 'off', // it's not smart enough
			'jsx-a11y/media-has-caption': 'off',
			'no-unused-private-class-members': 'off',
			'prefer-object-has-own': 'off',
			'import/newline-after-import': 'warn',
			'simple-import-sort/exports': 'warn',

			// this one isn't smart enough for our "@/" imports
			'import/order': 'off',

			'sort-imports': 'off',
			'simple-import-sort/imports': [
				'warn',
				{
					groups: [
						['^.+\\.s?css$'],
						['^\\u0000'],
						['^react$', '^react-dom$'],
						['^~', '^@/'],
						['^\\.\\.(?!/?$)', '^\\.\\./?$'],
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
					],
				},
			],
		},
	},
]
