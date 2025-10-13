/**
 * Shared utility functions for review components
 * Centralized to avoid duplication and ensure consistency
 */

/**
 * Get color classes for grade badges
 */
export function getGradeColor(grade: string): string {
  switch (grade) {
    case '1': return "bg-emerald-500 text-white border-emerald-500" // Best - 1 is best
    case '2': return "bg-blue-500 text-white border-blue-500"   // Good
    case '3': return "bg-amber-500 text-white border-amber-500" // Ok
    case '4': return "bg-orange-500 text-white border-orange-500" // Bad
    case '5': return "bg-rose-500 text-white border-rose-500"       // Poor - 5 is poor
    default: return "bg-slate-500 text-white border-slate-500"
  }
}

/**
 * Get color classes for status badges
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed': 
      return "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
    case 'submitted':
      return "bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800" // Ready for final review
    case 'in progress': 
      return "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
    case 'pending': 
      return "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
    case 'overdue': 
      return "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
    case 'cancelled':
      return "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700"
    case 'rejected':
      return "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
    case 'approved':
      return "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
    default: 
      return "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700"
  }
}

/**
 * Get color classes for reviewer status badges
 */
export function getReviewerStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'assigned': 
      return "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
    case 'in progress': 
      return "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
    case 'completed': 
      return "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
    case 'overdue': 
      return "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
    case 'pending':
      return "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700"
    default: 
      return "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700"
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
