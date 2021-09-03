import React from 'react'

import Column from '../layout/Column'
import { Box, GhostButton, PrimaryButton, Text, themeProps } from '../ui'

import styled from '@emotion/styled'
import Link from 'next/link'

const Section = Box.withComponent('section')

const CtaArea = styled(Section)`
  padding: 0px ${themeProps.space.md}px 84px;
  margin-bottom: 0;

  ${themeProps.mediaQueries.md} {
    padding: ${themeProps.space.xxxl}px ${themeProps.space.lg}px;
    margin-bottom: -120px;
    z-index: 1;
  }
`

const CtaContent = styled(Box)`
  border-radius: 4px;
  color: ${themeProps.colors.secondary};
  background: ${themeProps.colors.card};
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: ${themeProps.space.lg}px;

  ${themeProps.mediaQueries.md} {
    text-align: left;
    flex-direction: row;
    padding: 64px;
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
  flex-direction: column;
  flex: 1;
  justify-content: center;

  ${themeProps.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-end;
  }
`

const HireMeButton = styled(PrimaryButton)`
  margin-bottom: ${themeProps.space.sm}px;

  ${themeProps.mediaQueries.md} {
    margin: 0 ${themeProps.space.sm}px;
  }
`

const SeeMoreButton = styled(GhostButton)`
  margin-bottom: ${themeProps.space.sm}px;

  ${themeProps.mediaQueries.md} {
    margin: 0 ${themeProps.space.sm}px;
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
          <SeeMoreButton>
            <Text>Ask Me First</Text>
          </SeeMoreButton>
          <Link href="mailto:hani.husam@gmail.com" passHref>
            <HireMeButton type="button">
              <Text as="a">Let's Connect</Text>
            </HireMeButton>
          </Link>
        </CtaButtonWrapper>
      </CtaContent>
    </Column>
  </CtaArea>
)

export default CallToAction
