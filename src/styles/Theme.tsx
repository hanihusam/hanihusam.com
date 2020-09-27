import { ThemeProvider } from 'styled-components'
import { colors, fonts, breakpoints, widths, mediaQueries, shadows, GlobalStyles } from './utils'

export const themeProps = {
  colors,
  fonts,
  widths,
  mediaQueries,
  breakpoints,
  shadows
}

export const Theme: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={themeProps}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  )
}
