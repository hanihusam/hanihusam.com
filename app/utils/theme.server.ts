import { parseCookie, stringifySetCookie } from 'cookie'

const cookieName = 'hnh_theme'
export type Theme = 'light' | 'dark'

export function getTheme(request: Request): Theme | null {
	const cookieHeader = request.headers.get('cookie')
	const parsed = cookieHeader ? parseCookie(cookieHeader)[cookieName] : 'light'
	if (parsed === 'light' || parsed === 'dark') return parsed
	return null
}

export function setTheme(theme: Theme | 'system') {
	if (theme === 'system') {
		return stringifySetCookie({
			name: cookieName,
			value: '',
			path: '/',
			maxAge: -1,
		})
	} else {
		return stringifySetCookie({ name: cookieName, value: theme, path: '/' })
	}
}
