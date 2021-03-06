import * as React from 'react'
import styled from 'styled-components'

import { Box, themeProps, Column, Text, Heading, Paragraph } from 'src/styles'

const Root = Box.withComponent('section')

const AboutMeArea = styled(Root)`
  padding: 32px ${themeProps.space.md}px;
  margin: 0 0 48px;
  color: ${themeProps.colors.textColorSecondary};
  background: ${themeProps.colors.card};

  ${themeProps.mediaQueries.md} {
    padding: 48px ${themeProps.space.lg}px 0;
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
          <img src="/images/aboutme-illustration.svg" alt="About Me Avatar" />
        </LeftContentWrapper>
        <RightContentWrapper>
          <FirstTitle as="p" variant={400} color="secondary">
            About Me
          </FirstTitle>
          <SecondTitle variant={900} color="header">
            Why hire me for your next project?
          </SecondTitle>
          <Description color="textColorSecondary">
            Currently I am working as a fulltime freelancer. Before that I’ve worked at Nutrination Pte. Ltd (Bubays), Singapore as a
            Fullstack Engineer.
          </Description>
          <Description color="textColorSecondary">
            I find my self as a creative, reliable and detailed freelancer who can work independently without too many detailed
            instructions. I have a principle that is "stay simple and stay humble". I believe that in simplicity there is a complexity and
            very deep thoroughness. I see every project as a process of solving a problem. Then it is time for your problems to be resolved
            in detail, in depth, and of course in simplicity.
          </Description>
        </RightContentWrapper>
      </AboutMeContent>
    </Column>
  </AboutMeArea>
)

export default AboutMe
