import { clsxm } from '@/utils/clsxm'

/** Surface, radius and padding every bento tile shares. */
export const BENTO_TILE_CLASS =
	'bg-(--surface-secondary) relative rounded-2xl p-5'

type BentoTileProps = { area: string } & React.ComponentProps<'div'>

/**
 * Bento tile. `area` is the responsive `grid-area` utility for this tile.
 * Tiles are fluid grid cells; illustrations inside are positioned with
 * percentage offsets taken from the Figma frames so they stay exact while
 * scaling with the tile.
 */
export function BentoTile({
	area,
	className,
	...props
}: Readonly<BentoTileProps>) {
	return <div className={clsxm(BENTO_TILE_CLASS, area, className)} {...props} />
}
