import * as React from 'react'
import styled from 'styled-components'

import { Text, Box, Stack, UnstyledAnchor, themeProps } from 'src/styles'

const Root = Box.withComponent('footer')

const FooterGrid = styled(Box)`
  padding: 36px ${themeProps.space.lg}px;
  color: ${themeProps.colors.textColorSecondary};
  background: ${themeProps.colors.card};
  grid-template-columns: 1fr 1fr minmax(auto, ${themeProps.widths.xl}px) 1fr 1fr;
`
const SocialLink = styled(UnstyledAnchor)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
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
    <FooterGrid>
      <Stack align="center" justify="center" gridColumn="3/4" textAlign="center">
        <section>
          <Text margin="0" lineHeight="20px" fontSize="12px">
            &copy; 2020 ReactJS ID.
          </Text>
          <Text margin="0" lineHeight="20px" fontSize="12px">
            Kode sumber situs ini tersedia di{' '}
            <TextLink as="a" href="https://github.com/reactjs-id/reactjs.id" rel="noopener noreferrer">
              GitHub
            </TextLink>
            . Gambar latar disediakan oleh{' '}
            <TextLink as="a" href="https://www.transparenttextures.com/" rel="noopener noreferrer">
              Transparent Textures
            </TextLink>
            .
          </Text>
        </section>
      </Stack>
    </FooterGrid>
  </Root>
)

export default Footer
