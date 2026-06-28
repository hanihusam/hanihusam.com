import { Grid } from '@/components/grid'
import { Header } from '@/components/header'
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
			<Header
				title={title}
				subTitle={subTitle}
				cta={cta}
				ctaUrl="https://bapak2dev.substack.com"
			/>
			<Spacer size="lg" />
			<Grid className="gap-6">
				{posts.map((post, idx) => (
					<div
						key={post.url}
						className={clsxm('col-span-4', {
							'hidden lg:block': idx >= 2,
						})}
					>
						<ArticleCard post={post} />
					</div>
				))}
			</Grid>
			<Spacer size="lg" />
		</>
	)
}
