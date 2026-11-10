export type LocalOverlap = {
	value: string
	/** Which note goes with it: his normal day, one window, or two. */
	kind: 'day' | 'one' | 'two'
}

/**
 * The hours Han's day overlaps the visitor's own working day, in their time
 * zone (copy note v3.5):
 * - If his normal day (09:00–17:00 WIB) overlaps their 09:00–17:00 by four
 *   hours or more (Asia, Australia, the Gulf), that day: "09:00–17:00" in
 *   Jakarta, "1 – 6 PM" in Sydney.
 * - Otherwise his Europe (13:00–16:00 UTC) and US (19:00–21:00 UTC) windows
 *   that overlap their 08:00–18:00 by an hour or more: "13:00–16:00" in
 *   London, "8 – 11 AM or 2 – 4 PM" in New York. If neither does, both,
 *   untrimmed.
 * Every window is trimmed to the visitor's 08:00–18:00, earlier one first.
 * English on the visitor's own clock: 24-hour with a closed dash (en-GB),
 * 12-hour with a spaced one and no ":00" (en-US). Returns null when Intl
 * can't format ranges, so the page keeps its fixed text.
 *
 * It has no references outside its own body and no named inner functions:
 * OverlapFact also runs it as an inline script, via toString(), before first
 * paint (the dev bundler would wrap a named inner function in a helper that
 * doesn't exist there).
 */
export function formatLocalOverlapHours(): LocalOverlap | null {
	try {
		const now = new Date()
		const day = Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
		)
		const { hourCycle, hour12 } = new Intl.DateTimeFormat(undefined, {
			hour: 'numeric',
		}).resolvedOptions()
		const twentyFourHour = hourCycle
			? hourCycle === 'h23' || hourCycle === 'h24'
			: hour12 === false
		const format = twentyFourHour
			? new Intl.DateTimeFormat('en-GB', {
					hour: '2-digit',
					minute: '2-digit',
					hourCycle: 'h23',
				})
			: new Intl.DateTimeFormat('en-US', {
					hour: 'numeric',
					minute: '2-digit',
					hourCycle: 'h12',
				})
		if (typeof format.formatRange !== 'function') return null

		// Han's normal day, then the Europe and US windows, in UTC hours, as
		// [start, end] minutes of the visitor's day (end may pass midnight).
		const windows = [
			[2, 10],
			[13, 16],
			[19, 21],
		].map(([from = 0, to = 0]) => {
			const start = new Date(day + from * 3_600_000)
			const minutes = start.getHours() * 60 + start.getMinutes()
			return [minutes, minutes + (to - from) * 60]
		})
		// Each window's overlap with the visitor's 09:00–17:00 (core) and
		// 08:00–18:00 (shown), today or after midnight, as [start, end].
		const overlaps = windows.map(([start = 0, end = 0]) =>
			[
				[540, 1020],
				[480, 1080],
			].map(([from = 0, to = 0]) =>
				[
					[from, to],
					[from + 1440, to + 1440],
				]
					.map(([a = 0, b = 0]) => [Math.max(start, a), Math.min(end, b)])
					.find(([a = 0, b = 0]) => b > a),
			),
		)

		let kind: LocalOverlap['kind'] = 'two'
		let shown: Array<Array<number>> = []
		const dayCore = overlaps[0]?.[0]
		if (dayCore && (dayCore[1] ?? 0) - (dayCore[0] ?? 0) >= 240) {
			kind = 'day'
			shown = [overlaps[0]?.[1] ?? dayCore]
		} else {
			shown = overlaps
				.slice(1)
				.map((overlap) => overlap[1])
				.filter((overlap): overlap is Array<number> =>
					Boolean(overlap && (overlap[1] ?? 0) - (overlap[0] ?? 0) >= 60),
				)
			if (shown.length === 1) kind = 'one'
			if (shown.length === 0) shown = windows.slice(1)
		}

		const value = shown
			.sort((a, b) => (a[0] ?? 0) - (b[0] ?? 0))
			.map(([from = 0, to = 0]) => {
				// One fixed day: formatRange adds both dates to a window that
				// crosses midnight.
				const start = new Date(2000, 0, 1, 0, from % 1440)
				const end = new Date(2000, 0, 1, 0, to % 1440)
				let text: string
				try {
					text = format.formatRange(start, end)
				} catch {
					// Engines from before ES2023 reject an end earlier than the start.
					text = `${format.format(start)} – ${format.format(end)}`
				}
				if (!twentyFourHour) text = text.replace(/:00/g, '')
				// A window never splits across lines: no-break spaces, and word
				// joiners around the dash (browsers may break after a dash).
				return text
					.replace(/ /g, '\u00A0')
					.replace(/\u2009/g, '\u202F')
					.replace(/\u2013/g, '\u2060\u2013\u2060')
			})
			// A narrow column breaks before "or", which stays with the second
			// window, so the second line reads as a continuation.
			.join(' or\u00A0')

		return { value, kind }
	} catch {
		return null
	}
}
