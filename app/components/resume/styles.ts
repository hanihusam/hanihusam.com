// Type styles shared by the /resume components (Figma text styles in the comments).

/** desktop/title/h4: 24/33 medium; 20/27.5 below md. */
export const resumeTitleClass =
	'text-xl leading-(--h4-leading-mobile) font-medium text-(--text-title-primary) md:text-2xl md:leading-(--h4-leading-desktop)'

/** paragraph: 16/20 regular. */
export const resumeBodyClass = 'text-base leading-5 text-(--text-paragraph)'

/** code/inline: JetBrains Mono 13, normal line height. */
export const resumeMonoClass = 'font-mono text-[13px] leading-normal'

/**
 * Handwritten notes, rotated a few degrees like a margin note. Callers add the
 * size and then `leading-[1.1]`: tailwind-merge drops a line height that comes
 * before a font size.
 */
export const resumeHandClass =
	'font-hand whitespace-nowrap text-(--text-paragraph)'
