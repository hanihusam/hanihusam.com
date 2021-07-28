import * as React from 'react'

import { Box, themeProps, UnstyledAnchor } from '../../ui'

import { NavInner } from './components/NavComponents'

import styled from '@emotion/styled'
import Link from 'next/link'

interface NavLinkProps {
  title: string
  href: string
  as?: string
  target?: string
  isActive?: boolean
  icon?: React.ReactNode
  isDark?: boolean
}

const LinkIcon = styled(Box)`
  display: flex;
  min-height: 20px;
  align-items: center;
`

const NavLabel = styled(Box)`
  margin-left: ${themeProps.space.xs}px;
`

const NavInnerVertical = styled(NavInner)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: ${themeProps.space.lg}px -${themeProps.space.lg}px;
  padding: ${themeProps.space.xs}px ${themeProps.space.lg}px;
`

/** Style link with its icon, wrap internal links in Next <Link>, open external links in new tab (default) */
const NavLinkVertical: React.FC<NavLinkProps> = ({ title, href, as, target = '_blank', icon }) => {
  const NavLinkVerticalInner = (
    <NavInnerVertical>
      <LinkIcon>{icon}</LinkIcon>
      <NavLabel>{title}</NavLabel>
    </NavInnerVertical>
  )

  const isInternalLink = href.startsWith('/')

  return isInternalLink ? (
    <Link as={as} href={href} passHref>
      {NavLinkVerticalInner}
    </Link>
  ) : (
    <UnstyledAnchor
      href={href}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      target={target}
    >
      {NavLinkVerticalInner}
    </UnstyledAnchor>
  )
}

NavLinkVertical.defaultProps = {
  isActive: false
}

export default NavLinkVertical
