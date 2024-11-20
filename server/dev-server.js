import { execa } from 'execa'

if (process.env.NODE_ENV === 'production') {
	// the file may not be there yet

	await import('../build/server.js')
} else {
	const command =
		'cross-env NODE_ENV=development tsx watch --clear-screen=false --ignore ".cache/**" --ignore "app/**" --ignore "vite.config.ts.timestamp-*" --ignore "build/**" --ignore "node_modules/**" --inspect ./server/index.ts'
	execa(command, {
		stdio: ['ignore', 'inherit', 'inherit'],
		shell: true,
		env: {
			FORCE_COLOR: true,
			MOCKS: true,
			...process.env,
		},
		// https://github.com/sindresorhus/execa/issues/433
		windowsHide: false,
	})
}
