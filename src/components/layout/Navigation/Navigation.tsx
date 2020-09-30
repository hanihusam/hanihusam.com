import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styled from 'styled-components'
import { themeProps, UnstyledButton, Box, Text } from 'src/styles'
import useDarkMode from 'src/utils/useDarkMode'
import {
  NavGrid,
  MainNavInner,
  MainNavCenter,
  MainNavCenterLinks,
  MainNavLink,
  MainNavRight,
  MainNavigation,
  MobileNav,
  MobileNavLink
} from './components'

const Root = Box.withComponent('header')

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
    width: 36px !important;
    height: 36px !important;
  }

  > h1 {
    font-size: ${themeProps.fonts.fontSizes.sm};
  }
`

const ColorToggleWrapper = styled(Box)`
  display: none;
  justify-content: space-between;
  align-items: center;

  ${themeProps.mediaQueries.sm} {
    display: flex;
  }
`

const ToggleButtonInnerWrapper = styled.div`
  display: flex;
  width: 134px;
  height: 32px;
  font-weight: bold;
  line-height: 1;
`

const ToggleButtonLight = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-left: ${themeProps.space.sm}px;
  padding-right: ${themeProps.space.xs}px;
  border-radius: 16px 0 0 16px;
`

const ToggleButtonDark = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-left: ${themeProps.space.xs}px;
  padding-right: ${themeProps.space.sm}px;
  border-radius: 0 16px 16px 0;
`

const OptionButton = styled(UnstyledButton)`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  margin-bottom: 2px;
`

const OptionButtonIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 4px 0;
  margin-bottom: 2px;
`

const PageTitle = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${themeProps.mediaQueries.sm} {
    display: none;
  }
`

const Navigation: React.FC = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode()
  const router = useRouter()

  return (
    <Root>
      <NavGrid>
        <MainNavInner>
          <Link href="/" passHref>
            <LogoLink>
              <LogoWrapper>
                <img src={isDarkMode ? '/images/logo-dark.png' : '/images/logo.png'} alt="hanihusam logo" aria-hidden />
                <h1 style={isDarkMode ? { color: '#F2F2F2' } : { color: '#7A8391' }}>hanihusam.</h1>
              </LogoWrapper>
            </LogoLink>
          </Link>
          <MainNavCenter flex="1 1 auto">
            <MainNavCenterLinks>
              <MainNavLink href="/" title="Home" isActive={router.pathname === '/'} />
              <MainNavLink href="#about" as="/about" title="About" isActive={router.pathname === '/about'} />
              <MainNavLink href="#projects" as="/projects" title="Projects" isActive={router.pathname === '/projects'} />
              <MainNavLink href="#services" as="/services" title="Services" isActive={router.pathname === '/services'} />
            </MainNavCenterLinks>
          </MainNavCenter>
          <MainNavRight display="flex" alignItems="center">
            <ColorToggleWrapper>
              <UnstyledButton style={{ outline: 'none' }} onClick={toggleDarkMode}>
                <ToggleButtonInnerWrapper>
                  <ToggleButtonLight backgroundColor="buttonlightmode" color="buttonlightmodetext">
                    <Text variant={200}>Light</Text>
                  </ToggleButtonLight>
                  <ToggleButtonDark backgroundColor="buttondarkmode" color="buttondarkmodetext">
                    <Text variant={200}>Dark</Text>
                  </ToggleButtonDark>
                </ToggleButtonInnerWrapper>
              </UnstyledButton>
            </ColorToggleWrapper>
          </MainNavRight>
        </MainNavInner>
      </NavGrid>
    </Root>
  )
}

export default Navigation
