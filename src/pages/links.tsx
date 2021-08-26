import * as React from 'react'

import { PageWrapper } from '../components/layout'
import { Box, PrimaryButton, Text, themeProps } from '../components/ui'

import styled from '@emotion/styled'
import Link from 'next/link'
import { SiDribbble, SiFigma, SiGithub, SiLinkedin, SiMedium, SiTelegram } from 'react-icons/si'

const Root = Box.withComponent('section')

const LinksArea = styled(Root)`
  flex: 1 1 auto;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100%;
  position: relative;
  padding: 32px ${themeProps.space.md}px;
  color: ${themeProps.colors.white};

  ${themeProps.mediaQueries.md} {
    padding: 48px ${themeProps.space.lg}px 0;
  }
`

const LinksContent = styled(Box)`
  display: flex;
  flex: 1 0 auto;
  max-width: 100%;
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
`

const MainWrapper = styled(Box)`
  flex: 1 1 auto;
  max-width: 100%;
  position: relative;
`

const ContentWrapper = styled(Box)`
  padding-top: 16px;
  margin: 0 auto;
  justify-content: center;
  flex-basis: 100%;
  flex-grow: 0;
  display: flex;
  flex: 1 1 auto;
  flex-wrap: nowrap;
  min-width: 0;
  max-width: 100%;

  ${themeProps.mediaQueries.xl} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const Content = styled(Box)`
  max-width: 100%;
  width: calc(512px + 24px * 2);
`
const AvatarWrapper = styled(Box)`
  text-align: center;
  margin-top: 0;
  margin-bottom: ${themeProps.space.xxl}px;
  align-items: center;
  flex-direction: column;
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-wrap: nowrap;
  min-width: 0;
`

const ProfilePicture = styled(Box)`
  border-radius: 50%;
  height: 48px;
  width: 48px;
  line-height: 48px;
  font-size: 48px;
  font-weight: 300;

  ${themeProps.mediaQueries.xl} {
    height: 64px;
    width: 64px;
    line-height: 64px;
  }
`

const Avatar = styled(Box)`
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  flex: 1 0 auto;
  max-width: 100%;
  display: flex;
  z-index: 0;

  .responsive-sizer {
    transition: padding-bottom 0.2s cubic-bezier(0.25, 0.8, 0.5, 1);
    flex: 1 0 0px;
    padding-bottom: 100%;
  }

  .ava {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(/images/logo.png);
    background-position: center center;
    background-color: rgba(0, 0, 0, 0.1);
    background-size: cover;
    background-repeat: no-repeat;
  }
`

const TextTitle = styled(Text)`
  flex: 1;
  text-align: center;
  word-break: break-word;
  padding: 12px 0;
`

const LinkButton = styled(PrimaryButton)`
  padding: 0 ${themeProps.space.lg}px;
  height: 48px;
  min-width: 100%;
  margin: auto auto ${themeProps.space.lg}px;
  vertical-align: middle;

  ${themeProps.mediaQueries.md} {
    height: 65px;
    width: 100%;
  }
`

const LinksPage: React.FC = () => (
  <PageWrapper pageTitle="Hani Husam | Links">
    <LinksArea>
      <LinksContent>
        <MainWrapper>
          <ContentWrapper>
            <Content>
              <AvatarWrapper>
                <ProfilePicture>
                  <Avatar>
                    <div className="responsive-sizer" />
                    <div className="ava" />
                  </Avatar>
                </ProfilePicture>
                <TextTitle color="primary" fontWeight="600" variant={400}>
                  Bapak2Developer.
                </TextTitle>
                <Text color="black">
                  Fulltime at home. Sometimes doing code. Sometimes doing design.
                </Text>
              </AvatarWrapper>
              <Link href="https://te.me/bapak2developer" passHref>
                <a rel="noopener noreferrer" target="_blank">
                  <LinkButton>
                    <SiTelegram style={{ marginRight: 8 }} />
                    For Business Inquiry
                  </LinkButton>
                </a>
              </Link>
              <Link href="https://figma.com/@hanihusam" passHref>
                <a rel="noopener noreferrer" target="_blank">
                  <LinkButton>
                    <SiFigma style={{ marginRight: 8 }} />
                    Figma Templates - FREE
                  </LinkButton>
                </a>
              </Link>
              <Link href="https://medium.com/ayah-rumahan" passHref>
                <a rel="noopener noreferrer" target="_blank">
                  <LinkButton>
                    <SiMedium style={{ marginRight: 8 }} />
                    Tulisan Ayah Rumahan
                  </LinkButton>
                </a>
              </Link>
              <Link href="https://linkedin.com/in/hanihusam" passHref>
                <a rel="noopener noreferrer" target="_blank">
                  <LinkButton>
                    <SiLinkedin style={{ marginRight: 8 }} /> Professional Profile
                  </LinkButton>
                </a>
              </Link>
              <Link href="https://github.com/hanihusam" passHref>
                <a rel="noopener noreferrer" target="_blank">
                  <LinkButton>
                    <SiGithub style={{ marginRight: 8 }} />
                    Github Repository
                  </LinkButton>
                </a>
              </Link>
              <Link href="https://dribbble.com/hanihusam" passHref>
                <a rel="noopener noreferrer" target="_blank">
                  <LinkButton>
                    <SiDribbble style={{ marginRight: 8 }} />
                    Design Portfolio
                  </LinkButton>
                </a>
              </Link>
            </Content>
          </ContentWrapper>
        </MainWrapper>
      </LinksContent>
    </LinksArea>
  </PageWrapper>
)

export default LinksPage
