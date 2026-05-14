import { type ChangeEventHandler } from 'react'

import { Text } from '@/components/typography'
import { clsxm } from '@/utils/clsxm'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterTagProps {
	tag: string
	selected: boolean
	onChange?: ChangeEventHandler<HTMLInputElement>
	disabled?: boolean
}

function FilterTag({ tag, selected, onChange, disabled }: FilterTagProps) {
	return (
		<label
			className={clsxm(
				// Base — layout, typography, shape, transition
				'relative inline-flex cursor-pointer items-center justify-center select-none',
				'rounded-full px-3 py-1.5',
				'transition-colors duration-150',
				// States
				{
					// Default
					'border-primary border bg-(--filter-tag-surface-default) text-(--filter-tag-text-default)':
						!selected && !disabled,
					// Selected
					'border-transparent bg-(--filter-tag-surface-selected) text-(--filter-tag-text-selected)':
						selected && !disabled,
					// Disabled
					'cursor-not-allowed border border-(--border-primary) bg-(--filter-tag-surface-disabled) text-(--filter-tag-text-disabled) opacity-40':
						disabled,
				},
				// Focus ring — visible on keyboard nav
				'focus-within:ring-2 focus-within:ring-(--border-focus) focus-within:ring-offset-2',
			)}
		>
			<input
				type="checkbox"
				checked={selected}
				onChange={onChange}
				readOnly={!onChange}
				disabled={disabled}
				value={tag}
				className="sr-only"
			/>
			<Text variant="label">{tag}</Text>
		</label>
	)
}

export { FilterTag }
