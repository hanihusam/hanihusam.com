import * as React from 'react'

import Column from './layout/Column'
import { Box, Heading, Paragraph, Text, themeProps, Verse } from './ui'

import styled from '@emotion/styled'

const Root = Box.withComponent('section')

const AboutMeArea = styled(Root)`
  padding: 32px ${themeProps.space.md}px;
  margin: 0 0 48px;
  color: ${themeProps.colors.secondary};
  background: ${themeProps.colors.card};

  ${themeProps.mediaQueries.md} {
    padding: ${themeProps.space.xxxl}px ${themeProps.space.lg}px;
    margin: 0 auto 48px;
    border-radius: 20px;
  }
`

const AboutMeContent = styled(Box)`
  display: flex;
  flex-direction: column;
  text-align: center;

  ${themeProps.mediaQueries.md} {
    text-align: left;
    flex-direction: row;
    justify-content: space-between;
  }
`

const FirstTitle = styled(Verse)`
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

const LeftContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 32px ${themeProps.space.md}px;
`

const RightContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 32px 0 0;

  ${themeProps.mediaQueries.md} {
    padding: 32px 0;
    margin-left: 32px;
  }

  & > ${SecondTitle} {
    padding-bottom: 32px;
  }

  & > ${FirstTitle} {
    display: block;
  }
`

const AboutMe: React.FC = () => (
  <AboutMeArea>
    <Column>
      <AboutMeContent>
        <LeftContentWrapper>
          <img alt="About Me Avatar" src="/images/aboutme-illustration.svg" />
        </LeftContentWrapper>
        <RightContentWrapper>
          <FirstTitle color="secondary">About Me</FirstTitle>
          <SecondTitle color="white">Why hire me for your next project?</SecondTitle>
          <Description color="white">
            Currently I am working as a fulltime freelancer. Before that I’ve worked at Nutrination
            Pte. Ltd (Bubays), Singapore as a Fullstack Engineer.
          </Description>
          <Description color="white">
            I find my self as a creative, reliable and detailed freelancer who can work
            independently without too many detailed instructions. I have a principle that is
            &quot;stay simple and stay humble&quot;. I believe that in simplicity there is a
            complexity and very deep thoroughness. I see every project as a process of solving a
            problem. Then it is time for your problems to be resolved in detail, in depth, and of
            course in simplicity.
          </Description>
        </RightContentWrapper>
      </AboutMeContent>
    </Column>
  </AboutMeArea>
)

export default AboutMe
