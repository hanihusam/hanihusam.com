import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Ubuntu:wght@300;400;700&display=swap');

  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
  body {
    background: ${({ theme }) => theme.bgPrimary};
    color: ${({ theme }) => theme.textColor};
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: 'Ubuntu', sans-serif;
    transition: all 0.25s linear;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${({ theme }) => theme.primary};
    font-family: 'Black Han Sans', sans-serif;
  }
`;
