import styled, { createGlobalStyle } from 'styled-components'

type ThemeProps = Record<string, any>

export const GlobalStyles = createGlobalStyle`
:root {
    --reach-skip-nav: 1;
  }

  html {
    height: 100%;
    box-sizing: border-box;
  }

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
    margin: 0;
    color: ${(props: ThemeProps) => props.theme.colors.textColorPrimary};
    font-family: ${(props: ThemeProps) => props.theme.fonts.heading}, sans-serif;
  }

  p {
    margin: 0;
  }

  a {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    text-decoration: none;
  }


  #__next {
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }

`
export const Container = styled.div`
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;

  ${(props: ThemeProps) => props.theme.mediaQueries.sm} {
    max-width: 540px;
  }
  ${(props: ThemeProps) => props.theme.mediaQueries.md} {
    max-width: 720px;
  }
  ${(props: ThemeProps) => props.theme.mediaQueries.lg} {
    max-width: 960px;
  }
  ${(props: ThemeProps) => props.theme.mediaQueries.xl} {
    max-width: 1200px;
  }
`
