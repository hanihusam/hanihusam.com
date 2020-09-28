import { useMemo } from 'react'
import { ThemeProvider } from 'styled-components'

import { colors, fonts, breakpoints, widths, mediaQueries, shadows, GlobalStyles } from './utils'
import useDarkMode from '~/utils/useDarkMode'

const themeProps = {
  colors,
  fonts,
  widths,
  mediaQueries,
  breakpoints,
  shadows
}

const darkThemeProps = {
  ...themeProps,
  colors: {
    ...themeProps.colors,
    bgPrimary: '#434343',
    primary: '#FFFFFF',
    textPrimary: '#F2F2F2'
  }
}

export const Theme: React.FC = ({ children }) => {
  const [isDarkMode] = useDarkMode()

  const currentTheme = useMemo(() => {
    if (isDarkMode) {
      // return darkThemeProps
      return themeProps
    }

    return themeProps
  }, [isDarkMode])

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  )
}
