import * as React from 'react'
import styled from 'styled-components'

import { Box, themeProps, Text, UnstyledButton } from 'src/styles'
import { PageWrapper } from '~/components/layout'

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
  color: ${themeProps.colors.textColorSecondary};

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
  margin-bottom: 20px;
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
  font-size: ${themeProps.fonts.fontSizes['4xl']};
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
  margin-top: 12px;
  word-break: break-word;
  margin-bottom: ${themeProps.space.md}px;
`

const LinkButton = styled(UnstyledButton)`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 0 ${themeProps.space.lg}px;
  height: 48px;
  min-width: 100%;
  margin: auto auto ${themeProps.space.lg}px;
  border-radius: 5px;
  transition: 800ms;
  vertical-align: middle;

  & > a {
    color: #ffffff;
    text-decoration: none;
  }

  &:hover {
    filter: brightness(80%);
  }

  ${themeProps.mediaQueries.md} {
    height: 65px;
  }
`

const LinksPage: React.FC = () => (
  <PageWrapper title="Hani Husam | Links" description="Link channel list">
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
                <TextTitle as="h3" variant={800} color="primary">
                  Hani Husam
                </TextTitle>
              </AvatarWrapper>
              <LinkButton backgroundColor="secondary" color="white" boxShadow="double">
                <Text as="a" href="https://medium.com/ayah-rumahan" target="_blank" rel="noopener noreferrer" variant={400}>
                  Medium — Ayah Rumahan
                </Text>
              </LinkButton>
              <LinkButton backgroundColor="secondary" color="white" boxShadow="double">
                <Text as="a" href="https://linkedin.com/in/hanihusam" target="_blank" rel="noopener noreferrer" variant={400}>
                  Linkedin
                </Text>
              </LinkButton>
              <LinkButton backgroundColor="secondary" color="white" boxShadow="double">
                <Text as="a" href="https://github.com/hanihusam" target="_blank" rel="noopener noreferrer" variant={400}>
                  Github
                </Text>
              </LinkButton>
              <LinkButton backgroundColor="secondary" color="white" boxShadow="double">
                <Text as="a" href="https://dribbble.com/hanihusam" target="_blank" rel="noopener noreferrer" variant={400}>
                  Dribbble
                </Text>
              </LinkButton>
              <LinkButton backgroundColor="secondary" color="white" boxShadow="double">
                <Text as="a" href="https://upwork.com/fl/hanihusamuddin" target="_blank" rel="noopener noreferrer" variant={400}>
                  Upwork
                </Text>
              </LinkButton>
            </Content>
          </ContentWrapper>
        </MainWrapper>
      </LinksContent>
    </LinksArea>
  </PageWrapper>
)

export default LinksPage
