import { getThemeSession } from '@/utils/theme.server'
import { isTheme } from '@/utils/theme-provider'

import { type ActionFunction, data, redirect } from '@remix-run/node'

export const action: ActionFunction = async ({ request }) => {
	const themeSession = await getThemeSession(request)
	const requestText = await request.text()
	const form = new URLSearchParams(requestText)
	const theme = form.get('theme')

	if (!isTheme(theme)) {
		return data({
			success: false,
			message: `theme value of ${theme} is not a valid theme.`,
		})
	}

	themeSession.setTheme(theme)

	return data(
		{ success: true },
		{
			headers: { 'Set-Cookie': await themeSession.commit() },
		},
	)
}

export const loader = () => redirect('/', { status: 404 })

export default function MarkRead() {
	return <div>Oops... You should not see this.</div>
}
