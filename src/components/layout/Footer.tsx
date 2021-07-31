import * as React from 'react'

import { Box, Text, themeProps, UnstyledAnchor, Verse } from '../ui'

import Column from './Column'

import styled from '@emotion/styled'
import Link from 'next/link'
import { SiDribbble, SiGithub, SiLinkedin } from 'react-icons/si'

const FooterArea = Box.withComponent('footer')

const Root = styled(FooterArea)`
  padding: 0px ${themeProps.space.md}px 84px;
  color: ${themeProps.colors.white};
  background: ${themeProps.colors.card};

  ${themeProps.mediaQueries.md} {
    padding: 48px ${themeProps.space.lg}px 84px;
  }
`

const FooterBox = styled(Box)`
  padding: 36px 0;
  grid-template-columns: 1fr 1fr minmax(auto, ${themeProps.widths.xl}px) 1fr 1fr;
`

const FooterContent = styled(Box)`
  padding-top: 72px;
  border-top: 1px solid rgb(126, 126, 136);
`

const ContentGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    'socials'
    'contact'
    'copyright';
  grid-gap: 16px;
`

const FooterSocials = styled(Box)`
  grid-area: socials;
  align-items: center;
  margin: ${themeProps.space.xs}px 0;
`

const SocialLink = styled(UnstyledAnchor)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`

const FooterCopyright = styled(Box)`
  grid-area: copyright;
  justify-content: center;
  text-align: center;
  margin: ${themeProps.space.xs}px 0;

  a {
    text-decoration: none;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
`

const TextLink = styled(Text)`
  color: #ffffff;
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`

const Footer: React.FC = () => (
  <Root>
    <Column>
      <FooterBox>
        <FooterContent gridColumn="3/4" textAlign="center">
          <ContentGrid>
            <FooterSocials display="flex" justifyContent="center">
              <Box display="grid" gridGap="xl" gridTemplateColumns="24px 24px 24px">
                <SocialLink
                  href="https://linkedin.com/in/hanihusamuddin"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <SiLinkedin />
                </SocialLink>
                <SocialLink
                  href="https://github.com/hanihusam"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <SiGithub />
                </SocialLink>
                <SocialLink
                  href="https://dribbble.com/hanihusam"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <SiDribbble />
                </SocialLink>
              </Box>
            </FooterSocials>
            <FooterCopyright alignItems="center" display="flex">
              <Verse>
                For business inquiry please send email to{' '}
                <Link href="malito:hani.husam@gmail.com" passHref>
                  <TextLink as="a" fontWeight={500}>
                    hani.husam@gmail.com
                  </TextLink>
                </Link>
                .<br /> &copy; 2021 hanihusam. All rights reserved.
              </Verse>
            </FooterCopyright>
          </ContentGrid>
        </FooterContent>
      </FooterBox>
    </Column>
  </Root>
)

export default Footer
