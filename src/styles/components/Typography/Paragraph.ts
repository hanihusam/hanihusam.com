import styled from 'styled-components'
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
import { ParagraphScale } from '../../Theme'

export interface ParagraphProps extends LayoutProps, SpaceProps, ColorProps, SystemTypographyProps {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  color?: string
  variant?: ParagraphScale
}

const Paragraph = styled('p').withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !['hidden'].includes(prop) && defaultValidatorFn(prop)
})<ParagraphProps>(variant({ scale: 'componentStyles.typography.paragraphScale' }), layout, space, color, typography)

Paragraph.defaultProps = {
  variant: 400
}

Paragraph.displayName = 'Paragraph'

export default Paragraph
