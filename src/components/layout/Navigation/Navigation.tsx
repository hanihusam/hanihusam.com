import React from 'react'
import Link from 'next/link'

import styled from 'styled-components'
import { Container, themeProps } from 'src/styles'

const LogoLink = styled.a`
  display: block;
  overflow: hidden;

  &:hover,
  &:focus,
  &:active,
  &:visited {
    text-decoration: none;
  }
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 140px;
  height: 36px;

  > img {
    ${themeProps.mediaQueries.md} {
      width: 36px !important;
      height: 36px !important;
    }
  }

  > h1 {
    font-size: ${themeProps.fonts.fontSizes.sm};
  }
`

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;

  ${themeProps.mediaQueries.lg} {
    -ms-flex-flow: row nowrap;
    flex-flow: row nowrap;
    -ms-flex-pack: start;
    justify-content: flex-start;
  }
`

const NavbarContainer = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`

const Navigation: React.FC = () => {
  return (
    <Navbar role="navigation">
      <NavbarContainer>
        <Link href="/" passHref>
          <LogoLink>
            <LogoWrapper>
              <img src="/images/logo.png" alt="hanihusam logo" aria-hidden />
              <h1>hanihusam.</h1>
            </LogoWrapper>
          </LogoLink>
        </Link>
      </NavbarContainer>
    </Navbar>
  )
}

export default Navigation
