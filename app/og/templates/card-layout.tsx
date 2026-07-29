import { OG_COLORS } from '@/og/constants'

// Geometry ported from the Cloudinary grid the previous implementation used
// (a 24x12 grid over 2400x1256), halved for the 1200x630 canvas, so cards stay
// visually continuous with the ones already shared.
const CARD_PADDING_TOP = 76
const CARD_PADDING_BOTTOM = 78
const CARD_PADDING_LEFT = 64
const TEXT_COLUMN_WIDTH = 500
const ARTWORK_WIDTH = 550
const ARTWORK_HEIGHT = 578
const ARTWORK_MARGIN_RIGHT = 50
const AUTHOR_BLOCK_HEIGHT = 112 // the avatar is the tallest element in it
const AUTHOR_BLOCK_MARGIN_TOP = 32
const TITLE_LINE_HEIGHT = 1.15

// Vertical space the title may occupy before it would start pushing the author
// block off the canvas.
const TITLE_BLOCK_HEIGHT =
	630 -
	CARD_PADDING_TOP -
	CARD_PADDING_BOTTOM -
	AUTHOR_BLOCK_HEIGHT -
	AUTHOR_BLOCK_MARGIN_TOP

/**
 * Title sizing still keys off length, as the Cloudinary version did — but for a
 * different reason. There it was a workaround for having no line wrapping at
 * all; here it only keeps a long title from eating the whole card.
 *
 * Thresholds assume the ~470px title column and Satoshi Bold: roughly 18
 * characters per line at 56px, more as the size drops.
 */
function getTitleFontSize(title: string) {
	if (title.length <= 60) return 56
	if (title.length <= 90) return 48
	if (title.length <= 130) return 42
	return 36
}

/**
 * The actual overflow guarantee: how many lines fit in `TITLE_BLOCK_HEIGHT` at
 * this size. Derived rather than hardcoded so it stays correct if the padding
 * or the size buckets are retuned. Satori only honours `lineClamp` on a
 * `display: block` element — on a flex one it is silently ignored.
 */
function getTitleLineClamp(fontSize: number) {
	return Math.max(
		1,
		Math.floor(TITLE_BLOCK_HEIGHT / (fontSize * TITLE_LINE_HEIGHT)),
	)
}

// Shared shell for every card: full-bleed background, a left column holding the
// title and author block, and the artwork on the right. Proportions mirror the
// Cloudinary grid the previous implementation used, so cards stay recognisable.
//
// Satori constraints that shape this markup: any element with more than one
// child needs an explicit `display: flex`, there is no CSS grid, and images
// must already be data URIs.
export function CardLayout({
	title,
	url,
	background,
	avatar,
	artwork,
	name = 'Hani Husamuddin',
}: {
	title: string
	url: string
	background: string
	avatar: string
	artwork: string
	name?: string
}) {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				position: 'relative',
				backgroundColor: OG_COLORS.background,
				fontFamily: 'Satoshi',
			}}
		>
			<img
				src={background}
				alt=""
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					objectFit: 'cover',
				}}
			/>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					width: TEXT_COLUMN_WIDTH + CARD_PADDING_LEFT,
					height: '100%',
					padding: `${CARD_PADDING_TOP}px 0 ${CARD_PADDING_BOTTOM}px ${CARD_PADDING_LEFT}px`,
					position: 'relative',
				}}
			>
				<div
					style={{
						display: 'block',
						maxHeight: TITLE_BLOCK_HEIGHT,
						overflow: 'hidden',
						color: OG_COLORS.white,
						fontSize: getTitleFontSize(title),
						fontWeight: 700,
						lineHeight: TITLE_LINE_HEIGHT,
						lineClamp: getTitleLineClamp(getTitleFontSize(title)),
					}}
				>
					{title}
				</div>

				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						flexShrink: 0,
						marginTop: AUTHOR_BLOCK_MARGIN_TOP,
					}}
				>
					<img
						src={avatar}
						alt=""
						style={{
							width: AUTHOR_BLOCK_HEIGHT,
							height: AUTHOR_BLOCK_HEIGHT,
							borderRadius: 999,
							objectFit: 'cover',
							flexShrink: 0,
						}}
					/>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							marginLeft: 30,
						}}
					>
						<div
							style={{
								color: OG_COLORS.white,
								fontSize: 32,
								fontWeight: 700,
								lineHeight: 1.2,
							}}
						>
							{name}
						</div>
						<div
							style={{
								color: OG_COLORS.muted,
								fontSize: 19,
								fontWeight: 400,
								lineHeight: 1.4,
							}}
						>
							{url}
						</div>
					</div>
				</div>
			</div>

			{/* Absolutely positioned rather than a sibling column so the artwork and
			    the text column never compete for width — the text column keeps its
			    full 500px regardless of how wide the artwork wants to be. */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					right: ARTWORK_MARGIN_RIGHT,
					height: '100%',
					width: ARTWORK_WIDTH,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-end',
				}}
			>
				<img
					src={artwork}
					alt=""
					style={{
						maxWidth: ARTWORK_WIDTH,
						maxHeight: ARTWORK_HEIGHT,
						objectFit: 'contain',
					}}
				/>
			</div>
		</div>
	)
}
