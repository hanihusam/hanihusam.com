import { useEffect, useState } from 'react'

import { Text } from '@/components/typography'

const localTimeFormatter = new Intl.DateTimeFormat('en-US', {
	timeZone: 'Asia/Jakarta',
	hour: '2-digit',
	minute: '2-digit',
	hour12: true,
})

export function FooterLocation() {
	const [localTime, setLocalTime] = useState<string>()

	useEffect(() => {
		function updateLocalTime() {
			setLocalTime(
				localTimeFormatter
					.format(new Date())
					.toLowerCase()
					.replace(':', '.')
					.replace(/\s/g, ''),
			)
		}

		updateLocalTime()
		const interval = window.setInterval(updateLocalTime, 60_000)
		return () => window.clearInterval(interval)
	}, [])

	return (
		<Text variant="label">
			{localTime ? `${localTime} in ` : ''}Bantul, Yogyakarta ©{' '}
			{new Date().getFullYear()}
		</Text>
	)
}
