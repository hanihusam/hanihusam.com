import * as React from 'react'
import useDarkMode from 'src/utils/useDarkMode'
import styled from 'styled-components'
import { Portal, UnstyledButton, Box } from 'src/styles'
import { NavGrid, NavInner } from './components/NavComponents'
import NavLinkVertical from './NavLinkVertical'

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
  width: calc(100% / 5);
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
  const [isDarkMode, toggleDarkMode] = useDarkMode()

  const iconColor = isDarkMode ? '#666b73' : '#666B73'

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
          display="flex"
          flexDirection="column"
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="calc(100% - 54px)"
          backgroundColor="bgPrimary"
          color="textPrimary"
          zIndex={50}
        >
          <NavGrid backgroundColor="bgPrimary" color="textPrimary">
            <NavInner display="flex" flexDirection="row">
              <Box display="flex" flexDirection="row" alignItems="center" flex="1 1 auto" height={60}>
                <img src={isDarkMode ? '/images/logo-dark.png' : '/images/logo.png'} alt="hanihusam logo" aria-hidden />
              </Box>
            </NavInner>
          </NavGrid>
          <Container>
            <VerticalNavGrid backgroundColor="bgPrimary" color="textPrimary" flex="1 1 auto">
              <NavInnerHeader display="flex" flexDirection="column">
                Seputar COVID19
              </NavInnerHeader>
              <NavLinkVertical
                href="/pranala"
                title="Pranala Penting"
                // icon={<ChainIcon fill={iconColor} />}
              />
              {/* <NavLinkVertical
                href="/ongoing"
                title="Langganan Informasi"
                icon={<WhatsappIcon fill={iconColor} />}
              />
              <NavLinkVertical
                href="/ongoing"
                title="Hotline KawalCOVID19"
                icon={<DialogIcon fill={iconColor} />}
              /> */}
              <NavLinkVertical
                href="https://berbagibantuan.kawalcovid19.id"
                title="Berbagi Bantuan"
                // icon={<BerbagiIcon fill={iconColor} />}
              />
              <NavLinkVertical
                href="/unduh-aplikasi"
                title="Unduh Aplikasi Mobile"
                // icon={<MobileIcon fill={iconColor} />}
              />
              <NavInnerHeader display="flex" flexDirection="column">
                KawalCOVID19
              </NavInnerHeader>
              <NavLinkVertical
                href="/tentang-kami"
                title="Tentang Kami"
                // icon={<ProfileIcon fill={iconColor} />}
              />
              {/* <NavLinkVertical
                href="/ongoing"
                title="Hubungi Kami"
                icon={<MailIcon fill={iconColor} />}
              />
              <NavLinkVertical
                href="/ongoing"
                title="Bergabung/Kontribusi"
                icon={<ContribIcon fill={iconColor} />}
              /> */}
              <NavLinkVertical
                href="/kebijakan-privasi"
                title="Kebijakan Privasi"
                // icon={<LockIcon fill={iconColor} />}
              />
            </VerticalNavGrid>
            <VerticalNavGrid backgroundColor="bgPrimary" color="textPrimary" flex="1 1 auto">
              <NavInnerFooter display="flex" flexDirection="column">
                <NavLabel>Ganti mode warna</NavLabel>
                <Box>
                  <ToggleButtonLight
                    type="button"
                    ml="sm"
                    backgroundColor="buttonlightmode"
                    color="buttonlightmodetext"
                    py="xxs"
                    px="xs"
                    borderRadius={2}
                    onClick={toggleDarkMode}
                  >
                    Terang
                  </ToggleButtonLight>
                  <ToggleButtonDark
                    type="button"
                    ml="sm"
                    backgroundColor="buttondarkmode"
                    color="buttondarkmodetext"
                    py="xxs"
                    px="xs"
                    borderRadius={2}
                    margin="0"
                    onClick={toggleDarkMode}
                  >
                    Gelap
                  </ToggleButtonDark>
                </Box>
              </NavInnerFooter>
            </VerticalNavGrid>
          </Container>
          <Footer>
            <CloseButtonContainer type="button" backgroundColor="bgPrimary" onClick={toggleModal}>
              <CloseButtonIconWrapper
                display="flex"
                alignItems="center"
                justifyContent="center"
                size={20}
                borderRadius={20}
                backgroundColor="brandred"
              >
                X
              </CloseButtonIconWrapper>
              Tutup
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
