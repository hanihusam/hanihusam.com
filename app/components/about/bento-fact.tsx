import { Paragraph } from '@/components/typography'
import { clsxm } from '@/utils/clsxm'

type BentoFactProps = {
	className?: string
	children: React.ReactNode
}

/** Centered body copy used inside the bento tiles. */
export function BentoFact({ className, children }: BentoFactProps) {
	return (
		<Paragraph className={clsxm('text-center', className)}>
			{children}
		</Paragraph>
	)
}
