/**
 * Utility Functions - Barrel Export
 * 
 * Centralized export for all utility functions.
 * Import from "@/lib/utils" for easy access.
 */

// Score and percentage utilities
export {
  getPercentageColor,
  getComplianceScoreColor,
  getPercentageLabel,
  formatPercentage,
  calculatePercentage,
  getPercentageInfo
} from "./score-utils"

// Review-specific utilities
export {
  getGradeColor,
  getStatusColor,
  getPriorityColor,
  getReviewerStatusColor,
  generateInitials,
  generateAvatarColor,
  formatDateRange,
  calculateDuration
} from "./review-utils"

// Formatters (re-export commonly used ones)
export {
  formatDate,
  formatDateForAPI,
  formatRelativeDate,
  formatFileSize,
  formatCurrency,
  formatNumber,
  truncate,
  capitalize,
  titleCase,
  kebabToTitle
} from "./formatters"

// Validators (re-export commonly used ones)
export {
  isValidEmail,
  isValidDate,
  isValidFileType,
  isValidFileSize,
  validateFile,
  validateFiles,
  isNotEmpty,
  hasMinLength,
  hasMaxLength,
  isValidUrl,
  isTeamsUrl
} from "./validators"

