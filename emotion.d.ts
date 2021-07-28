import '@emotion/react'

declare module '@emotion/react' {
  export interface Theme {
    fonts: {
      system: string
      systemMonospace: string
      heading: string
      body: string
    }
    colors: {
      bgPrimary: string
      fgPrimary: string
      bgSecondary: string
      primary: string
      secondary: string
      textColorPrimary: string
      textColorSecondary: string

      buttonlightmode: string
      buttonlightmodetext: string
      buttondarkmode: string
      buttondarkmodetext: string
      navgridbgmobile: string

      card: string
      header: string
      activeMenu: string
    }
    space: {
      xxxs: number
      xxs: number
      xs: number
      sm: number
      md: number
      lg: number
      xl: number
      xxl: number
    }
    breakpoints: string[]
    widths: {
      sm: number
      md: number
      lg: number
      xl: number
    }
    shadows: {
      single: string
      double: string
    }
  }
}
