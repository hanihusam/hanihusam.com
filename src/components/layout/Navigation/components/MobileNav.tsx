import * as React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

import { themeProps, Box } from 'src/styles'
import NavLinkRoot from './NavLinkRoot'

interface NavLinkProps {
  title: string
  href: string
  as?: string
  isActive?: boolean
  icon?: React.ReactNode
}

const MobileNavLinkBase = styled(NavLinkRoot)<Pick<NavLinkProps, 'isActive'>>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  white-space: nowrap;
  font-size: 10px;
  margin-bottom: 2px;
`

const LinkIcon = styled.div<Pick<NavLinkProps, 'isActive'>>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 4px 0;
  margin-bottom: 2px;
  border-radius: 50%;
`

const MobileNav = styled(Box)`
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 0 -${themeProps.space.md}px;
  backdrop-filter: blur(16px);
  box-shadow: ${themeProps.shadows.single};
  display: flex;
  justify-content: space-evenly;
  height: 54px;

  ${themeProps.mediaQueries.sm} {
    display: none;
  }
`

const MobileNavLink: React.FC<NavLinkProps> = ({ title, href, as, isActive, icon }) => {
  return (
    <Link href={href} as={as}>
      <MobileNavLinkBase isActive={isActive}>
        <LinkIcon>{icon}</LinkIcon>
        <span style={{ fontWeight: isActive ? 'bold' : 'normal' }}>{title}</span>
      </MobileNavLinkBase>
    </Link>
  )
}

MobileNavLink.defaultProps = {
  isActive: false
}

export { MobileNav, MobileNavLink }
