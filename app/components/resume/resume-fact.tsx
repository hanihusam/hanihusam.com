interface ResumeFactProps {
	label: string
	value: string
	note?: string
	id?: string
	/** The text is rewritten before hydration (OverlapFact's inline script). */
	dynamic?: boolean
}

/** One header column: label, value and an optional small note, over a rule. */
export function ResumeFact({
	label,
	value,
	note,
	id,
	dynamic,
}: ResumeFactProps) {
	return (
		<div
			id={id}
			className="flex flex-col gap-1 border-l border-(--border-default) pl-3"
		>
			<dt
				suppressHydrationWarning={dynamic}
				className="text-xs leading-3 font-medium tracking-[1.6px] text-(--text-overline)"
			>
				{label}
			</dt>
			<dd
				suppressHydrationWarning={dynamic}
				className="text-base leading-5 text-(--text-title-primary)"
			>
				{value}
			</dd>
			{note ? (
				<dd
					suppressHydrationWarning={dynamic}
					className="text-xs leading-[18px] text-(--text-caption)"
				>
					{note}
				</dd>
			) : null}
		</div>
	)
}
