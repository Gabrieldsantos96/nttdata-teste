export function formatDateToExtensive(
  date: Date | string,
  placeHolder?: string
): string {
  if (date instanceof Date === false && !isDate(date)) {
    return placeHolder || ""
  }
  if (date instanceof Date === false && isDate(date)) {
    date = new Date(date)
  }
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date as Date) /* 11 de Janeiro de 2024 **/
}

export function formatDateToUTCRaw(date: Date | string): string {
  if (date instanceof Date === false && !isDate(date)) {
    return "-"
  }
  if (date instanceof Date === false && isDate(date)) {
    date = new Date(date)
  }
  return (date as Date).toISOString()
}

export function isDate(dateString?: string): boolean {
  if (!dateString) return false
  const regex =
    /(19|20)\d{2}(\/|-)(0[1-9]|1[0-2])(\/|-)(0[1-9]|[12][0-9]|3[01])|(0[1-9]|[12][0-9]|3[01])(\/|-)(0[1-9]|1[0-2])(\/|-)(19|20)\d{2}/

  return regex.test(dateString)
}

export const customOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit"
}

export function formatDateToShort(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }

  const formatOptions = options || defaultOptions

  if (date instanceof Date === false && !isDate(date)) {
    return "-"
  }

  if (date instanceof Date === false && isDate(date)) {
    date = new Date(date)
  }

  return new Intl.DateTimeFormat("pt-BR", formatOptions).format(
    date as Date
  ) /* 11/01/2024 **/
}

export function formatDateToTime(date: Date | string): string {
  if (date instanceof Date === false && !isDate(date)) {
    return "-"
  }
  if (date instanceof Date === false && isDate(date)) {
    date = new Date(date)
  }
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date as Date) /* 14:30 **/
}
