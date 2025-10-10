/**
 * Consolidated Entity Types
 * Single source of truth for all business entities
 */

import type { 
  ReviewStatusValue, 
  GradeValue, 
  PriorityValue,
  ReviewTypeValue,
  ReviewModeValue
} from '@/lib/constants'

import type {
  ReviewWorkflowStatus,
  WorkflowStage,
  AcceptanceTracking,
  ReviewerRating,
  TechnicalDirectorVerification,
  CEOFinalReview,
  CategorizedDocument,
  WorkflowHistoryEntry,
  NotificationLog,
  ReviewWorkflowData
} from './workflow'

// ============================================================================
// ATTACHMENT (Unified type for documents/files)
// ============================================================================

export interface Attachment {
  id: string
  name: string
  size: string | number // Allow both for flexibility
  uploadedBy: string
  uploadedAt: string
  type: string
  url?: string
  // Optional fields for specific contexts
  uploadedById?: string
  reviewId?: string
}

// ============================================================================
// COMMENT
// ============================================================================

export interface Comment {
  id: string
  reviewId: string
  author: string
  authorId: string
  content: string
  timestamp: string
  avatar?: string
}

// ============================================================================
// REVIEW (Enhanced with Workflow)
// ============================================================================

export interface Review {
  // Basic Information
  id: string
  memberFirm: string
  memberFirmId?: string
  type: 'Current Member' | 'Prospect'
  country: string
  year?: string
  
  // Assignment Information
  reviewer: string
  reviewerId?: string
  reviewerStatus: 'Active' | 'Inactive' | 'Pending'
  partnerStatus: 'Active' | 'Inactive' | 'Pending'
  reviewType?: '18' | '8' | '5'
  reviewMode?: 'remote' | 'onsite' | 'other'
  
  // Dates
  startDate: string
  endDate: string
  assignedAt?: string
  assignedBy?: string
  
  // Current Status & Grade (Legacy + New)
  status: ReviewStatusValue // Legacy status
  workflowStatus?: ReviewWorkflowStatus // New workflow-aware status
  currentStage?: WorkflowStage
  currentGrade: GradeValue // Maps to final grade when complete
  
  // Metadata
  description?: string
  priority: PriorityValue
  lastUpdated: string
  percentage?: number
  
  // Workflow Data (New)
  acceptance?: AcceptanceTracking
  reviewerRating?: ReviewerRating
  technicalDirectorVerification?: TechnicalDirectorVerification
  ceoFinalReview?: CEOFinalReview
  
  // Documents (Enhanced)
  documents?: Attachment[] // Legacy - all documents
  categorizedDocuments?: CategorizedDocument[] // New - categorized by type
  
  // Workflow Tracking
  workflowHistory?: WorkflowHistoryEntry[]
  notifications?: NotificationLog[]
  
  // SLA & Deadlines
  dueDate?: string
  isOverdue?: boolean
  remindersSent?: number
  
  // Team Communication
  teamMeetingLink?: string
  
  // Conditions/Alerts
  conditions?: boolean
  
  // Complete workflow data (optional, for detailed views)
  workflow?: ReviewWorkflowData
}

// ============================================================================
// REVIEWER
// ============================================================================

export interface Reviewer {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive' | 'Pending'
  specialization?: string[]
  assignedReviews?: number
  completedReviews?: number
  avatar?: string
}

// ============================================================================
// MEMBER FIRM
// ============================================================================

export interface MemberFirm {
  id: string
  name: string
  location: string
  country: string
  type: 'current_member' | 'prospect'
  status: 'active' | 'inactive' | 'pending'
  employeeCount: number
  partnerCount: number
  complianceScore: number
  riskLevel: 'low' | 'medium' | 'high'
  totalReviews: number
  contactEmail: string
  contactPhone: string
  contactPerson?: string
  specializations: string[]
  joinDate: string
  lastReviewDate?: string
  avatar?: string
}

// ============================================================================
// ASSIGNMENT DATA
// ============================================================================

export interface ReviewAssignment {
  reviewerId: string
  reviewType: ReviewTypeValue
  reviewMode: ReviewModeValue
  assignDate: string
  deadlineDate: string
  teamMeetingLink?: string
  forceAssignment: boolean
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface ReviewFilters {
  search: string
  year: string
  grade: string
  reviewType: string
  country: string
}

export interface ReviewAssignFormData {
  reviewerId: string
  reviewType: string
  reviewMode: string
  assignDate: Date | undefined
  deadlineDate: Date | undefined
  teamMeetingLink: string
  forceAssignment: boolean
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface APIResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isAttachment(obj: any): obj is Attachment {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.uploadedBy === 'string'
  )
}

export function isReview(obj: any): obj is Review {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.memberFirm === 'string' &&
    typeof obj.reviewer === 'string'
  )
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ViewMode = 'list' | 'card'
export type FilterValue = string | number | boolean | null | undefined

// Extract keys for type safety
export type ReviewKey = keyof Review
export type AttachmentKey = keyof Attachment
export type ReviewerKey = keyof Reviewer

// Partial types for updates
export type ReviewUpdate = Partial<Review>
export type AttachmentUpdate = Partial<Attachment>

// Required fields for creation
export type CreateReview = Omit<Review, 'id' | 'lastUpdated'>
export type CreateAttachment = Omit<Attachment, 'id' | 'uploadedAt'>

