import * as React from 'react'

interface LogoProps {
  isDarkMode?: boolean
}

const Logo: React.FC<LogoProps> = ({ isDarkMode = true }) => {
  return (
    <img
      alt="hanihusam logo"
      aria-hidden
      height="auto"
      src={isDarkMode ? '/images/logo-dark.png' : '/images/logo.png'}
      width="36"
    />
  )
}

export default Logo
