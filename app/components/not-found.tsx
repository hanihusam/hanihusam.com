import { Display } from '@/components/typography'
import { ButtonLink } from '@/components/ui/button'

import { ArrowLeftIcon } from '@phosphor-icons/react'

/**
 * Shared 404 screen. Rendered both by the splat route (unknown URLs) and by
 * route error boundaries when a loader throws a 404 response.
 */
function NotFound() {
	return (
		<main className="relative flex grow flex-col items-center justify-center px-6 py-24 sm:px-8">
			<div className="flex w-full max-w-(--container-site) flex-col items-start gap-6">
				<div className="flex flex-col gap-4">
					<Display>404 | Not Found</Display>
					<p className="text-2xl leading-(--h3-leading-mobile) font-bold text-(--text-overline) md:text-3xl md:leading-(--h3-leading-desktop)">
						Oh no, you found a page that&apos;s missing stuff.
					</p>
				</div>
				<ButtonLink to="/" iconLeft={<ArrowLeftIcon />}>
					Go back home
				</ButtonLink>
			</div>
		</main>
	)
}

export { NotFound }
