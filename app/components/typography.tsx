import { createElement } from 'react'

import { clsxm } from '@/utils/clsxm'

type TitleProps = {
	variant?: 'primary' | 'secondary'
	as?: React.ElementType
	className?: string
	id?: string
} & (
	| { children: React.ReactNode }
	| {
			dangerouslySetInnerHTML: {
				__html: string
			}
	  }
)
type ParagraphProps = {
	className?: string
	prose?: boolean
	textColorClassName?: string
	as?: React.ElementType
} & (
	| { children: React.ReactNode }
	| { dangerouslySetInnerHTML: { __html: string } }
)
type TextProps = {
	className?: string
	as?: React.ElementType
	id?: string
}

const fontSize = {
	display: 'font-black text-8xl leading-(--display-leading)',
	h1: 'font-black text-4xl md:text-5xl leading-(--h1-leading-mobile) md:leading-(--h1-leading-desktop) md:text-5xl',
	h2: 'font-bold text-3xl md:text-4xl leading-(--h2-leading-mobile) md:leading-(--h2-leading-desktop)',
	h3: 'font-bold text-2xl md:text-3xl leading-(--h3-leading-mobile) md:leading-(--h3-leading-desktop)',
	h4: 'font-medium text-xl md:text-2xl leading-(--h4-leading-mobile) md:leading-(--h4-leading-desktop)',
}

const titleColors = {
	primary: 'text-sky-600 dark:text-neutral-100',
	secondary: 'text-sunset-400',
}

const textSize = {
	caption: 'text-xs leading-(--caption-leading)',
	lead: 'text-lg leading-(--lead-leading)',
	label: 'text-xs leading-(--label-leading) tracking-[0.8px]',
	overline: 'text-xs leading-(--overline-leading) tracking-[1.6px] uppercase',
}

const textColors = {
	caption: 'text-(--text-caption)',
	lead: 'text-(--text-lead)',
	label: 'text-(--text-label)',
	overline: 'text-(--text-overline)',
}

function Title({
	variant = 'primary',
	size,
	as,
	className,
	...rest
}: TitleProps & { size: keyof typeof fontSize }) {
	const Tag = (as ?? size === 'display') ? 'h1' : size
	return (
		<Tag
			className={clsxm(fontSize[size], titleColors[variant], className)}
			{...rest}
		/>
	)
}

function Display(props: TitleProps) {
	return <Title {...props} size="display" />
}

function H1(props: TitleProps) {
	return <Title {...props} size="h1" />
}

function H2(props: TitleProps) {
	return <Title {...props} size="h2" />
}

function H3(props: TitleProps) {
	return <Title {...props} size="h3" />
}

function H4(props: TitleProps) {
	return <Title {...props} size="h4" />
}

function Text({
	variant = 'label',
	as,
	className,
	...rest
}: TextProps & { variant: keyof typeof textSize }) {
	const Tag = as ?? 'span'
	return (
		<Tag
			className={clsxm(textSize[variant], textColors[variant], className)}
			{...rest}
		/>
	)
}

function Paragraph({
	className,
	prose = true,
	as = 'p',
	textColorClassName = 'text-(--text-paragraph)',
	...rest
}: ParagraphProps) {
	return createElement(as, {
		className: clsxm(
			'max-w-full text-base leading-(--paragraph-leading)',
			textColorClassName,
			className,
			{
				'prose prose-light dark:prose-dark': prose,
			},
		),
		...rest,
	})
}

export { Display, H1, H2, H3, H4, Paragraph, Text }
