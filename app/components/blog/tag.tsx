import { type ChangeEventHandler } from 'react'

import { clsxm } from '@/utils/clsxm'

import { CustomCheckboxContainer, CustomCheckboxInput } from '@reach/checkbox'

interface TagProps {
	tag: string
	selected: boolean
	onClick?: ChangeEventHandler<HTMLInputElement>
	disabled?: boolean
}

function Tag({ tag, selected, onClick, disabled }: TagProps) {
	return (
		<CustomCheckboxContainer
			as="label"
			checked={selected}
			onChange={onClick}
			className={clsxm(
				'relative mb-3 mr-3 block h-auto w-auto cursor-pointer rounded-full px-4 py-1.5 transition',
				{
					'bg-base text-black dark:bg-body dark:text-white': !selected,
					'bg-body text-white dark:bg-base dark:text-dark': selected,
					'focus-ring opacity-100': !disabled,
					'opacity-25': disabled,
				},
			)}
			disabled={disabled}
		>
			<CustomCheckboxInput checked={selected} value={tag} className="sr-only" />
			<span>{tag}</span>
		</CustomCheckboxContainer>
	)
}

export { Tag }
