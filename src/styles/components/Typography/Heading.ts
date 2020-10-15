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

export interface HeadingProps extends LayoutProps, SpaceProps, ColorProps, SystemTypographyProps {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  color?: string
  variant?: TextScale
}

const Heading = styled('h2').withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !['hidden'].includes(prop) && defaultValidatorFn(prop)
})<HeadingProps>(variant({ scale: 'componentStyles.typography.textScale' }), layout, space, color, typography)

Heading.defaultProps = {
  variant: 800,
  fontWeight: 600
}

Heading.displayName = 'Heading'

export default Heading
