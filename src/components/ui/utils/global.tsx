import * as React from 'react'

import { css, Global, Theme, useTheme } from '@emotion/react'

const globalCSS = (theme: Theme) => css`
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
    background: ${theme.colors.bgPrimary};
    color: ${theme.colors.textColorPrimary};
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: ${theme.fonts.body};
    transition: all 0.25s linear;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    color: ${theme.colors.textColorPrimary};
    font-family: ${theme.fonts.heading};
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

const GlobalStyles: React.FC = () => {
  const theme: Theme = useTheme()
  return <Global styles={globalCSS(theme)} />
}

export default GlobalStyles
