import React from 'react'

import Column from './layout/Column'
import { Box, Heading, Paragraph, Text, themeProps, UnstyledAnchor, UnstyledButton } from './ui'

import styled from '@emotion/styled'
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
      <img alt="avatar" src="/images/avatar-sm.png" />
    </AvatarMobile>
    <AvatarDesktop as="div" justifyContent="center">
      <img alt="avatar" src="/images/avatar-lg.png" />
    </AvatarDesktop>
  </>
)

const Hero: React.FC = () => (
  <HeroArea>
    <Column>
      <HeroContent>
        <LeftContentWrapper>
          <FirstTitle as="p" color="secondary" variant={800}>
            Hi, I am
          </FirstTitle>
          <SecondTitle as="h1" color="primary" variant={1100}>
            Hani
            <br />
            Husam
          </SecondTitle>
          <Line />
          <SocialLinkWrapper>
            <Icon
              href="https://linkedin.com/in/hanihusamuddin"
              marginRight="24px"
              rel="noopener noreferrer"
              size="32"
              target="_blank"
            >
              <SiLinkedin />
            </Icon>
            <Icon
              href="https://github.com/hanihusam"
              marginRight="24px"
              rel="noopener noreferrer"
              size="32"
              target="_blank"
            >
              <SiGithub />
            </Icon>
            <Icon
              href="https://dribbble.com/hanihusam"
              marginRight="24px"
              rel="noopener noreferrer"
              size="32"
              target="_blank"
            >
              <SiDribbble />
            </Icon>
          </SocialLinkWrapper>
        </LeftContentWrapper>
        <Avatar />
        <RightContentWrapper>
          <FirstTitle as="p" color="secondary" variant={800}>
            Hi, I am Han
          </FirstTitle>
          <SecondTitle color="primary" variant={900}>
            Web Developer and UI Designer based in Yogyakarta, Indonesia.
          </SecondTitle>
          <Description color="textColorPrimary">
            I am a “half-blood” Web Developer and UI Designer who has experience creating many
            projects in a various industry. In other words, I understand how to build an aesthetic,
            powerful, and lightweight website at once.
          </Description>
          <CtaButtonWrapper>
            <EmailMeButton backgroundColor="secondary" boxShadow="double" color="white">
              <Text as="a" variant={400}>
                Email Me
              </Text>
            </EmailMeButton>
            <CVButton>
              <Icon
                href="https://drive.google.com/file/d/1TwgJosOspY8mrxHrTT91bKwcssOZomhn/view?usp=sharing"
                marginRight="8px"
                rel="noopener noreferrer"
                size="16"
                target="_blank"
              >
                <FiDownload />
              </Icon>
              {/* <Text
                as="a"
                color="textColorPrimary"
                href="https://drive.google.com/file/d/1TwgJosOspY8mrxHrTT91bKwcssOZomhn/view?usp=sharing"
                rel="noopener noreferrer"
                target="_blank"
                variant={400}
              >
                Download CV
              </Text> */}
            </CVButton>
          </CtaButtonWrapper>
          <SocialLinkWrapper>
            <Icon
              href="https://linkedin.com/in/hanihusamuddin"
              marginRight="24px"
              rel="noopener noreferrer"
              size="32"
              target="_blank"
            >
              <SiLinkedin />
            </Icon>
            <Icon
              href="https://github.com/hanihusamu"
              marginRight="24px"
              rel="noopener noreferrer"
              size="32"
              target="_blank"
            >
              <SiGithub />
            </Icon>
            <Icon
              href="https://dribbble.com/hanihusam"
              marginRight="24px"
              rel="noopener noreferrer"
              size="32"
              target="_blank"
            >
              <SiDribbble />
            </Icon>
          </SocialLinkWrapper>
        </RightContentWrapper>
      </HeroContent>
    </Column>
  </HeroArea>
)

export default Hero
