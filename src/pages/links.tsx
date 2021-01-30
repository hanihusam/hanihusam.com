import * as React from 'react'
import styled from 'styled-components'

import { Box, themeProps } from 'src/styles'
import { PageWrapper } from '~/components/layout'

const Root = Box.withComponent('section')

const LinksArea = styled(Root)`
  padding: 32px ${themeProps.space.md}px;
  color: ${themeProps.colors.textColorSecondary};

  ${themeProps.mediaQueries.md} {
    padding: 48px ${themeProps.space.lg}px 0;
  }
`

const LinksContent = styled(Box)`
  display: flex;
  flex-direction: column;
  text-align: center;

  ${themeProps.mediaQueries.md} {
    text-align: left;
    flex-direction: row;
    justify-content: space-around;
  }
`

const LinksPage: React.FC = () => (
  <PageWrapper title="Hani Husam | Links" description="Link channel list">
    <LinksArea>
      <LinksContent>
        <h1>Hi World</h1>
      </LinksContent>
    </LinksArea>
  </PageWrapper>
)

export default LinksPage
