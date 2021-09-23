import * as React from 'react'

import { Box, themeProps, UnstyledAnchor, Verse } from '../ui'

import Column from './Column'

import styled from '@emotion/styled'
import { SiDribbble, SiGithub, SiLinkedin } from 'react-icons/si'

const Root = Box.withComponent('footer')

const FooterArea = styled(Root)`
  padding: ${themeProps.space.xxl}px ${themeProps.space.md}px 84px;

  ${themeProps.mediaQueries.md} {
    padding: 172px ${themeProps.space.lg}px 84px;
  }
`

const FooterContent = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding-top: ${themeProps.space.lg}px;
  border-top: 1px solid #7e7e7e;
`

const SocialLink = styled(UnstyledAnchor)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`

const FooterCopyright = styled(Box)`
  a {
    text-decoration: none;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
`

const Footer: React.FC = () => (
  <FooterArea backgroundColor="footer" color="black">
    <Column>
      <FooterContent>
        <FooterCopyright display="flex">
          <Verse>&copy; 2021 hanihusam. All rights reserved.</Verse>
        </FooterCopyright>
        <Box display="flex" flexDirection="row" justifyContent="space-between" width={120}>
          <SocialLink
            href="https://linkedin.com/in/hanihusam"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SiLinkedin />
          </SocialLink>
          <SocialLink href="https://github.com/hanihusam" rel="noopener noreferrer" target="_blank">
            <SiGithub />
          </SocialLink>
          <SocialLink
            href="https://dribbble.com/hanihusam"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SiDribbble />
          </SocialLink>
        </Box>
      </FooterContent>
    </Column>
  </FooterArea>
)

export default Footer
