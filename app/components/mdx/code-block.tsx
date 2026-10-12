import * as React from 'react'

import { clsxm } from '@/utils/clsxm'

import { CheckIcon, ClipboardIcon } from '@phosphor-icons/react'

type CodeBlockProps = React.ComponentPropsWithoutRef<'pre'> & {
	'data-language'?: string
}

/**
 * Multiline code block (Figma 238-69 light, 3213-825 dark): a rounded card with
 * a header showing the language label and a copy-to-clipboard button, wrapping
 * the Shiki-highlighted `<pre>` produced by rehype-pretty-code. Mapped to `pre`
 * in `mdxComponents`.
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
		<figure className="mx-0 my-5 overflow-hidden rounded-xl border border-(--code-block-border) bg-(--code-block-surface)">
			<div className="flex items-center justify-between bg-(--code-block-header) py-2.5 pr-3 pl-4">
				<span className="font-mono text-[13px] text-(--code-block-label)">
					{label}
				</span>
				<button
					type="button"
					onClick={handleCopy}
					className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[13px] text-(--code-block-label) transition-colors hover:text-(--code-block-text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--code-block-text)"
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
