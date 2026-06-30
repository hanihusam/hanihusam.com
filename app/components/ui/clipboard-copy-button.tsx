import { useEffect, useState } from 'react'

import { clsxm } from '@/utils/clsxm.ts'

import { Button } from './button'

import { CheckCircleIcon, CopyIcon } from '@phosphor-icons/react'

async function copyToClipboard(value: string) {
	try {
		await navigator.clipboard.writeText(value)
		return true
	} catch {
		return false
	}
}

enum State {
	Idle = 'idle',
	Copy = 'copy',
	Copied = 'copied',
}

export function ClipboardCopyButton({
	value,
	className,
}: {
	value: string
	className?: string
}) {
	const [state, setState] = useState<State>(State.Idle)

	useEffect(() => {
		async function transition() {
			switch (state) {
				case State.Copy: {
					const res = await copyToClipboard(value)
					console.info('copied', res)
					setState(State.Copied)
					break
				}
				case State.Copied: {
					setTimeout(() => {
						setState(State.Idle)
					}, 2000)
					break
				}
				default:
					break
			}
		}
		void transition()
	}, [state, value])

	const copied = state === State.Copied

	return (
		<Button
			variant="secondary"
			onClick={() => setState(State.Copy)}
			className={clsxm(
				'p-4 whitespace-nowrap shadow transition group-hover:opacity-100 peer-hover:opacity-100 peer-focus:opacity-100 hover:opacity-100 hover:shadow-md focus:opacity-100 focus:outline-none active:scale-[0.97] lg:opacity-0',
				className,
			)}
		>
			<span className="relative inline-flex size-6 shrink-0">
				<span
					className={clsxm(
						'absolute inset-0 transition-all duration-200',
						copied ? 'opacity-0 blur-sm' : 'opacity-100 blur-none',
					)}
				>
					<CopyIcon className="size-full" />
				</span>
				<span
					className={clsxm(
						'absolute inset-0 transition-all duration-200',
						copied ? 'opacity-100 blur-none' : 'opacity-0 blur-sm',
					)}
				>
					<CheckCircleIcon weight="fill" className="size-full" />
				</span>
			</span>
		</Button>
	)
}
