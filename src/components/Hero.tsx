import React from 'react'

import styled from 'styled-components'
import { Box, Column, Text, Heading, Paragraph, themeProps, UnstyledButton } from 'src/styles'
import { FiDownload } from 'react-icons/fi'

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
    justify-content: space-around;
  }
`

const RightContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 32px 0;
`

const FirstTitle = styled(Text)`
  display: block;
  padding-bottom: ${themeProps.space.md}px;

  ${themeProps.mediaQueries.md} {
    display: none;
  }
`

const SecondTitle = styled(Heading)`
  padding-bottom: ${themeProps.space.md}px;
`

const Description = styled(Paragraph)`
  padding-bottom: ${themeProps.space.md}px;
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

const CtaButtonWrapper = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: flex-start;
`

const EmailMeButton = styled(UnstyledButton)`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: ${themeProps.space.md}px;
  min-width: 100px;
  min-height: 40px;
  margin-right: ${themeProps.space.md}px;
  border-radius: 5px;
  transition: 500ms;

  & > a {
    color: #ffffff;
    text-decoration: none;
  }

  &:hover {
    filter: brightness(80%);
  }

  ${themeProps.mediaQueries.md} {
    min-width: 150px;
    height: 65px;
  }
`

const CVButton = styled(UnstyledButton)`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: ${themeProps.space.md}px;
  min-width: 100px;
  min-height: 40px;
  border-radius: 5px;
  transition: 500ms;

  & > a {
    text-decoration: none;
  }

  ${themeProps.mediaQueries.md} {
    min-width: 150px;
    height: 65px;
  }
`

const Icon = styled.i`
  display: block;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  width: 16px;
  height: 16px;
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
        <RightContentWrapper>
          <FirstTitle as="p" variant={800} color="secondary">
            Hi, I am Hani Husam
          </FirstTitle>
          <SecondTitle variant={900} color="primary">
            Web Developer and UI Designer based in Yogyakarta, Indonesia.
          </SecondTitle>
          <Description color="textColorPrimary">
            I am a “half-blood” Web Developer and UI Designer who has experience creating many projects in a various industry. In other
            words, I understand how to build an aesthetic, powerful, and lightweight website at once.
          </Description>
          <CtaButtonWrapper>
            <EmailMeButton backgroundColor="secondary" color="white" boxShadow="double">
              <Text as="a" href="mailto:hani.husam@gmail.com" variant={400}>
                Email Me
              </Text>
            </EmailMeButton>
            <CVButton>
              <Icon>
                <FiDownload />
              </Icon>
              <Text as="a" href="mailto:hani.husam@gmail.com" variant={400} color="textColorPrimary">
                Download CV
              </Text>
            </CVButton>
          </CtaButtonWrapper>
        </RightContentWrapper>
      </HeroContent>
    </Column>
  </HeroArea>
)

export default Hero
