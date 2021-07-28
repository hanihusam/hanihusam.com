import * as React from 'react'

import {
  breakpoints,
  colors,
  componentStyles,
  fonts,
  mediaQueries,
  shadows,
  space,
  widths
} from './utils'

import { ThemeProvider } from '@emotion/react'

interface ThemeProviderProps {
  customTheme?: Record<string, unknown>
}

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

export const Theme: React.FC<ThemeProviderProps> = ({ children, customTheme }) => {
  return <ThemeProvider theme={customTheme ?? themeProps}>{children}</ThemeProvider>
}

export type Color = keyof typeof themeProps['colors']
export type Space = keyof typeof themeProps['space']
export type TextScale = keyof typeof themeProps['componentStyles']['typography']['textScale']
export type ParagraphScale =
  keyof typeof themeProps['componentStyles']['typography']['paragraphScale']
