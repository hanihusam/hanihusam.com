import { motion } from 'motion/react'
import { useRef } from 'react'

import { useCatPeekReveal } from '@/hooks/useCatPeekReveal'

/**
 * The cat that peeks around the bottom-right corner of its bento card.
 *
 * Split across two components because they sit on opposite sides of the card
 * in paint order, which is the whole trick:
 *
 *   CatPeekBody  → rendered BEFORE the card, so the card occludes it and the
 *                  cat genuinely leans out from behind.
 *   CatPeekPaws  → rendered AFTER the card, so the paws sit in front of it
 *                  and read as gripping the corner. Static by design.
 *
 * Both use the same absolutely-positioned 139×139 box, so the two halves line
 * up: the paws' 21×80 artwork sits at (25.6, 58.8) in the body's coordinate
 * space, expressed below as percentages of that box.
 *
 * The body art still contains its own paws, but they stay behind the card for
 * the whole travel and land exactly under the front paw layer at rest, so
 * they are never seen doubled.
 */

/** Shared placement of the 139×139 cat box, hanging off the card's corner. */
const BOX = 'absolute -right-26 bottom-2 h-34.75 w-34.75'

export function CatPeekBody() {
	// The scroll scene is measured against this box, not the tile — see the
	// hook's brief for why.
	const boxRef = useRef<HTMLDivElement>(null)
	const { active, bodyX } = useCatPeekReveal(boxRef)

	return (
		<div
			aria-hidden
			className="pointer-events-none relative hidden [grid-area:cat] lg:block"
		>
			<div ref={boxRef} className={BOX}>
				<motion.img
					src="/images/cat-peek.png"
					alt=""
					width={139}
					height={139}
					style={active ? { x: bodyX } : undefined}
					className="absolute inset-0 h-full w-full"
				/>
			</div>
		</div>
	)
}

export function CatPeekPaws() {
	return (
		<div
			aria-hidden
			className="pointer-events-none relative hidden [grid-area:cat] lg:block"
		>
			<div className={BOX}>
				<img
					src="/images/cat-hand.svg"
					alt=""
					width={21}
					height={80}
					className="absolute top-[42.302%] left-[18.417%] h-[57.554%] w-[15.108%]"
				/>
			</div>
		</div>
	)
}
