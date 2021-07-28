import { TextScale } from '../../Theme'

import styled from '@emotion/styled'
import shouldForwardProp from '@styled-system/should-forward-prop'
import {
  color,
  ColorProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
  typography,
  TypographyProps as SystemTypographyProps,
  variant
} from 'styled-system'

export interface HeadingProps extends LayoutProps, SpaceProps, ColorProps, SystemTypographyProps {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<unknown>
  color?: string
  variant?: TextScale
}

const Heading = styled('h2', { shouldForwardProp })<HeadingProps>(
  variant({ scale: 'componentStyles.typography.textScale' }),
  layout,
  space,
  color,
  typography
)

Heading.defaultProps = {
  variant: 800,
  fontWeight: 600
}

Heading.displayName = 'Heading'

export default Heading
