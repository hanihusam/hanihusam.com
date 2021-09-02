import * as React from 'react'

import Column from '../layout/Column'
import { Box, Heading, Paragraph, themeProps, Verse } from '../ui'

import styled from '@emotion/styled'

const Root = Box.withComponent('section')

const AboutMeArea = styled(Root)`
  padding: 0 0 40px;

  ${themeProps.mediaQueries.md} {
    padding: 0 ${themeProps.space.xxxl}px ${themeProps.space.lg}px;
    margin: 0 auto 108px;
  }
`

const AboutMeContent = styled(Box)`
  color: ${themeProps.colors.secondary};
  background: ${themeProps.colors.card};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: ${themeProps.space.md}px;

  ${themeProps.mediaQueries.md} {
    padding: 80px ${themeProps.space.xxxl}px;
    text-align: left;
    flex-direction: row;
    justify-content: space-between;
  }
`

const FirstTitle = styled(Verse)`
  color: ${themeProps.colors.secondary};
  padding-bottom: ${themeProps.space.md}px;
`

const SecondTitle = styled(Heading)`
  color: ${themeProps.colors.white};
  padding-bottom: ${themeProps.space.md}px;
`

const Description = styled(Paragraph)`
  color: ${themeProps.colors.white};
  padding-bottom: ${themeProps.space.md}px;
`

const LeftContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 32px ${themeProps.space.md}px;

  ${themeProps.mediaQueries.md} {
    padding: 32px 0;
  }
`

const RightContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 32px 0 0;

  ${themeProps.mediaQueries.md} {
    padding: 32px 0;
    margin: 0 0 0 56px;
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
          <FirstTitle>About Me</FirstTitle>
          <SecondTitle>Why hire me for your next project?</SecondTitle>
          <Description>
            In the past, I worked at a Singapore venture-backed startup as a Fullstack Developer.
          </Description>
          <Description>
            I have a principle that is &quot;stay simple and stay humble&quot;. I believe,
            simplicity hides a great deal of complexity and thoroughness. I see every project as a
            process of solving a problem. Now it's time to solve your problems in detail, in depth,
            and of course with simplicity.
          </Description>
        </RightContentWrapper>
      </AboutMeContent>
    </Column>
  </AboutMeArea>
)

export default AboutMe
