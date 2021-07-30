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
  color: ${themeProps.colors.black};
  padding: ${themeProps.space.md}px ${themeProps.space.lg}px;
  border-radius: 5px;

  & > a {
    color: #ffffff;
    text-decoration: none;
  }

  &:hover {
    filter: brightness(80%);
  }

  ${themeProps.mediaQueries.md} {
    min-width: 150px;
    height: 65px;
  }
`

export const AnchorButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ style, type, isLoading, loadingText = 'Memuat...', disabled, children, ...rest }, ref) => (
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

AnchorButton.displayName = 'AnchorButton'
