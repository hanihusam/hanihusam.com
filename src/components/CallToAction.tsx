import React from 'react'

import styled from 'styled-components'
import { Box, Column, Text, themeProps, UnstyledButton } from 'src/styles'

const Section = Box.withComponent('section')

const CtaArea = styled(Section)`
  padding: 32px ${themeProps.space.md}px;
  color: ${themeProps.colors.textColorSecondary};
  background: ${themeProps.colors.card};

  ${themeProps.mediaQueries.md} {
    padding: 48px ${themeProps.space.lg}px 64px;
  }
`

const CtaContent = styled(Box)`
  display: flex;
  flex-direction: column;
  text-align: center;

  ${themeProps.mediaQueries.md} {
    text-align: left;
    flex-direction: row;
  }
`

const TextTitle = styled(Text)`
  flex: 1;
  margin-bottom: ${themeProps.space.md}px;
  color: ${themeProps.colors.header};
`

const CtaButtonWrapper = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: center;

  ${themeProps.mediaQueries.md} {
    justify-content: flex-end;
  }
`

const HireMeButton = styled(UnstyledButton)`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: ${themeProps.space.md}px;
  min-width: 100px;
  min-height: 40px;
  margin-left: ${themeProps.space.md}px;
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
    margin-left: ${themeProps.space.xl}px;
    min-width: 150px;
    min-height: 60px;
    margin-right: 0;
  }
`

const SeeMoreButton = styled(UnstyledButton)`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: ${themeProps.space.md}px;
  min-width: 150px;
  min-height: 60px;
  margin-left: ${themeProps.space.md}px;
  margin-right: ${themeProps.space.md}px;
  border-radius: 5px;
  transition: 500ms;

  &:hover {
    background-color: ${themeProps.colors.secondary};
  }

  ${themeProps.mediaQueries.md} {
    margin-left: ${themeProps.space.xl}px;
    margin-right: 0;
  }
`

const CallToAction: React.FC = () => (
  <CtaArea>
    <Column>
      <CtaContent>
        <TextTitle as="h1" variant={800}>
          Interested working with me?
        </TextTitle>
        <CtaButtonWrapper>
          <SeeMoreButton border="1px solid" borderColor="secondary" color="white">
            <Text variant={400}>See More Projects</Text>
          </SeeMoreButton>
          <HireMeButton backgroundColor="secondary" color="white">
            <Text as="a" href="mailto:hani.husam@gmail.com" variant={400}>
              Hire Me
            </Text>
          </HireMeButton>
        </CtaButtonWrapper>
      </CtaContent>
    </Column>
  </CtaArea>
)

export default CallToAction
