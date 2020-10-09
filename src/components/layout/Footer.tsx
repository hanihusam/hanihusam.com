import * as React from 'react'
import styled from 'styled-components'

import { Text, Box, Stack, UnstyledAnchor, themeProps } from 'src/styles'
import { SiLinkedin, SiGithub, SiDribbble } from 'react-icons/si'

const FooterArea = Box.withComponent('footer')

const Root = styled(FooterArea)`
  padding: 0px ${themeProps.space.md}px 84px;
  color: ${themeProps.colors.textColorSecondary};
  background: ${themeProps.colors.card};

  ${themeProps.mediaQueries.md} {
    padding: 48px ${themeProps.space.lg}px 84px;
  }
`

const FooterBox = styled(Box)`
  padding: 36px ${themeProps.space.lg}px;
  grid-template-columns: 1fr 1fr minmax(auto, ${themeProps.widths.xl}px) 1fr 1fr;
`

const FooterContent = styled(Stack)`
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
    <FooterBox>
      <FooterContent align="center" justify="center" gridColumn="3/4" textAlign="center">
        <ContentGrid>
          <FooterSocials display="flex" justifyContent="center">
            <Box display="grid" gridTemplateColumns="24px 24px 24px" gridGap="xl">
              <SocialLink href="https://linkedin.com/in/hanihusamuddin" target="_blank" rel="noopener noreferrer">
                <SiLinkedin />
              </SocialLink>
              <SocialLink href="https://github.com/hanihusam" target="_blank" rel="noopener noreferrer">
                <SiGithub />
              </SocialLink>
              <SocialLink href="https://dribbble.com/hanihusam" target="_blank" rel="noopener noreferrer">
                <SiDribbble />
              </SocialLink>
            </Box>
          </FooterSocials>
          <FooterCopyright display="flex" alignItems="center">
            <Text as="p">
              For business inquiry please send email to{' '}
              <TextLink as="a" href="mailto:hani.husam@gmail.com" rel="noopener noreferrer">
                hani.husam@gmail.com
              </TextLink>
              .<br /> &copy; 2020 hanihusam. All rights reserved.
            </Text>
          </FooterCopyright>
        </ContentGrid>
      </FooterContent>
    </FooterBox>
  </Root>
)

export default Footer
