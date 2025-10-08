/**
 * Shared utility functions for review components
 * Centralized to avoid duplication and ensure consistency
 */

/**
 * Get color classes for grade badges
 */
export function getGradeColor(grade: string): string {
  switch (grade) {
    case '1': return "bg-green-600 text-white border-green-600" // Best - 1 is best
    case '2': return "bg-blue-600 text-white border-blue-600"   // Good
    case '3': return "bg-yellow-600 text-white border-yellow-600" // Ok
    case '4': return "bg-orange-600 text-white border-orange-600" // Bad
    case '5': return "bg-red-600 text-white border-red-600"       // Poor - 5 is poor
    default: return "bg-gray-600 text-white border-gray-600"
  }
}

/**
 * Get color classes for status badges
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed': 
      return "bg-green-100 text-green-800 border-green-200"
    case 'submitted':
      return "bg-purple-100 text-purple-800 border-purple-200" // Ready for final review
    case 'in progress': 
      return "bg-blue-100 text-blue-800 border-blue-200"
    case 'pending': 
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case 'overdue': 
      return "bg-red-100 text-red-800 border-red-200"
    case 'cancelled':
      return "bg-gray-100 text-gray-800 border-gray-200"
    case 'rejected':
      return "bg-red-100 text-red-800 border-red-200"
    case 'approved':
      return "bg-green-100 text-green-800 border-green-200"
    default: 
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

/**
 * Get color classes for priority badges
 */
export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'high': 
      return "bg-red-100 text-red-800 border-red-200"
    case 'medium': 
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case 'low': 
      return "bg-green-100 text-green-800 border-green-200"
    default: 
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

/**
 * Get color classes for reviewer status badges
 */
export function getReviewerStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'assigned': 
      return "bg-blue-100 text-blue-800 border-blue-200"
    case 'in progress': 
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case 'completed': 
      return "bg-green-100 text-green-800 border-green-200"
    case 'overdue': 
      return "bg-red-100 text-red-800 border-red-200"
    case 'pending':
      return "bg-gray-100 text-gray-800 border-gray-200"
    default: 
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

/**
 * Format file size from bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file icon emoji based on file type
 */
export function getFileIcon(type: string): string {
  if (type.includes('pdf')) return '📄'
  if (type.includes('sheet') || type.includes('excel') || type.includes('spreadsheet')) return '📊'
  if (type.includes('word') || type.includes('document')) return '📝'
  if (type.includes('image')) return '🖼️'
  if (type.includes('video')) return '🎥'
  if (type.includes('audio')) return '🎵'
  if (type.includes('zip') || type.includes('archive')) return '📦'
  return '📎'
}

/**
 * Generate initials from a name
 */
export function generateInitials(name: string, maxLength: number = 2): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('')
}

/**
 * Generate avatar color class based on name hash
 */
export function generateAvatarColor(name: string): string {
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600', 
    'bg-purple-100 text-purple-600',
    'bg-orange-100 text-orange-600',
    'bg-pink-100 text-pink-600',
    'bg-indigo-100 text-indigo-600',
    'bg-teal-100 text-teal-600',
    'bg-red-100 text-red-600',
    'bg-yellow-100 text-yellow-600',
    'bg-cyan-100 text-cyan-600'
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Format date range for display
 */
export function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  
  return {
    start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    duration: `${duration} days`
  }
}

/**
 * Calculate duration between two dates in days
 */
export function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
