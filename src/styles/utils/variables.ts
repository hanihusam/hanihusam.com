export const colors = {
  bgPrimary: '#F2F2F2',
  fgPrimary: '#45577B',
  bgSecondary: '#263238',
  primary: '#45577B',
  secondary: '#ED7D31',
  textColorPrimary: '#7A8391',
  textColorSecondary: '#C4C4C4',

  buttonlightmode: '#45577B',
  buttonlightmodetext: '#ffffff',
  buttondarkmode: '#434343',
  buttondarkmodetext: '#f1f2f3',
  navgridbgmobile: '#ffffff',

  card: '#46434E',
  header: '#FFF',
  activeMenu: '#ED7D31'
}

const sans = ['Jost', '-apple-system', 'Ubuntu']

export const fonts = {
  heading: `${sans[0]}`,
  body: `${sans[2]}`,
  fontSizes: {
    xs: '14px',
    sm: '16px',
    md: '18px',
    lg: '20px',
    xl: '24px',
    '2xl': '28px',
    '3xl': '36px',
    '4xl': '48px',
    '5xl': '64px',
    '6xl': '72px'
  }
}

export const breakpoints = ['0', '576px', '768px', '992px', '1200px']

export const mediaQueries = {
  xs: `@media screen and (min-width: ${breakpoints[0]})`,
  sm: `@media screen and (min-width: ${breakpoints[1]})`,
  md: `@media screen and (min-width: ${breakpoints[2]})`,
  lg: `@media screen and (min-width: ${breakpoints[3]})`,
  xl: `@media screen and (min-width: ${breakpoints[4]})`,
  smMax: `@media screen and (max-width: ${breakpoints[1]})`
}

export const space = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
}

export const widths = {
  sm: 560,
  md: 750,
  lg: 970,
  xl: 1140
}

export const shadows = {
  single: '0 4px 8px 0 rgba(0, 0, 0, 0.25)',
  double: '0 8px 16px 0 rgba(0, 0, 0, 0.25)'
}
