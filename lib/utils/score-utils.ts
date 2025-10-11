/**
 * Score and Percentage Utilities
 * 
 * Centralized logic for handling percentage scores, compliance scores,
 * and any other numeric rating displays across the application.
 * 
 * ZERO HARDCODING - All thresholds and colors from constants
 */

import { PERCENTAGE_THRESHOLDS, PERCENTAGE_COLORS } from "@/lib/constants"

/**
 * Get color class for a percentage score
 * 
 * Uses centralized thresholds and colors from constants.
 * Works for any percentage-based metric (review completion, compliance, etc.)
 * 
 * @param percentage - Numeric percentage (0-100)
 * @returns Tailwind color class string
 * 
 * @example
 * ```tsx
 * const color = getPercentageColor(85) // Returns 'text-emerald-600 dark:text-emerald-400'
 * <span className={getPercentageColor(score)}>{score}%</span>
 * ```
 */
export function getPercentageColor(percentage: number): string {
  if (percentage >= PERCENTAGE_THRESHOLDS.EXCELLENT) return PERCENTAGE_COLORS.EXCELLENT
  if (percentage >= PERCENTAGE_THRESHOLDS.GOOD) return PERCENTAGE_COLORS.GOOD
  if (percentage >= PERCENTAGE_THRESHOLDS.AVERAGE) return PERCENTAGE_COLORS.AVERAGE
  if (percentage >= PERCENTAGE_THRESHOLDS.POOR) return PERCENTAGE_COLORS.BELOW_AVERAGE
  return PERCENTAGE_COLORS.POOR
}

/**
 * Alias for compliance scores
 * Uses same logic as percentage - they're conceptually the same
 * 
 * @param score - Compliance score (0-100)
 * @returns Tailwind color class string
 */
export const getComplianceScoreColor = getPercentageColor

/**
 * Get label for percentage threshold
 * 
 * @param percentage - Numeric percentage (0-100)
 * @returns Human-readable label
 * 
 * @example
 * ```tsx
 * getPercentageLabel(85) // Returns 'Excellent'
 * ```
 */
export function getPercentageLabel(percentage: number): string {
  if (percentage >= PERCENTAGE_THRESHOLDS.EXCELLENT) return 'Excellent'
  if (percentage >= PERCENTAGE_THRESHOLDS.GOOD) return 'Good'
  if (percentage >= PERCENTAGE_THRESHOLDS.AVERAGE) return 'Average'
  if (percentage >= PERCENTAGE_THRESHOLDS.POOR) return 'Below Average'
  return 'Poor'
}

/**
 * Format percentage for display
 * 
 * @param percentage - Numeric percentage
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with % symbol
 * 
 * @example
 * ```tsx
 * formatPercentage(85.5)      // Returns '86%'
 * formatPercentage(85.5, 1)   // Returns '85.5%'
 * ```
 */
export function formatPercentage(percentage: number, decimals: number = 0): string {
  return `${percentage.toFixed(decimals)}%`
}

/**
 * Calculate percentage from two numbers
 * 
 * @param value - Numerator
 * @param total - Denominator
 * @param decimals - Decimal places for result
 * @returns Percentage (0-100)
 * 
 * @example
 * ```tsx
 * calculatePercentage(8, 10)     // Returns 80
 * calculatePercentage(1, 3, 1)   // Returns 33.3
 * ```
 */
export function calculatePercentage(value: number, total: number, decimals: number = 0): number {
  if (total === 0) return 0
  return Number(((value / total) * 100).toFixed(decimals))
}

/**
 * Get percentage with color and label
 * 
 * @param percentage - Numeric percentage
 * @returns Object with color class and label
 * 
 * @example
 * ```tsx
 * const { color, label } = getPercentageInfo(85)
 * // { color: 'text-emerald-600...', label: 'Excellent' }
 * ```
 */
export function getPercentageInfo(percentage: number): { 
  color: string
  label: string
} {
  return {
    color: getPercentageColor(percentage),
    label: getPercentageLabel(percentage)
  }
}


