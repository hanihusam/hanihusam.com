import { getThemeSession } from '@/utils/theme.server'
import { isTheme } from '@/utils/theme-provider'

import { type Route } from './+types/action.set-theme'

import { data, redirect } from 'react-router'

export const action = async ({ request }: Route.ActionArgs) => {
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
