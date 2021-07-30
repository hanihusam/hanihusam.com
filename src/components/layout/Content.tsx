import { themeProps } from '../ui'

import styled from '@emotion/styled'

interface ContentProps {
  noPadding?: boolean
  noFlex?: boolean
}

const Content = styled('div')<ContentProps>`
  ${props => (props.noFlex ? '' : 'flex: 1 1 auto;')}
  ${props =>
    props.noPadding
      ? ''
      : `
        padding: ${themeProps.space.md}px;

        ${themeProps.mediaQueries.md} {
          padding: ${themeProps.space.lg}px;
        }
      `}
`

export default Content
