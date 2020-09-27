import { createGlobalStyle } from 'styled-components'

type ThemeProps = Record<string, any>

export const GlobalStyles = createGlobalStyle`

  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
  body {
    background: ${(props: ThemeProps) => props.theme.colors.bgPrimary};
    color: ${(props: ThemeProps) => props.theme.colors.textColor};
    height: 100vh;
    margin: 0;
    padding: 0;
    font-size: ${(props: ThemeProps) => props.theme.fonts.fontSizes.sm};
    font-family: ${(props: ThemeProps) => props.theme.fonts.body}, sans-serif;
    transition: all 0.25s linear;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${(props: ThemeProps) => props.theme.colors.primary};
    font-family: ${(props: ThemeProps) => props.theme.fonts.heading}, sans-serif;
  }
`
