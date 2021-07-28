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

export interface TextProps extends LayoutProps, SpaceProps, ColorProps, SystemTypographyProps {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<unknown>
  color?: string
  variant?: TextScale
}

const Text = styled('span', { shouldForwardProp })<TextProps>(
  variant({ scale: 'componentStyles.typography.textScale' }),
  layout,
  space,
  color,
  typography
)

Text.defaultProps = {
  variant: 400
}

Text.displayName = 'Text'

export default Text
