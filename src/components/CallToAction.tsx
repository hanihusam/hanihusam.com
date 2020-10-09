import React from 'react'

import styled from 'styled-components'
import { Box, themeProps } from 'src/styles'

const Section = Box.withComponent('section')

const CtaArea = styled(Section)`
  padding: 0px ${themeProps.space.md}px 84px;
  color: ${themeProps.colors.textColorSecondary};
  background: ${themeProps.colors.card};

  ${themeProps.mediaQueries.md} {
    padding: 48px ${themeProps.space.lg}px 84px;
  }
`

const CallToAction: React.FC = () => {
  return (
    <CtaArea>
      <h1>CTA Section</h1>
    </CtaArea>
  )
}

export default CallToAction
