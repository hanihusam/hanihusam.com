import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

declare module '@remix-run/node' {
	// or cloudflare, deno, etc.
	interface Future {
		v3_singleFetch: true
	}
}

installGlobals()

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [
		remix({
			ignoredRouteFiles: ['**/.*', '**/*.test.{js,jsx,ts,tsx}'],
			future: {
				v3_singleFetch: true,
			},
		}),
		tsconfigPaths(),
	],
})
