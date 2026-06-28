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
	plugins: [tailwindcss(), envOnlyMacros(), reactRouter()],
})
