import * as React from 'react'

import { Box, Text, themeProps } from '../../../ui'

import NavLinkRoot from './NavLinkRoot'

import styled from '@emotion/styled'
import Link from 'next/link'

interface NavLinkProps {
  title?: string
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
  font-size: 12px;
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
  z-index: 1;

  ${themeProps.mediaQueries.sm} {
    display: none;
  }
`

const MobileNavLink: React.FC<NavLinkProps> = ({ title, href, as, isActive, icon }) => {
  return (
    <Link as={as} href={href} passHref>
      <MobileNavLinkBase isActive={isActive}>
        <LinkIcon>{icon}</LinkIcon>
        <Text color="primary" variant={100}>
          {title}
        </Text>
      </MobileNavLinkBase>
    </Link>
  )
}

MobileNavLink.defaultProps = {
  isActive: false
}

export { MobileNav, MobileNavLink }
