import * as React from 'react'

import { themeProps } from '../../Theme'
import { UnstyledButton } from '../Common'

import { ButtonProps } from './utils'

import styled from '@emotion/styled'

const BaseButton = styled(UnstyledButton)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: 'transparent';
  color: ${themeProps.colors.white};
  padding: ${themeProps.space.md}px ${themeProps.space.lg}px;
  border-radius: 5px;
  border: 1px solid ${themeProps.colors.secondary};
  transition: 300ms;

  & > a {
    color: ${themeProps.colors.white};
    text-decoration: none;
  }

  &:hover {
    background-color: ${themeProps.colors.secondary};
  }

  ${themeProps.mediaQueries.md} {
    min-width: 150px;
    height: 65px;
  }
`

export const GhostButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ style, type, isLoading, loadingText = 'Loading...', disabled, children, ...rest }, ref) => (
    <BaseButton
      disabled={isLoading ?? disabled}
      ref={ref}
      style={style}
      type={type ?? 'button'}
      {...rest}
    >
      {isLoading ? loadingText : children}
    </BaseButton>
  )
)

GhostButton.displayName = 'GhostButton'
