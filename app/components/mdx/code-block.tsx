import * as React from 'react'

import { clsxm } from '@/utils/clsxm'

import { CheckIcon, ClipboardIcon } from '@phosphor-icons/react'

type CodeBlockProps = React.ComponentPropsWithoutRef<'pre'> & {
	'data-language'?: string
}

/**
 * Multiline code block (Figma 239-69): a rounded card with a header showing the
 * language label and a copy-to-clipboard button, wrapping the Shiki-highlighted
 * `<pre>` produced by rehype-pretty-code. Mapped to `pre` in `mdxComponents`.
 */
export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
	const language = props['data-language']
	const preRef = React.useRef<HTMLPreElement>(null)
	const [copied, setCopied] = React.useState(false)

	function handleCopy() {
		const text = preRef.current?.textContent ?? ''
		void navigator.clipboard.writeText(text).then(() => {
			setCopied(true)
			window.setTimeout(() => setCopied(false), 2000)
		})
	}

	const label =
		language && language !== 'plaintext' ? language.toUpperCase() : 'CODE'

	return (
		<figure className="mx-0 my-5 overflow-hidden rounded-xl bg-(--color-neutral-950) dark:bg-(--color-sky-900)">
			<div className="flex items-center justify-between bg-(--color-neutral-800) py-2.5 pr-3 pl-4 dark:bg-(--color-sky-800)">
				<span className="font-mono text-[13px] text-(--color-neutral-400)">
					{label}
				</span>
				<button
					type="button"
					onClick={handleCopy}
					className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[13px] text-(--color-neutral-400) transition-colors hover:text-(--color-neutral-100) focus:outline-none"
				>
					{copied ? (
						<CheckIcon className="size-3.5" />
					) : (
						<ClipboardIcon className="size-3.5" />
					)}
					{copied ? 'Copied' : 'Copy'}
				</button>
			</div>
			<pre ref={preRef} className={clsxm(className)} {...props}>
				{children}
			</pre>
		</figure>
	)
}
