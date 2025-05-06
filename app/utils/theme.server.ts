import { getRequiredServerEnvVar } from './misc'
import { isTheme, Theme } from './theme-provider'

import { createCookieSessionStorage } from 'react-router'

const themeStorage = createCookieSessionStorage({
	cookie: {
		name: 'HNH_theme',
		secure: true,
		secrets: [getRequiredServerEnvVar('SESSION_SECRET')],
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
	},
})

async function getThemeSession(request: Request) {
	const session = await themeStorage.getSession(request.headers.get('Cookie'))

	return {
		getTheme: () => {
			const themeValue = session.get('theme') as Theme
			return isTheme(themeValue) ? themeValue : Theme.DARK
		},
		setTheme: (theme: Theme) => session.set('theme', theme),
		commit: () =>
			// no theme for you on my 100th birthday! 😂
			themeStorage.commitSession(session, { expires: new Date('2094-12-02') }),
	}
}

export { getThemeSession }
