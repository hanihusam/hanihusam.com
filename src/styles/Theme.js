import { ThemeProvider } from "styled-components";
import {
  colors,
  breakpoints,
  widths,
  mediaQueries,
  shadows,
  GlobalStyles
} from "./utils";

export const themeProps = {
  colors,
  widths,
  mediaQueries,
  breakpoints,
  shadows
};

export const Theme = ({ children }) => {
  return (
    <ThemeProvider theme={themeProps}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};
