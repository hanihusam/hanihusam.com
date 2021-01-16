import React from 'react'

import styled from 'styled-components'
import { Box, Column, Text, Heading, Paragraph, themeProps, UnstyledButton, UnstyledAnchor } from 'src/styles'
import { FiDownload } from 'react-icons/fi'
import { SiDribbble, SiGithub, SiLinkedin } from 'react-icons/si'

const Root = Box.withComponent('section')

const HeroArea = styled(Root)`
  padding: 32px ${themeProps.space.md}px;
  color: ${themeProps.colors.textColorSecondary};

  ${themeProps.mediaQueries.md} {
    padding: 48px ${themeProps.space.lg}px 0;
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
  padding: 32px 0 0;

  ${themeProps.mediaQueries.md} {
    padding: 32px 0;
  }
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
  margin: 0 0 -32px;
  display: none;

  ${themeProps.mediaQueries.md} {
    display: flex;
    width: 30%;
  }

  ${themeProps.mediaQueries.lg} {
    width: 100%;
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
  transition: 800ms;

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
  padding: ${themeProps.space.md}px 0;
  min-width: 100px;
  min-height: 40px;
  border-radius: 5px;
  transition: 800ms;

  & > a {
    text-decoration: none;
  }

  ${themeProps.mediaQueries.md} {
    min-width: 150px;
    height: 65px;
  }
`

const Icon = styled(UnstyledAnchor)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: 800ms;

  &:hover {
    transform: translate(0, -5px);
  }

  & > svg {
    width: ${props => props.size}px;
    color: ${props => props.theme.colors.primary};
    height: auto;
  }
`

const SocialLinkWrapper = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  margin: 32px 0;

  ${themeProps.mediaQueries.md} {
    display: none;
  }
`

const LeftContentWrapper = styled(Box)`
  display: none;
  flex-direction: column;
  text-align: left;
  padding: 32px 0;

  ${themeProps.mediaQueries.lg} {
    display: flex;
  }

  & > ${SecondTitle} {
    padding-bottom: 32px;
  }

  & > ${FirstTitle} {
    display: block;
  }

  & > ${SocialLinkWrapper} {
    display: flex;
    padding-top: 64px;
  }
`

const Line = styled.span`
  display: block;
  width: 40px;
  height: 10px;
  background-color: ${themeProps.colors.secondary};
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
        <LeftContentWrapper>
          <FirstTitle as="p" variant={800} color="secondary">
            Hi, I am
          </FirstTitle>
          <SecondTitle as="h1" variant={1100} color="primary">
            Hani
            <br />
            Husam
          </SecondTitle>
          <Line />
          <SocialLinkWrapper>
            <Icon href="https://linkedin.com/in/hanihusamuddin" target="_blank" rel="noopener noreferrer" marginRight="24px" size="32">
              <SiLinkedin />
            </Icon>
            <Icon href="https://github.com/hanihusam" target="_blank" rel="noopener noreferrer" marginRight="24px" size="32">
              <SiGithub />
            </Icon>
            <Icon href="https://dribbble.com/hanihusam" target="_blank" rel="noopener noreferrer" marginRight="24px" size="32">
              <SiDribbble />
            </Icon>
          </SocialLinkWrapper>
        </LeftContentWrapper>
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
              <Icon
                href="https://drive.google.com/file/d/1TwgJosOspY8mrxHrTT91bKwcssOZomhn/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                marginRight="8px"
                size="16"
              >
                <FiDownload />
              </Icon>
              <Text
                as="a"
                href="https://drive.google.com/file/d/1TwgJosOspY8mrxHrTT91bKwcssOZomhn/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                variant={400}
                color="textColorPrimary"
              >
                Download CV
              </Text>
            </CVButton>
          </CtaButtonWrapper>
          <SocialLinkWrapper>
            <Icon href="https://linkedin.com/in/hanihusamuddin" target="_blank" rel="noopener noreferrer" marginRight="24px" size="32">
              <SiLinkedin />
            </Icon>
            <Icon href="https://github.com/hanihusamu" target="_blank" rel="noopener noreferrer" marginRight="24px" size="32">
              <SiGithub />
            </Icon>
            <Icon href="https://dribbble.com/hanihusam" target="_blank" rel="noopener noreferrer" marginRight="24px" size="32">
              <SiDribbble />
            </Icon>
          </SocialLinkWrapper>
        </RightContentWrapper>
      </HeroContent>
    </Column>
  </HeroArea>
)

export default Hero
