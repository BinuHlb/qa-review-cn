/**
 * Application-wide constants
 * Single source of truth for all enums and constant values
 */

// Review Types (based on hours)
export const REVIEW_TYPES = {
  NORMAL: { value: 'normal', label: 'Normal', hours: '18 hours', hoursValue: '18' },
  REDUCE: { value: 'reduce', label: 'Reduce', hours: '8 hours', hoursValue: '8' },
  QUICK: { value: 'quick', label: 'Quick', hours: '5 hours', hoursValue: '5' }
} as const

export const REVIEW_TYPE_OPTIONS = [
  REVIEW_TYPES.NORMAL,
  REVIEW_TYPES.REDUCE,
  REVIEW_TYPES.QUICK
] as const

// Review Modes
export const REVIEW_MODES = {
  REMOTE: { value: 'remote', label: 'Remote' },
  ONSITE: { value: 'onsite', label: 'Onsite' },
  OTHER: { value: 'other', label: 'Other' }
} as const

export const REVIEW_MODE_OPTIONS = [
  REVIEW_MODES.REMOTE,
  REVIEW_MODES.ONSITE,
  REVIEW_MODES.OTHER
] as const

// Review Statuses (Legacy - kept for backward compatibility)
export const REVIEW_STATUS = {
  COMPLETED: 'Completed',
  SUBMITTED: 'Submitted',
  IN_PROGRESS: 'In Progress',
  PENDING: 'Pending',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected'
} as const

export const REVIEW_STATUS_OPTIONS = [
  REVIEW_STATUS.COMPLETED,
  REVIEW_STATUS.SUBMITTED,
  REVIEW_STATUS.IN_PROGRESS,
  REVIEW_STATUS.PENDING,
  REVIEW_STATUS.OVERDUE,
  REVIEW_STATUS.CANCELLED,
  REVIEW_STATUS.REJECTED
] as const

// Workflow Statuses (New - Detailed workflow tracking)
export const WORKFLOW_STATUS = {
  DRAFT: { value: 'draft', label: 'Draft', description: 'Review created but not assigned' },
  PENDING_ASSIGNMENT: { value: 'pending_assignment', label: 'Pending Assignment', description: 'Ready to assign to reviewer' },
  PENDING_ACCEPTANCE: { value: 'pending_acceptance', label: 'Pending Acceptance', description: 'Waiting for reviewer and firm acceptance' },
  REVIEWER_ACCEPTED: { value: 'reviewer_accepted', label: 'Reviewer Accepted', description: 'Reviewer accepted, waiting for firm' },
  FIRM_ACCEPTED: { value: 'firm_accepted', label: 'Firm Accepted', description: 'Firm accepted, waiting for reviewer' },
  ACCEPTED: { value: 'accepted', label: 'Accepted', description: 'Both parties accepted, ready to start' },
  IN_PROGRESS: { value: 'in_progress', label: 'In Progress', description: 'Reviewer is working on the review' },
  SUBMITTED_FOR_VERIFICATION: { value: 'submitted_for_verification', label: 'Submitted for Verification', description: 'Waiting for Technical Director review' },
  VERIFIED_PENDING_FINAL: { value: 'verified_pending_final', label: 'Verified - Pending Final', description: 'Waiting for CEO final approval' },
  COMPLETED: { value: 'completed', label: 'Completed', description: 'Review finalized by CEO' },
  OVERDUE: { value: 'overdue', label: 'Overdue', description: 'Past deadline' },
  CANCELLED: { value: 'cancelled', label: 'Cancelled', description: 'Review cancelled' },
  REJECTED: { value: 'rejected', label: 'Rejected', description: 'Rejected by reviewer or firm' }
} as const

export const WORKFLOW_STATUS_OPTIONS = [
  WORKFLOW_STATUS.DRAFT,
  WORKFLOW_STATUS.PENDING_ASSIGNMENT,
  WORKFLOW_STATUS.PENDING_ACCEPTANCE,
  WORKFLOW_STATUS.REVIEWER_ACCEPTED,
  WORKFLOW_STATUS.FIRM_ACCEPTED,
  WORKFLOW_STATUS.ACCEPTED,
  WORKFLOW_STATUS.IN_PROGRESS,
  WORKFLOW_STATUS.SUBMITTED_FOR_VERIFICATION,
  WORKFLOW_STATUS.VERIFIED_PENDING_FINAL,
  WORKFLOW_STATUS.COMPLETED,
  WORKFLOW_STATUS.OVERDUE,
  WORKFLOW_STATUS.CANCELLED,
  WORKFLOW_STATUS.REJECTED
] as const

// Workflow Stages
export const WORKFLOW_STAGE = {
  ASSIGNMENT: { value: 'assignment', label: 'Assignment', order: 1, icon: 'UserPlus' },
  ACCEPTANCE: { value: 'acceptance', label: 'Acceptance', order: 2, icon: 'CheckCircle' },
  REVIEW: { value: 'review', label: 'Review', order: 3, icon: 'FileText' },
  VERIFICATION: { value: 'verification', label: 'Verification', order: 4, icon: 'Shield' },
  FINALIZATION: { value: 'finalization', label: 'Finalization', order: 5, icon: 'Award' }
} as const

export const WORKFLOW_STAGE_OPTIONS = [
  WORKFLOW_STAGE.ASSIGNMENT,
  WORKFLOW_STAGE.ACCEPTANCE,
  WORKFLOW_STAGE.REVIEW,
  WORKFLOW_STAGE.VERIFICATION,
  WORKFLOW_STAGE.FINALIZATION
] as const

// Grades
export const GRADES = {
  ONE: '1',
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5'
} as const

export const GRADE_OPTIONS = [
  { value: GRADES.ONE, label: 'Grade 1', description: 'Best' },
  { value: GRADES.TWO, label: 'Grade 2', description: 'Good' },
  { value: GRADES.THREE, label: 'Grade 3', description: 'Ok' },
  { value: GRADES.FOUR, label: 'Grade 4', description: 'Bad' },
  { value: GRADES.FIVE, label: 'Grade 5', description: 'Poor' }
] as const

// Priorities
export const PRIORITY = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
} as const

export const PRIORITY_OPTIONS = [
  PRIORITY.HIGH,
  PRIORITY.MEDIUM,
  PRIORITY.LOW
] as const

// Member Firm Types
export const MEMBER_FIRM_TYPE = {
  CURRENT_MEMBER: 'Current Member',
  PROSPECT: 'Prospect'
} as const

export const MEMBER_FIRM_TYPE_OPTIONS = [
  MEMBER_FIRM_TYPE.CURRENT_MEMBER,
  MEMBER_FIRM_TYPE.PROSPECT
] as const

// Status Types (for reviewers and partners)
export const STATUS_TYPE = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending'
} as const

export const STATUS_TYPE_OPTIONS = [
  STATUS_TYPE.ACTIVE,
  STATUS_TYPE.INACTIVE,
  STATUS_TYPE.PENDING
] as const

// User Roles
export const USER_ROLE = {
  ADMIN: 'admin',
  CEO: 'ceo',
  DIRECTOR: 'director',
  REVIEWER: 'reviewer',
  FIRM: 'firm'
} as const

export const USER_ROLE_OPTIONS = [
  { value: USER_ROLE.ADMIN, label: 'Admin' },
  { value: USER_ROLE.CEO, label: 'CEO' },
  { value: USER_ROLE.DIRECTOR, label: 'Technical Director' },
  { value: USER_ROLE.REVIEWER, label: 'Reviewer' },
  { value: USER_ROLE.FIRM, label: 'Member Firm' }
] as const

// Color Schemes
export const STATUS_COLORS = {
  [REVIEW_STATUS.COMPLETED]: 'bg-emerald-500 text-white',
  [REVIEW_STATUS.SUBMITTED]: 'bg-violet-500 text-white',
  [REVIEW_STATUS.IN_PROGRESS]: 'bg-blue-500 text-white',
  [REVIEW_STATUS.PENDING]: 'bg-slate-500 text-white',
  [REVIEW_STATUS.OVERDUE]: 'bg-rose-500 text-white',
  [REVIEW_STATUS.CANCELLED]: 'bg-slate-400 text-white',
  [REVIEW_STATUS.REJECTED]: 'bg-red-500 text-white'
} as const

export const GRADE_COLORS = {
  [GRADES.ONE]: 'bg-emerald-500 text-white',
  [GRADES.TWO]: 'bg-blue-500 text-white',
  [GRADES.THREE]: 'bg-amber-500 text-white',
  [GRADES.FOUR]: 'bg-orange-500 text-white',
  [GRADES.FIVE]: 'bg-rose-500 text-white'
} as const

export const PRIORITY_COLORS = {
  [PRIORITY.HIGH]: 'bg-red-100 text-red-800',
  [PRIORITY.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [PRIORITY.LOW]: 'bg-green-100 text-green-800'
} as const

export const WORKFLOW_STATUS_COLORS = {
  'draft': 'bg-gray-100 text-gray-700',
  'pending_assignment': 'bg-blue-100 text-blue-700',
  'pending_acceptance': 'bg-amber-100 text-amber-700',
  'reviewer_accepted': 'bg-indigo-100 text-indigo-700',
  'firm_accepted': 'bg-purple-100 text-purple-700',
  'accepted': 'bg-emerald-100 text-emerald-700',
  'in_progress': 'bg-blue-500 text-white',
  'submitted_for_verification': 'bg-violet-500 text-white',
  'verified_pending_final': 'bg-indigo-500 text-white',
  'completed': 'bg-green-600 text-white',
  'overdue': 'bg-red-600 text-white',
  'cancelled': 'bg-gray-400 text-white',
  'rejected': 'bg-red-500 text-white'
} as const

export const WORKFLOW_STAGE_COLORS = {
  'assignment': 'bg-blue-500',
  'acceptance': 'bg-amber-500',
  'review': 'bg-indigo-500',
  'verification': 'bg-violet-500',
  'finalization': 'bg-green-500'
} as const

export const DOCUMENT_CATEGORY_COLORS = {
  'original': 'bg-blue-100 text-blue-700',
  'reviewed': 'bg-green-100 text-green-700',
  'supporting': 'bg-purple-100 text-purple-700',
  'final': 'bg-emerald-100 text-emerald-700',
  'correspondence': 'bg-gray-100 text-gray-700'
} as const

// Percentage color thresholds
export const PERCENTAGE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  AVERAGE: 40,
  POOR: 20
} as const

export const PERCENTAGE_COLORS = {
  EXCELLENT: 'text-emerald-600 dark:text-emerald-400',
  GOOD: 'text-blue-600 dark:text-blue-400',
  AVERAGE: 'text-amber-600 dark:text-amber-400',
  BELOW_AVERAGE: 'text-orange-600 dark:text-orange-400',
  POOR: 'text-rose-600 dark:text-rose-400'
} as const

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_TOTAL_SIZE: 50 * 1024 * 1024 // 50MB
} as const

// Allowed file types
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'image/jpeg',
  'image/png',
  'image/gif'
] as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
} as const

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  API: 'yyyy-MM-dd',
  TIMESTAMP: 'yyyy-MM-dd HH:mm:ss'
} as const

// Avatar colors (for consistent color generation)
export const AVATAR_COLORS = [
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
] as const

// Type exports for TypeScript
export type ReviewTypeValue = typeof REVIEW_TYPES[keyof typeof REVIEW_TYPES]['value']
export type ReviewModeValue = typeof REVIEW_MODES[keyof typeof REVIEW_MODES]['value']
export type ReviewStatusValue = typeof REVIEW_STATUS[keyof typeof REVIEW_STATUS]
export type GradeValue = typeof GRADES[keyof typeof GRADES]
export type PriorityValue = typeof PRIORITY[keyof typeof PRIORITY]
export type UserRoleValue = typeof USER_ROLE[keyof typeof USER_ROLE]

