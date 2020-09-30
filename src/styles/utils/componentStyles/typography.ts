import { mediaQueries } from '../variables'

/**
 * Typography scaling following BBC's GEL:
 * https://www.bbc.co.uk/gel/guidelines/typography
 */
export const textScale = {
  1400: {
    fontSize: '96px',
    lineHeight: '104px',
    [mediaQueries.md]: {
      fontSize: '140px',
      lineHeight: '148px'
    }
  },
  1300: {
    fontSize: '78px',
    lineHeight: '84px',
    [mediaQueries.md]: {
      fontSize: '116px',
      lineHeight: '124px'
    }
  },
  1200: {
    fontSize: '64px',
    lineHeight: '72px',
    [mediaQueries.md]: {
      fontSize: '96px',
      lineHeight: '104px'
    }
  },
  1100: {
    fontSize: '52px',
    lineHeight: '60px',
    [mediaQueries.md]: {
      fontSize: '76px',
      lineHeight: '84px'
    }
  },
  1000: {
    fontSize: '40px',
    lineHeight: '44px',
    [mediaQueries.md]: {
      fontSize: '56px',
      lineHeight: '60px'
    }
  },
  900: {
    fontSize: '32px',
    lineHeight: '36px',
    [mediaQueries.md]: {
      fontSize: '44px',
      lineHeight: '48px'
    }
  },
  800: {
    fontSize: '24px',
    lineHeight: '28px',
    [mediaQueries.md]: {
      fontSize: '32px',
      lineHeight: '36px'
    }
  },
  700: {
    fontSize: '22px',
    lineHeight: '26px',
    [mediaQueries.md]: {
      fontSize: '28px',
      lineHeight: '32px'
    }
  },
  600: {
    fontSize: '20px',
    lineHeight: '24px',
    [mediaQueries.md]: {
      fontSize: '24px',
      lineHeight: '28px'
    }
  },
  500: {
    fontSize: '18px',
    lineHeight: '22px',
    [mediaQueries.md]: {
      fontSize: '20px',
      lineHeight: '24px'
    }
  },
  400: {
    fontSize: '16px',
    lineHeight: '20px'
  },
  300: {
    fontSize: '15px',
    lineHeight: '18px',
    [mediaQueries.md]: {
      fontSize: '14px',
      lineHeight: '18px'
    }
  },
  200: {
    fontSize: '14px',
    lineHeight: '18px',
    [mediaQueries.md]: {
      fontSize: '13px',
      lineHeight: '16px'
    }
  },
  100: {
    fontSize: '12px',
    lineHeight: '16px'
  }
}

/**
 * Typography scaling following BBC's GEL:
 * https://www.bbc.co.uk/gel/guidelines/typography
 */
export const paragraphScale = {
  500: {
    fontSize: '18px',
    lineHeight: '24px',
    [mediaQueries.md]: {
      fontSize: '20px',
      lineHeight: '24px'
    }
  },
  400: {
    fontSize: '16px',
    lineHeight: '24px'
  },
  300: {
    fontSize: '15px',
    lineHeight: '24px',
    [mediaQueries.md]: {
      fontSize: '14px'
    }
  }
}
