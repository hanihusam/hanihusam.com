import { Grid } from '@/components/grid'
import { Header } from '@/components/header'
import { Reveal } from '@/components/reveal'
import { Spacer } from '@/components/spacer'
import { ArticleCard } from '@/components/writing/article-card'
import { type SubstackPost } from '@/types'
import { clsxm } from '@/utils/clsxm'

type SubstackSectionProps = {
	title: string
	subTitle: string
	cta: string
	posts: SubstackPost[]
}

export function SubstackSection({
	title,
	subTitle,
	cta,
	posts,
}: SubstackSectionProps) {
	if (posts.length === 0) return null

	return (
		<>
			<Reveal>
				<Header
					title={title}
					subTitle={subTitle}
					cta={cta}
					ctaUrl="https://bapak2dev.substack.com"
				/>
			</Reveal>
			<Spacer size="lg" />
			<Grid className="gap-6">
				{posts.map((post, idx) => (
					<Reveal
						key={post.url}
						delay={idx * 0.08}
						className={clsxm('col-span-4', {
							'hidden lg:block': idx >= 2,
						})}
					>
						<ArticleCard post={post} />
					</Reveal>
				))}
			</Grid>
			<Spacer size="lg" />
		</>
	)
}
