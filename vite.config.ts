import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { envOnlyMacros } from 'vite-env-only'

export default defineConfig({
	server: {
		port: 3000,
	},
	resolve: {
		dedupe: ['react', 'react-dom'],
		tsconfigPaths: true,
	},
	// The OG renderer is server-only, but the dev dependency scanner still walks
	// the route modules that reach it and chokes on resvg's native `.node`
	// binding. Keep it out of the browser graph and load it at runtime on the
	// server instead of trying to bundle it.
	optimizeDeps: {
		exclude: ['@resvg/resvg-js'],
	},
	ssr: {
		external: ['@resvg/resvg-js'],
	},
	plugins: [tailwindcss(), envOnlyMacros(), reactRouter()],
})
