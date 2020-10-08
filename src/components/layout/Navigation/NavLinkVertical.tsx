import * as React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

import { Box, UnstyledAnchor, themeProps } from 'src/styles'
import { NavInner } from './components/NavComponents'

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
  border-bottom: 1px solid ${themeProps.colors.secondary};
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

  const isInternalLink = href.charAt(0) === '/'

  return isInternalLink ? (
    <Link href={href} as={as} passHref>
      {NavLinkVerticalInner}
    </Link>
  ) : (
    <UnstyledAnchor href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}>
      {NavLinkVerticalInner}
    </UnstyledAnchor>
  )
}

NavLinkVertical.defaultProps = {
  isActive: false
}

export default NavLinkVertical
