import format from 'date-fns/format'
import { id } from 'date-fns/locale'

/**
 * Format input date as string
 * @param {Date} date The input date to be formatted
 * @param {string} [dateFormat] The desired output format, or one of the known keywords
 * @returns {string} The formatted input date
 */
const formatTime = (date: Date, dateFormat?: string) => {
  let df = 'dd MMMM yyyy'

  if (dateFormat) {
    // TODO fixup and document supported keywords
    switch (dateFormat?.toLowerCase()) {
      case 'default':
      case 'date':
      case 'normal':
      case 'standard':
      case 'medium':
        break

      case 'shortest':
        df = 'dd/MM'
        break

      case 'shorter':
        df = 'dd MMM'
        break

      case 'short':
        df = 'dd MMMM'
        break

      case 'minute':
      case 'long':
        df = 'dd MMMM yyyy HH:mm'
        break

      case 'longer':
        df = 'dd MMMM yyyy HH:mm xxxxx'
        break

      case 'second':
      case 'detail':
      case 'details':
      case 'longest':
        df = 'dd MMMM yyyy HH:mm:ss xxxxx'
        break

      // ? Custom format support. Delete the default block below if unnecessary
      default:
        df = dateFormat ?? 'dd MMMM yyyy'
        break
    }
  }

  return format(date, df, { locale: id })
}

export default formatTime
