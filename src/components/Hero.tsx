import React from 'react'

import styled from 'styled-components'
import { Box, Column, Text, themeProps, UnstyledButton } from 'src/styles'

const Root = Box.withComponent('section')

const HeroArea = styled(Root)`
  padding: 32px ${themeProps.space.md}px;
  color: ${themeProps.colors.textColorSecondary};

  ${themeProps.mediaQueries.md} {
    padding: 48px ${themeProps.space.lg}px 64px;
  }
`

const HeroContent = styled(Box)`
  display: flex;
  flex-direction: column;
  text-align: center;

  ${themeProps.mediaQueries.md} {
    text-align: left;
    flex-direction: row;
  }
`

const AvatarDesktop = styled(Box)`
  display: none;

  ${themeProps.mediaQueries.md} {
    display: flex;
  }
`

const AvatarMobile = styled(Box)`
  display: flex;

  ${themeProps.mediaQueries.md} {
    display: none;
  }
`

const Avatar: React.FC = () => (
  <>
    <AvatarMobile as="div" justifyContent="center">
      <img src="/images/avatar-sm.png" alt="avatar" />
    </AvatarMobile>
    <AvatarDesktop as="div" justifyContent="center">
      <img src="/images/avatar-lg.png" alt="avatar" />
    </AvatarDesktop>
  </>
)

const Hero: React.FC = () => (
  <HeroArea>
    <Column>
      <HeroContent>
        <Avatar />
      </HeroContent>
    </Column>
  </HeroArea>
)

export default Hero
