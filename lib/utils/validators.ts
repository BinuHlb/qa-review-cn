/**
 * Validation Utilities
 * Centralized validation functions
 */

import { ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS } from '@/lib/constants'

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ============================================================================
// DATE VALIDATION
// ============================================================================

export function isValidDate(date: unknown): boolean {
  return date instanceof Date && !isNaN(date.getTime())
}

export function isDateInFuture(date: Date): boolean {
  return date > new Date()
}

export function isDateInPast(date: Date): boolean {
  return date < new Date()
}

export function isDateAfter(date1: Date, date2: Date): boolean {
  return date1 > date2
}

// ============================================================================
// FILE VALIDATION
// ============================================================================

export function isValidFileType(fileType: string): boolean {
  return (ALLOWED_FILE_TYPES as readonly string[]).includes(fileType)
}

export function isValidFileSize(fileSize: number): boolean {
  return fileSize <= FILE_SIZE_LIMITS.MAX_FILE_SIZE
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!isValidFileType(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: PDF, Excel, Word, Images`
    }
  }

  if (!isValidFileSize(file.size)) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${FILE_SIZE_LIMITS.MAX_FILE_SIZE / 1024 / 1024}MB`
    }
  }

  return { valid: true }
}

export function validateFiles(files: File[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  let totalSize = 0

  files.forEach((file, index) => {
    const result = validateFile(file)
    if (!result.valid && result.error) {
      errors.push(`File ${index + 1} (${file.name}): ${result.error}`)
    }
    totalSize += file.size
  })

  if (totalSize > FILE_SIZE_LIMITS.MAX_TOTAL_SIZE) {
    errors.push(`Total file size exceeds maximum limit of ${FILE_SIZE_LIMITS.MAX_TOTAL_SIZE / 1024 / 1024}MB`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// ============================================================================
// STRING VALIDATION
// ============================================================================

export function isNotEmpty(str: string | undefined | null): boolean {
  return Boolean(str && str.trim().length > 0)
}

export function hasMinLength(str: string, minLength: number): boolean {
  return str.trim().length >= minLength
}

export function hasMaxLength(str: string, maxLength: number): boolean {
  return str.trim().length <= maxLength
}

// ============================================================================
// URL VALIDATION
// ============================================================================

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isTeamsUrl(url: string): boolean {
  return url.includes('teams.microsoft.com') || url.includes('teams.live.com')
}

// ============================================================================
// FORM VALIDATION
// ============================================================================

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): ValidationResult {
  const errors: Record<string, string> = {}

  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = `${field} is required`
    }
  })

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

