import * as React from 'react'

import { Box, themeProps, UnstyledButton } from '../../../ui'

import NavLinkRoot from './NavLinkRoot'

import styled from '@emotion/styled'
import { themeGet } from '@styled-system/theme-get'
import Link from 'next/link'

interface NavLinkProps {
  title: string
  href: string
  as?: string
  isActive?: boolean
  icon?: React.ReactNode
  isDark?: boolean
}

const secondaryNavHeight = 36

const SecondaryNavigationBase = styled(NavLinkRoot)<Pick<NavLinkProps, 'isActive'>>`
  display: flex;
  align-items: center;
  margin-right: ${themeProps.space.md}px;
  height: ${secondaryNavHeight}px;
  text-decoration: none;
  white-space: nowrap;

  &:last-of-type {
    margin-right: 0;
  }

  ${themeProps.mediaQueries.md} {
    margin-right: ${themeProps.space.lg}px;
  }
`

const LinkIcon = styled(UnstyledButton)`
  display: none;
  &:focus {
    outline: none;
  }
`

const SecondaryNavWrapper = styled(Box)`
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`

interface FadeBoxProps {
  direction: string
  color: string
}

const FadeBox = styled(Box)<FadeBoxProps>`
  position: absolute;
  z-index: 1;
  height: ${secondaryNavHeight}px;
  width: ${themeProps.space.md}px;
  background: linear-gradient(
    ${props => props.direction},
    transparent 0%,
    ${props => themeGet(`colors.${props.color}`, 'transparent')} 100%
  );

  ${themeProps.mediaQueries.md} {
    width: ${themeProps.space.lg}px;
  }
`

const SecondaryNavLinkText = styled.span`
  font-size: 13px;
  line-height: 16px;

  ${themeProps.mediaQueries.md} {
    font-size: 15px;
    line-height: 18px;
  }
`

const SecondaryNavLink: React.FC<NavLinkProps> = ({ title, href, as, isActive, icon }) => {
  return (
    <Link as={as} href={href} passHref>
      <SecondaryNavigationBase isActive={isActive}>
        {icon && <LinkIcon type="button">{icon}</LinkIcon>}
        <Box>
          <SecondaryNavLinkText>{title}</SecondaryNavLinkText>
        </Box>
      </SecondaryNavigationBase>
    </Link>
  )
}

SecondaryNavLink.defaultProps = {
  isActive: false
}

export { FadeBox, SecondaryNavLink, SecondaryNavWrapper }
