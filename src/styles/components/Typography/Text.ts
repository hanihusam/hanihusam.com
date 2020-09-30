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
import { TextScale } from '../../Theme'

export interface TextProps extends LayoutProps, SpaceProps, ColorProps, SystemTypographyProps {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  color?: string
  variant?: TextScale
}

const Text = styled('span').withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !['hidden'].includes(prop) && defaultValidatorFn(prop)
})<TextProps>(variant({ scale: 'componentStyles.typography.textScale' }), layout, space, color, typography)

Text.defaultProps = {
  variant: 400
}

Text.displayName = 'Text'

export default Text
