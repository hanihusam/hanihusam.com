import React from 'react'

import Column from './layout/Column'
import { Box, GhostButton, PrimaryButton, Text, themeProps } from './ui'

import styled from '@emotion/styled'
import Link from 'next/link'

const Section = Box.withComponent('section')

const CtaArea = styled(Section)`
  padding: 32px ${themeProps.space.md}px;
  color: ${themeProps.colors.secondary};
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
  margin-bottom: ${themeProps.space.lg}px;
  color: ${themeProps.colors.header};

  ${themeProps.mediaQueries.md} {
    margin-bottom: ${themeProps.space.md}px;
  }
`

const CtaButtonWrapper = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: center;

  ${themeProps.mediaQueries.md} {
    justify-content: flex-end;
  }
`

const HireMeButton = styled(PrimaryButton)`
  margin: 0 ${themeProps.space.sm}px;
`

const SeeMoreButton = styled(GhostButton)`
  margin: 0 ${themeProps.space.sm}px;
`

const CallToAction: React.FC = () => (
  <CtaArea>
    <Column>
      <CtaContent>
        <TextTitle as="h1" variant={800}>
          Interested working with me?
        </TextTitle>
        <CtaButtonWrapper>
          <SeeMoreButton>
            <Text>See More Projects</Text>
          </SeeMoreButton>
          <Link href="mailto:hani.husam@gmail.com" passHref>
            <HireMeButton type="button">
              <Text as="a">Hire Me</Text>
            </HireMeButton>
          </Link>
        </CtaButtonWrapper>
      </CtaContent>
    </Column>
  </CtaArea>
)

export default CallToAction
