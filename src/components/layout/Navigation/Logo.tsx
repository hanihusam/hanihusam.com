import * as React from 'react'

import { Text } from '../../ui'

import styled from '@emotion/styled'

interface LogoProps {
  isDarkMode: boolean
}

const LogoName = styled(Text)`
  font-weight: 700;
`

const Logo: React.FC<LogoProps> = ({ isDarkMode }) => {
  return (
    <>
      <img
        alt="hanihusam logo"
        aria-hidden
        height="auto"
        src={isDarkMode ? '/images/logo-dark.png' : '/images/logo.png'}
        width="36"
      />
      <LogoName color={isDarkMode ? '#F2F2F2' : '#7A8391'}>hanihusam.</LogoName>
    </>
  )
}

export default Logo
