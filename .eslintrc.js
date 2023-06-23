const vitestFiles = ["app/**/__tests__/**/*", "app/**/*.{spec,test}.*"];
const testFiles = ["**/tests/**", ...vitestFiles];
const appFiles = ["app/**"];

/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "prettier",
  ],
  plugins: ["eslint-plugin-simple-import-sort"],
  rules: {
    "no-console": "off",

    "jsx-a11y/alt-text": "off", // it's not smart enough
    "jsx-a11y/media-has-caption": "off",
    "no-unused-private-class-members": "off",
    "prefer-object-has-own": "off",
    "import/newline-after-import": "warn",
    "simple-import-sort/exports": "warn",

    // this one isn't smart enough for our "@/" imports
    "import/order": "off",

    "sort-imports": "off",
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          ["^.+\\.s?css$"],
          ["^\\u0000"],
          ["^react$", "^react-dom$"],
          ["^~", "^@/"],
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
        ],
      },
    ],

    // I can't figure these out:
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",

    // for CatchBoundaries
    "@typescript-eslint/no-throw-literal": "off",
    "testing-library/no-await-sync-events": "off",

    // this auto-fixes and it's nice to have types and actual stuff separate
    "@typescript-eslint/consistent-type-imports": "warn",
  },
  overrides: [
    {
      plugins: ["remix-react-routes"],
      files: appFiles,
      excludedFiles: testFiles,
      rules: {
        "remix-react-routes/use-link-for-routes": "error",
        "remix-react-routes/require-valid-paths": "error",
        // disable this one because it doesn't appear to work with our
        // route convention. Someone should dig deeper into this...
        "remix-react-routes/no-relative-paths": [
          "off",
          { allowLinksToSelf: true },
        ],
        "remix-react-routes/no-urls": "error",
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: testFiles,
                message: "Do not import test files in app files",
              },
            ],
          },
        ],
      },
    },
    {
      extends: ["@remix-run/eslint-config/jest-testing-library"],
      files: vitestFiles,
      rules: {
        "testing-library/no-await-sync-events": "off",
        "jest-dom/prefer-in-document": "off",
      },
      // we're using vitest which has a very similar API to jest
      // (so the linting plugins work nicely), but it means we have to explicitly
      // set the jest version.
      settings: {
        jest: {
          version: 28,
        },
      },
    },
  ],
  globals: {
    React: true,
    JSX: true,
  },
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
  },
  settings: {
    jest: {
      version: 28,
    },
  },
};
