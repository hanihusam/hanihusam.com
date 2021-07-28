import { Box, themeProps } from '../../../ui'

import styled from '@emotion/styled'

interface NavGridProps {
  noPadding?: boolean
}

export const NavGrid = styled(Box)<NavGridProps>`
  display: grid;
  grid-template-columns: 1fr 1fr minmax(auto, ${themeProps.widths.md}px) 1fr 1fr;
  padding: ${props => (props.noPadding ? 0 : `0 ${themeProps.space.md}px`)};
  z-index: 50;

  ${themeProps.mediaQueries.md} {
    padding: ${props => (props.noPadding ? 0 : `0 ${themeProps.space.lg}px`)};
  }

  ${themeProps.mediaQueries.lg} {
    grid-template-columns: 1fr 1fr minmax(auto, ${themeProps.widths.lg}px) 1fr 1fr;
  }

  ${themeProps.mediaQueries.xl} {
    grid-template-columns: 1fr 1fr minmax(auto, ${themeProps.widths.xl}px) 1fr 1fr;
  }
`

export const NavInner = styled(Box)`
  grid-column: 3/4;
`

export const MainNavigation = styled(Box)`
  display: none;
  padding: 2px 0 0 15px;

  ${themeProps.mediaQueries.sm} {
    display: block;
  }

  ${themeProps.mediaQueries.md} {
    padding: 8px 0 0 15px;
  }
`
