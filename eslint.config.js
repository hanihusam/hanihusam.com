import { config as defaultConfig } from '@epic-web/config/eslint'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'

/** @type {import("eslint").Linter.Config} */
export default [
	...defaultConfig,
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
			'unused-imports': unusedImports,
		},
		rules: {
			'react-hooks/exhaustive-deps': 'off', // we don't want to enforce this
			'@typescript-eslint/no-floating-promises': 'off', // we don't want to enforce this

			'jsx-a11y/alt-text': 'off', // it's not smart enough
			'jsx-a11y/media-has-caption': 'off',
			'jsx-a11y/click-events-have-key-events': 'off', // remove warning on div element click

			// this one isn't smart enough for our "@/" imports
			'import/order': 'off',

			// some of our codes are quite complex
			complexity: 'off',

			'sort-imports': 'off',
			'simple-import-sort/exports': 'error',
			'simple-import-sort/imports': [
				'error',
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
