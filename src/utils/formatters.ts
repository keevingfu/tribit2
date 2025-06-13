// Additional formatter functions for tests
// Note: Main formatters are in format.ts

export const formatNumberWithCommas = (num: number, decimals?: number): string => {
  const parts = num.toFixed(decimals).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const formatDateCustom = (date: Date | string, format: string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
}

export const formatPercentageValue = (value: number, decimals: number = 1, isAlreadyPercentage: boolean = false): string => {
  const percentage = isAlreadyPercentage ? value : value * 100
  return `${percentage.toFixed(decimals)}%`
}