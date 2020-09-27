export const colors = {
  bgPrimary: "#F2F2F2",
  bgSecondary: "#263238",
  primary: "#45577B",
  secondary: "#ED7D31",
  textColorPrimary: "#7A8391",
  textColorSecondary: "#C4C4C4",
  header: "#FFF",
  activeMenu: "#ED7D31"
};

export const breakpoints = ["0", "576px", "768px", "992px", "1200px"];

export const mediaQueries = {
  xs: `@media screen and (min-width: ${breakpoints[0]})`,
  sm: `@media screen and (min-width: ${breakpoints[1]})`,
  md: `@media screen and (min-width: ${breakpoints[2]})`,
  lg: `@media screen and (min-width: ${breakpoints[3]})`,
  xl: `@media screen and (min-width: ${breakpoints[4]})`,
  smMax: `@media screen and (max-width: ${breakpoints[1]})`
};

export const widths = {
  sm: 560,
  md: 750,
  lg: 970,
  xl: 1140
};

export const shadows = {
  single: "0 4px 8px 0 rgba(0, 0, 0, 0.25)",
  double: "0 8px 16px 0 rgba(0, 0, 0, 0.25)"
};
