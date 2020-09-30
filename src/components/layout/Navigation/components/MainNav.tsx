import React from 'react'
import styled from 'styled-components'

import { themeProps, Box } from 'src/styles'
import Link from 'next/link'

interface LinkIconProps {
  title: string
  href: string
  as?: string
  target?: string
  isActive?: boolean
  icon?: React.ReactNode
  isDark?: boolean
}

export const MainNavInner: React.FC = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gridColumn="3/4"
      overflowX="auto"
      overflowY="hidden"
      height={[60, null, null, 96, null]}
    >
      {children}
    </Box>
  )
}

export const MainNavCenter = styled(Box)`
  display: block;
  margin: 0 8px;

  ${themeProps.mediaQueries.md} {
    margin: 4px 16px 0;
  }
`

export const MainNavCenterLinks = styled(Box)`
  display: none;

  ${themeProps.mediaQueries.sm} {
    display: flex;
    justify-content: flex-end;
  }
`

export const MainNavRight = styled(Box)`
  padding-top: 2px;

  ${themeProps.mediaQueries.md} {
    padding-top: 10px;
  }
`

const MainNavLinkBase = styled('a')<{ isActive?: boolean }>`
  position: relative;
  display: inline-block;
  text-decoration: none;
  color: ${({ isActive }) => (isActive ? `${themeProps.colors.secondary}` : `${themeProps.colors.textColorPrimary}`)};

  ${themeProps.mediaQueries.sm} {
    font-size: 13px;
    padding: 4px 0;
    margin: 2px 8px 0;
  }
  ${themeProps.mediaQueries.md} {
    font-size: 15px;
    padding: 8px 0;
    margin: 0 12px;
  }
  ${themeProps.mediaQueries.lg} {
    font-size: 16px;
    margin: 0 16px;
  }
`

/** Wrap internal links in Next <Link>, open external links in new tab (default) */
export const MainNavLink: React.FC<LinkIconProps> = ({ title, href, as, target = '_blank', isActive }) => {
  const isInternalLink = href.charAt(0) === '/' || href.charAt(0) === '#'

  return isInternalLink ? (
    <Link href={href} as={as} passHref>
      <MainNavLinkBase isActive={isActive}>{title}</MainNavLinkBase>
    </Link>
  ) : (
    <MainNavLinkBase href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} isActive={isActive}>
      {title}
    </MainNavLinkBase>
  )
}
