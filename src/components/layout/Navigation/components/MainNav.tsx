import React from 'react'

import { Box, themeProps } from '../../../ui'

import styled from '@emotion/styled'
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
      alignItems="center"
      display="flex"
      flexDirection="row"
      gridColumn="3/4"
      height={[60, null, null, 96, null]}
      overflowX="auto"
      overflowY="hidden"
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
  color: ${({ isActive }) =>
    isActive ? `${themeProps.colors.secondary}` : `${themeProps.colors.textColorPrimary}`};

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
export const MainNavLink: React.FC<LinkIconProps> = ({
  title,
  href,
  as,
  target = '_blank',
  isActive
}) => {
  const isInternalLink = href.startsWith('/') || href.startsWith('#')

  return isInternalLink ? (
    <Link as={as} href={href} passHref>
      <MainNavLinkBase isActive={isActive}>{title}</MainNavLinkBase>
    </Link>
  ) : (
    <MainNavLinkBase
      href={href}
      isActive={isActive}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      target={target}
    >
      {title}
    </MainNavLinkBase>
  )
}
