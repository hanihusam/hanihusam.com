/**
 * The two thin rules that run down the page, 32px outside the content column
 * (16px from the viewport edges when there's no room). Fixed, so they span
 * the whole page as it scrolls.
 */
export function Hairlines() {
	return (
		<div aria-hidden className="pointer-events-none fixed inset-0">
			<div className="absolute inset-y-0 left-[max(16px,calc(50%-608px))] w-px bg-(--border-default)" />
			<div className="absolute inset-y-0 right-[max(16px,calc(50%-608px))] w-px bg-(--border-default)" />
		</div>
	)
}
