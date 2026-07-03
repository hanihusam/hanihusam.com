/// <reference types="vite/client" />

declare module '@tailwindcss/typography'

// cloudinary-build-url's own type definitions import from '@cld-apis/types',
// which we don't install directly because it declares dev tooling (bundlewatch,
// agadoo) as runtime dependencies, dragging in vulnerable axios/rollup trees.
// This shim satisfies the library's internal import without pulling that in.
declare module '@cld-apis/types'
