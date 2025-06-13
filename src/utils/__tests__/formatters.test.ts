// Example utility functions tests
import { 
  formatNumber, 
  formatCurrency, 
  formatDate, 
  formatPercentage 
} from '@/utils/format'

describe('Formatters', () => {
  describe('formatNumber', () => {
    it('should format numbers with K and M suffixes', () => {
      expect(formatNumber(999)).toBe('999')
      expect(formatNumber(1000)).toBe('1.0K')
      expect(formatNumber(1500)).toBe('1.5K')
      expect(formatNumber(1000000)).toBe('1.0M')
      expect(formatNumber(2500000)).toBe('2.5M')
    })

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency in CNY by default', () => {
      const result = formatCurrency(1000)
      expect(result).toContain('1,000')
      expect(result).toMatch(/¥|CN¥|￥/)
    })

    it('should format currency in USD', () => {
      const result = formatCurrency(1000, 'USD')
      expect(result).toContain('1,000')
      expect(result).toMatch(/\$|US\$/)
    })
  })

  describe('formatDate', () => {
    it('should format date in Chinese format', () => {
      const date = new Date('2024-01-15T10:30:00')
      const result = formatDate(date)
      expect(result).toMatch(/2024.*01.*15/)
    })

    it('should handle string dates', () => {
      const result = formatDate('2024-01-15')
      expect(result).toMatch(/2024.*01.*15/)
    })
  })

  describe('formatPercentage', () => {
    it('should format percentages', () => {
      expect(formatPercentage(10)).toBe('10.0%')
      expect(formatPercentage(55.5)).toBe('55.5%')
      expect(formatPercentage(100)).toBe('100.0%')
    })

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0.0%')
    })
  })
})