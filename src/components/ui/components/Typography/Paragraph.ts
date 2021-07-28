import { ParagraphScale } from '../../Theme'

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

export interface ParagraphProps extends LayoutProps, SpaceProps, ColorProps, SystemTypographyProps {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<unknown>
  color?: string
  variant?: ParagraphScale
}

const Paragraph = styled('p', { shouldForwardProp })<ParagraphProps>(
  variant({ scale: 'componentStyles.typography.paragraphScale' }),
  layout,
  space,
  color,
  typography
)

Paragraph.defaultProps = {
  variant: 400
}

Paragraph.displayName = 'Paragraph'

export default Paragraph
