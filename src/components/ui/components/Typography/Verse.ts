import { ParagraphScale } from '../../Theme'

import styled from '@emotion/styled'
import shouldForwardProp from '@styled-system/should-forward-prop'
import {
  color,
  ColorProps,
  fontWeight,
  layout,
  LayoutProps,
  space,
  SpaceProps,
  typography,
  TypographyProps as SystemTypographyProps,
  variant
} from 'styled-system'

export interface VerseProps extends LayoutProps, SpaceProps, ColorProps, SystemTypographyProps {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<unknown>
  color?: string
  variant?: ParagraphScale
}

const Verse = styled('p', { shouldForwardProp })<VerseProps>(
  variant({ scale: 'componentStyles.typography.textScale' }),
  layout,
  space,
  color,
  typography
)

Verse.defaultProps = {
  variant: 400,
  fontWeight: 300
}

Verse.displayName = 'Verse'

export default Verse
