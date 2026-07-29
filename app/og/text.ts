// Satori ships no emoji font, so an emoji renders as a blank box. Strip them
// and collapse the whitespace they leave behind. Same rule the Cloudinary
// pipeline needed, for a different reason.
export function stripEmoji(value: string) {
	return value
		.replace(/\p{Extended_Pictographic}/gu, '')
		.split(' ')
		.filter(Boolean)
		.join(' ')
		.trim()
}
