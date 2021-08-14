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
  display: block;
  color: ${themeProps.colors.secondary};
  padding-bottom: ${themeProps.space.md}px;

  ${themeProps.mediaQueries.md} {
    display: none;
  }
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
          <FirstTitle>About Me</FirstTitle>
          <SecondTitle>Why hire me for your next project?</SecondTitle>
          <Description>
            Currently I am working as a fulltime freelancer. Before that I’ve worked at Nutrination
            Pte. Ltd (Bubays), Singapore as a Fullstack Engineer.
          </Description>
          <Description>
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
