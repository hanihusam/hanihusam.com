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

export interface UnstyledAnchorProps
  extends LayoutProps,
    PositionProps,
    FlexboxProps,
    GridProps,
    SpaceProps,
    BackgroundProps,
    ColorProps,
    TypographyProps,
    BorderProps,
    ShadowProps {
  /**
   * Extended color props. We need this because default `color` prop clashes with `styled-system`.
   */
  color?: string
}

/** An anchor element with all styling elements removed (incl. hover/focus effects). */
const UnstyledAnchor = styled('a', { shouldForwardProp })<UnstyledAnchorProps>`
  font-style: inherit;
  color: inherit;
  background-color: transparent;
  font-size: inherit;
  text-decoration: none;
  font-variant: inherit;
  font-weight: inherit;
  line-height: inherit;
  font-family: inherit;
  border-radius: inherit;
  border: inherit;
  outline: inherit;
  box-shadow: inherit;

  &:hover,
  &:focus,
  &:active,
  &:visited {
    font-style: inherit;
    color: inherit;
    background-color: transparent;
    font-size: inherit;
    text-decoration: none;
    font-variant: inherit;
    font-weight: inherit;
    line-height: inherit;
    font-family: inherit;
    border-radius: inherit;
    border: inherit;
    outline: inherit;
    box-shadow: inherit;
  }

  ${layout}
  ${position}
  ${flexbox}
  ${grid}
  ${space}
  ${background}
  ${color}
  ${typography}
  ${border}
  ${shadow}
`

UnstyledAnchor.displayName = 'UnstyledAnchor'

export default UnstyledAnchor
