import * as React from 'react'

import useDarkMode from '../../utils/useDarkMode'
import { GlobalStyles, Theme, themeProps } from '../ui'

const darkThemeProps = {
  ...themeProps,
  colors: {
    ...themeProps.colors,
    background: '#434343',
    footer: '#434343',
    primary: themeProps.colors.white,
    black: themeProps.colors.white,
    white: themeProps.colors.black,
    navgridbgmobile: themeProps.colors.black,

    buttonlightmode: '#f1f2f3',
    buttonlightmodetext: '#22272c',
    buttondarkmode: '#45577B',
    buttondarkmodetext: '#ffffff'
  }
}

const ThemeWrapper: React.FC = ({ children }) => {
  const [isDarkMode] = useDarkMode()

  const currentTheme = React.useMemo(() => {
    if (isDarkMode) {
      return darkThemeProps
      // return themeProps
    }

    return themeProps
  }, [isDarkMode])

  return (
    <Theme customTheme={currentTheme}>
      <GlobalStyles />
      {children}
    </Theme>
  )
}

export default ThemeWrapper
