import * as React from 'react'

import { Box, Portal, UnstyledButton } from '../../ui'

import { NavGrid, NavInner } from './components/NavComponents'
import NavLinkVertical from './NavLinkVertical'

import styled from '@emotion/styled'
import { FaTimes } from 'react-icons/fa'
import useDarkMode from 'src/utils/useDarkMode'
import Logo from './Logo'

export const OptionModalButton = styled(UnstyledButton)``

interface OptionModalProps {
  isOpen?: boolean
  onClose?: () => void
}

const Container = styled(Box)`
  overflow-x: hidden;
  overflow-y: auto;
`

const VerticalNavGrid = styled(NavGrid)`
  display: flex;
  flex-direction: column;
  flex: 0;
`

const NavInnerHeader = styled(NavInner)`
  font-size: 12px;
  line-height: 16px;
  font-weight: bold;
  margin: 16px 0;
`

const NavLabel = styled(Box)`
  margin: 0;
`

const ToggleButton = styled(UnstyledButton)`
  outline: none;
  margin-left: 0;
`

const ToggleButtonLight = styled(ToggleButton)`
  padding-left: 15px;
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
`
const ToggleButtonDark = styled(ToggleButton)`
  padding-right: 15px;
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
`

const Footer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  bottom: -54px;
  width: 100%;
  height: 54px;
  background: rgb(34, 39, 45, 0.8);
`

const CloseButtonContainer = styled(UnstyledButton)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(100% / 3);
  height: 100%;
  font-size: 10px;
`

const CloseButtonIconWrapper = styled(Box)`
  > svg {
    margin-top: 1px;
    margin-left: -1px;
  }

  margin-bottom: 4px;
`

const NavInnerFooter = styled(NavInnerHeader)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
`

const OptionModal: React.FC<OptionModalProps> = ({ isOpen, onClose }) => {
  const [, toggleDarkMode] = useDarkMode()

  const toggleModal = () => {
    if (onClose) {
      onClose()
    }
  }

  React.useEffect(() => {
    document.body.classList.toggle('noscroll', isOpen)
  }, [isOpen])

  const renderInnerContent = () => {
    if (isOpen) {
      return (
        <Box
          backgroundColor="background"
          color="primary"
          display="flex"
          flexDirection="column"
          height="calc(100% - 54px)"
          left={0}
          position="fixed"
          top={0}
          width="100%"
          zIndex={50}
        >
          <NavGrid backgroundColor="background" color="primary">
            <NavInner display="flex" flexDirection="row">
              <Box
                alignItems="center"
                display="flex"
                flex="1 1 auto"
                flexDirection="row"
                height={60}
              >
                <Logo />
              </Box>
            </NavInner>
          </NavGrid>
          <Container>
            <VerticalNavGrid backgroundColor="background" color="primary" flex="1 1 auto">
              <NavInnerFooter display="flex" flexDirection="column">
                <NavLabel>Theme mode</NavLabel>
                <Box>
                  <ToggleButtonLight
                    backgroundColor="buttonlightmode"
                    borderRadius={2}
                    color="buttonlightmodetext"
                    ml="sm"
                    onClick={toggleDarkMode}
                    px="xs"
                    py="xxs"
                    type="button"
                  >
                    Light
                  </ToggleButtonLight>
                  <ToggleButtonDark
                    backgroundColor="buttondarkmode"
                    borderRadius={2}
                    color="buttondarkmodetext"
                    margin="0"
                    ml="sm"
                    onClick={toggleDarkMode}
                    px="xs"
                    py="xxs"
                    type="button"
                  >
                    Dark
                  </ToggleButtonDark>
                </Box>
              </NavInnerFooter>
            </VerticalNavGrid>
            <VerticalNavGrid backgroundColor="background" color="primary" flex="1 1 auto">
              <NavLinkVertical href="/about" title="About" />
              <NavLinkVertical href="/posts" title="Posts" />
              <NavLinkVertical href="/projects" title="Projects" />
              <NavLinkVertical href="/bookmarks" title="Bookmarks" />
            </VerticalNavGrid>
          </Container>
          <Footer>
            <CloseButtonContainer backgroundColor="background" onClick={toggleModal} type="button">
              <CloseButtonIconWrapper
                alignItems="center"
                backgroundColor="brandred"
                borderRadius={20}
                display="flex"
                justifyContent="center"
                size={20}
              >
                <FaTimes />
              </CloseButtonIconWrapper>
              Close
            </CloseButtonContainer>
          </Footer>
        </Box>
      )
    }

    return null
  }

  return <Portal>{renderInnerContent()}</Portal>
}

OptionModal.defaultProps = {
  isOpen: false,
  onClose: undefined
}

export default OptionModal
