/**
 * Formatting Utilities
 * Centralized formatting functions for consistent display
 */

import { format, formatDistanceToNow } from 'date-fns'
import { DATE_FORMATS } from '@/lib/constants'

// ============================================================================
// DATE FORMATTERS
// ============================================================================

export function formatDate(date: string | Date, formatStr: string = DATE_FORMATS.DISPLAY): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, formatStr)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

export function formatDateForAPI(date: Date | undefined): string {
  if (!date) return ''
  return format(date, DATE_FORMATS.API)
}

export function formatRelativeDate(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } catch (error) {
    return 'Unknown'
  }
}

export function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return {
    start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    duration: `${diffDays} days`
  }
}

// ============================================================================
// FILE SIZE FORMATTERS
// ============================================================================

export function formatFileSize(bytes: number | string): string {
  // If already formatted (string), return as-is
  if (typeof bytes === 'string') return bytes

  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'

  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = (bytes / Math.pow(1024, i)).toFixed(2)

  return `${size} ${sizes[i]}`
}

// ============================================================================
// NUMBER FORMATTERS
// ============================================================================

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}

export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

// ============================================================================
// STRING FORMATTERS
// ============================================================================

export function truncate(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export function kebabToTitle(str: string): string {
  return str
    .split('-')
    .map(word => capitalize(word))
    .join(' ')
}

// ============================================================================
// INITIALS & AVATAR GENERATORS
// ============================================================================

export function generateInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

export function generateAvatarColor(name: string, colors: readonly string[]): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// ============================================================================
// ID GENERATORS
// ============================================================================

export function generateId(prefix: string = ''): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`
}

export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase()
}

