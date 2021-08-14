import React from 'react'

import { Column, Content } from '../layout'
import {
  AnchorButton,
  Box,
  Heading,
  Paragraph,
  PrimaryButton,
  Text,
  themeProps,
  UnstyledAnchor
} from '../ui'

import styled from '@emotion/styled'
import Link from 'next/link'
import { FiDownload } from 'react-icons/fi'
import { SiDribbble, SiGithub, SiLinkedin } from 'react-icons/si'

const Section = Content.withComponent('section')

const Root = styled(Section)`
  padding: ${themeProps.space.xl}px ${themeProps.space.md}px ${themeProps.space.md}px;
  color: ${themeProps.colors.secondary};

  ${themeProps.mediaQueries.sm} {
    padding: 6vh ${themeProps.space.md}px 0;
  }

  ${themeProps.mediaQueries.md} {
    padding: 6vh ${themeProps.space.lg}px 0;
  }

  ${themeProps.mediaQueries.lg} {
    padding: 12vh ${themeProps.space.lg}px 0;
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

  & > ${Heading} {
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
  <Root noPadding>
    <Column>
      <HeroContent>
        <LeftContentWrapper>
          <FirstTitle color="secondary" variant={800}>
            Hi, I am
          </FirstTitle>
          <Heading
            color="primary"
            fontWeight={900}
            paddingBottom={themeProps.space.md}
            variant={1100}
          >
            Han
          </Heading>
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
          <Heading color="primary" paddingBottom={themeProps.space.xl}>
            Web Developer and UI Designer based in Yogyakarta, Indonesia.
          </Heading>
          <Paragraph color="black" paddingBottom={themeProps.space.xxl}>
            I am a “half-blood” Web Developer and UI Designer who has experience creating many
            projects in a various industry. In other words, I understand how to build an aesthetic,
            powerful, and lightweight website at once.
          </Paragraph>
          <CtaButtonWrapper>
            <PrimaryButton type="button">
              <Text>Email Me</Text>
            </PrimaryButton>
            <Link
              href="https://drive.google.com/file/d/1TwgJosOspY8mrxHrTT91bKwcssOZomhn/view?usp=sharing"
              passHref
            >
              <AnchorButton type="button">
                <Icon marginRight="8px" rel="noopener noreferrer" size="16" target="_blank">
                  <FiDownload />
                </Icon>
                <Text color="black">Download CV</Text>
              </AnchorButton>
            </Link>
            {/* <CVButton>
              <Icon
                href="https://drive.google.com/file/d/1TwgJosOspY8mrxHrTT91bKwcssOZomhn/view?usp=sharing"
                marginRight="8px"
                rel="noopener noreferrer"
                size="16"
                target="_blank"
              >
                <FiDownload />
              </Icon>
              <Text
                as="a"
                color="textColorPrimary"
                href="https://drive.google.com/file/d/1TwgJosOspY8mrxHrTT91bKwcssOZomhn/view?usp=sharing"
                rel="noopener noreferrer"
                target="_blank"
                variant={400}
              >
                Download CV
              </Text>
            </CVButton> */}
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
  </Root>
)

export default Hero
