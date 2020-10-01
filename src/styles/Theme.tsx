import { useMemo } from 'react'
import { ThemeProvider } from 'styled-components'

import { colors, fonts, space, breakpoints, widths, mediaQueries, shadows, GlobalStyles, componentStyles } from './utils'
import useDarkMode from 'src/utils/useDarkMode'

export const themeProps = {
  colors,
  fonts,
  space,
  widths,
  mediaQueries,
  breakpoints,
  shadows,
  componentStyles
}

const darkThemeProps = {
  ...themeProps,
  colors: {
    ...themeProps.colors,
    bgPrimary: '#434343',
    primary: '#FFFFFF',
    textPrimary: '#F2F2F2',

    buttonlightmode: '#f1f2f3',
    buttonlightmodetext: '#22272c',
    buttondarkmode: '#45577B',
    buttondarkmodetext: '#ffffff'
  }
}

export const Theme: React.FC = ({ children }) => {
  const [isDarkMode] = useDarkMode()

  const currentTheme = useMemo(() => {
    if (isDarkMode) {
      return darkThemeProps
      // return themeProps
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

export type Color = keyof typeof themeProps['colors']
export type Space = keyof typeof themeProps['space']
export type TextScale = keyof typeof themeProps['componentStyles']['typography']['textScale']
export type ParagraphScale = keyof typeof themeProps['componentStyles']['typography']['paragraphScale']
