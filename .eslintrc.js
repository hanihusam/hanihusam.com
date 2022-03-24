module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:@next/next/recommended'],
  plugins: ['prettier', 'simple-import-sort', 'unused-imports'],
  rules: {
    '@babel/new-cap': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-unused-vars': 'off',
    'no-unused-private-class-members': 'off',
    'prefer-object-has-own': 'off',
    'no-console': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/display-name': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'react/react-in-jsx-scope': ['off'],

    //#region  //*=========== Unused Import ===========
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ],
    //#endregion  //*======== Unused Import ===========

    //#region  //*=========== Import Sort ===========
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // ext library & side effect imports
          ['^@?\\w', '^\\u0000'],
          // {s}css files
          ['^.+\\.s?css$'],
          // Lib and hooks
          ['^@/lib', '^@/hooks'],
          // static data
          ['^@/data'],
          // components
          ['^@/components', '^@/container'],
          // zustand store
          ['^@/store'],
          // Other imports
          ['^@/'],
          // relative paths up until 3 level
          [
            '^\\./?$',
            '^\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\./\\.\\.(?!/?$)'
          ],
          ['^@/types'],
          // other that didnt fit in
          ['^']
        ]
      }
    ]
    //#endregion  //*======== Import Sort ===========
  },
  globals: {
    React: true,
    JSX: true
  }
}
