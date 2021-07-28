import * as React from 'react'

import styled from '@emotion/styled'
import shouldForwardProp from '@styled-system/should-forward-prop'
import {
  background,
  BackgroundProps,
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  typography,
  TypographyProps
} from 'styled-system'

export interface BoxProps
  extends LayoutProps,
    FlexboxProps,
    PositionProps,
    GridProps,
    SpaceProps,
    TypographyProps,
    BackgroundProps,
    ColorProps,
    BorderProps,
    ShadowProps {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<unknown>
  className?: string
  style?: React.CSSProperties
  /** Override default color prop. */
  color?: string
}

/**
 * Box is a view with all styled-system hooks added to it. You can use it as a
 * base component for all display elements.
 */
const Box = styled('div', { shouldForwardProp })<BoxProps>`
  ${layout}
  ${flexbox}
  ${position}
  ${grid}
  ${space}
  ${typography}
  ${background}
  ${color}
  ${border}
  ${shadow}
`

Box.displayName = 'Box'

export default Box
