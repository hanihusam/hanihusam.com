import styled, { css } from 'styled-components'
import { themeProps } from 'src/styles'

interface ColumnProps {
  size?: 'md' | 'lg' | 'xl'
}

const Column = styled('div')<ColumnProps>`
  margin: 0 auto;
  width: 100%;
  max-width: ${themeProps.widths.md}px;

  ${props =>
    props.size === 'lg' || props.size === 'xl'
      ? css`
          ${themeProps.mediaQueries.lg} {
            max-width: ${themeProps.widths.lg}px;
          }
        `
      : ''}

  ${props =>
    props.size === 'xl'
      ? css`
          ${themeProps.mediaQueries.xl} {
            max-width: ${themeProps.widths.xl}px;
          }
        `
      : ''}
`

Column.defaultProps = {
  size: 'xl'
}

export default Column
