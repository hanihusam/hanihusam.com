import { OG_PAPER } from '@/og/constants'

// The /resume share card on the page's paper palette (Paper Light): the fact
// row, the stacked name with its orange period, and the handwritten tagline
// with its arrow, as at the top of the page. Satori: every element with more
// than one child needs display: flex.

const PADDING_X = 96
const NAME_SIZE = 156
const NAME_TOP = 172

// Tagline and arrow sit in em of the name, as on the page (desktop frame).
const ARROW = {
	left: PADDING_X + 2.2625 * NAME_SIZE,
	top: NAME_TOP + 0.264 * NAME_SIZE,
	width: 0.75 * NAME_SIZE,
	height: 0.375 * NAME_SIZE,
}
const TAGLINE = {
	left: PADDING_X + 3.056 * NAME_SIZE,
	top: NAME_TOP + 0.219 * NAME_SIZE,
	fontSize: Math.round((30 / 160) * NAME_SIZE),
}

function Fact({ label, value }: { label: string; value: string }) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 6,
				paddingLeft: 14,
				borderLeft: `1px solid ${OG_PAPER.rule}`,
			}}
		>
			<div
				style={{
					fontSize: 17,
					fontWeight: 500,
					letterSpacing: 2,
					color: OG_PAPER.caption,
				}}
			>
				{label}
			</div>
			<div style={{ fontSize: 24, color: OG_PAPER.ink }}>{value}</div>
		</div>
	)
}

export function ResumeCard({ title, url }: { title: string; url: string }) {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				position: 'relative',
				backgroundColor: OG_PAPER.paper,
				fontFamily: 'Satoshi',
				color: OG_PAPER.ink,
			}}
		>
			{/* The page's hairlines, 48px in from each edge. */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: 48,
					width: 1,
					backgroundColor: OG_PAPER.rule,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					right: 48,
					width: 1,
					backgroundColor: OG_PAPER.rule,
				}}
			/>

			<div
				style={{
					position: 'absolute',
					top: 64,
					left: PADDING_X,
					display: 'flex',
					gap: 40,
				}}
			>
				<Fact label="Role" value={title} />
				<Fact label="Based in" value="Yogyakarta, Indonesia (UTC+7)" />
			</div>

			<div
				style={{
					position: 'absolute',
					top: NAME_TOP,
					left: PADDING_X,
					display: 'flex',
					flexDirection: 'column',
					fontSize: NAME_SIZE,
					fontWeight: 900,
					lineHeight: 0.88,
					letterSpacing: -0.04 * NAME_SIZE,
				}}
			>
				<div>Hani</div>
				<div style={{ display: 'flex' }}>
					<span>Husamuddin</span>
					{/* Satori adds the tracking after the last letter of a span, so
					    the period is pulled back to sit as tight as on the page. */}
					<span
						style={{ color: OG_PAPER.accent, marginLeft: -0.065 * NAME_SIZE }}
					>
						.
					</span>
				</div>
			</div>

			<svg
				width={ARROW.width}
				height={ARROW.height}
				viewBox="0 0 120 60"
				fill="none"
				style={{ position: 'absolute', left: ARROW.left, top: ARROW.top }}
			>
				<path
					d="M114 10C88 4 48 12 16 46"
					stroke={OG_PAPER.accent}
					strokeWidth={2.5}
					strokeLinecap="round"
				/>
				<path
					d="M18 30L16 46L32 41"
					stroke={OG_PAPER.accent}
					strokeWidth={2.5}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<div
				style={{
					position: 'absolute',
					left: TAGLINE.left,
					top: TAGLINE.top,
					display: 'flex',
					flexDirection: 'column',
					fontFamily: 'Nothing You Could Do',
					fontSize: TAGLINE.fontSize,
					lineHeight: 1.1,
					color: OG_PAPER.text,
					transform: 'rotate(4deg)',
				}}
			>
				<div>engineer who designs,</div>
				<div>designer who ships</div>
			</div>

			<div
				style={{
					position: 'absolute',
					left: PADDING_X,
					right: PADDING_X,
					bottom: 56,
					display: 'flex',
					paddingTop: 18,
					borderTop: `2px solid ${OG_PAPER.ink}`,
					fontSize: 24,
					color: OG_PAPER.caption,
				}}
			>
				{url}
			</div>
		</div>
	)
}
