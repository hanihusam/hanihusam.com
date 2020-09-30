import React from 'react'
import styled from 'styled-components'
import {
  layout,
  LayoutProps,
  flexbox,
  FlexboxProps,
  position,
  PositionProps,
  grid,
  GridProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
  background,
  BackgroundProps,
  color,
  ColorProps,
  border,
  BorderProps,
  shadow,
  ShadowProps
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
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  className?: string
  style?: React.CSSProperties
  /** Override default color prop. */
  color?: string
}

/**
 * Box is a view with all styled-system hooks added to it. You can use it as a
 * base component for all display elements.
 */
const Box = styled('div').withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !['hidden'].includes(prop) && defaultValidatorFn(prop)
})<BoxProps>`
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
