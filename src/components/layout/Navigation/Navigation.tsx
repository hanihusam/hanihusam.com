import React from 'react'

import useDarkMode from '~/src/utils/useDarkMode'

import { Box, Text, themeProps, UnstyledButton } from '../../ui'

import {
  MainNavCenter,
  MainNavCenterLinks,
  MainNavInner,
  MainNavLink,
  MainNavRight,
  MobileNav,
  MobileNavLink,
  NavGrid
} from './components'
import Logo from './Logo'
import OptionModal from './OptionModal'

import styled from '@emotion/styled'
import { VisuallyHidden } from '@reach/visually-hidden'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaBars, FaEnvelope } from 'react-icons/fa'

const Root = Box.withComponent('header')

const LogoLinkRoot = Box.withComponent('a')

const LogoLink = styled(LogoLinkRoot)`
  display: block;
  width: 56px;
  height: 48px;
  overflow: hidden;

  ${themeProps.mediaQueries.md} {
    width: 130px;
    height: 64px;
  }

  &:hover,
  &:focus,
  &:active,
  &:visited {
    text-decoration: none;
  }
`

const LogoWrapper = styled(Box)`
  > img {
    width: 36px !important;
    height: 36px !important;
  }
  > h1 {
    font-size: 14px;
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
  border-radius: 5px 0 0 5px;
`

const ToggleButtonDark = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-left: ${themeProps.space.xs}px;
  padding-right: ${themeProps.space.sm}px;
  border-radius: 0 5px 5px 0;
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

const Navigation: React.FC = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode()
  const [isOptionModalOpen, setIsOptionModalOpen] = React.useState(false)
  const router = useRouter()

  const getMobNavIconColor = (activePath?: string) =>
    isDarkMode || router.pathname === activePath
      ? themeProps.colors.white
      : themeProps.colors.primary

  const toggleOptionModal = () => {
    setIsOptionModalOpen(!isOptionModalOpen)
  }

  return (
    <Root>
      <NavGrid>
        <MainNavInner>
          <Link href="/" passHref>
            <LogoLink>
              <VisuallyHidden>hanihusam.</VisuallyHidden>
              <LogoWrapper
                alignItems="center"
                display="flex"
                height={48}
                justifyContent="space-between"
                width={130}
              >
                <Logo isDarkMode={isDarkMode} />
              </LogoWrapper>
            </LogoLink>
          </Link>
          <MainNavCenter flex="1 1 auto">
            <MainNavCenterLinks>
              <MainNavLink href="/" isActive={router.pathname === '/'} title="Home" />
              <MainNavLink href="/about" isActive={router.pathname === '/about'} title="About" />
              <MainNavLink
                href="/projects"
                isActive={router.pathname === '/projects'}
                title="Projects"
              />
              <MainNavLink
                href="/services"
                isActive={router.pathname === '/services'}
                title="Services"
              />
            </MainNavCenterLinks>
          </MainNavCenter>
          <MainNavRight alignItems="center" display="flex">
            <ColorToggleWrapper>
              <UnstyledButton onClick={toggleDarkMode} style={{ outline: 'none' }}>
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
      <NavGrid backgroundColor="bgPrimary" color="textPrimary">
        <MobileNav backgroundColor="navgridbgmobile">
          <MobileNavLink href="/" icon={<Logo />} isActive={router.pathname === '/'} />
          <MobileNavLink
            href="mailto:hani.husam@gmail.com"
            icon={<FaEnvelope fill={getMobNavIconColor()} />}
            title="Email Me"
          />
          <OptionButton onClick={toggleOptionModal} style={{ outline: 'none' }} type="button">
            <OptionButtonIcon>
              <FaBars fill={getMobNavIconColor()} />
            </OptionButtonIcon>
            <Text color="primary" variant={100}>
              Menu
            </Text>
          </OptionButton>
        </MobileNav>
      </NavGrid>
      <OptionModal isOpen={isOptionModalOpen} onClose={toggleOptionModal} />
    </Root>
  )
}

export default Navigation
