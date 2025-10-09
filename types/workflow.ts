/**
 * Workflow-Specific Types
 * QA Review Multi-Stage Approval Workflow
 */

// ============================================================================
// WORKFLOW STATUSES
// ============================================================================

export type ReviewWorkflowStatus = 
  | 'draft'                      // Admin created, not assigned yet
  | 'pending_assignment'         // Ready to assign
  | 'pending_acceptance'         // Assigned, waiting for reviewer + firm acceptance
  | 'reviewer_accepted'          // Reviewer accepted, waiting for firm
  | 'firm_accepted'              // Firm accepted, waiting for reviewer
  | 'accepted'                   // Both accepted, ready to start
  | 'in_progress'                // Reviewer working on it
  | 'submitted_for_verification' // Reviewer submitted, TD to review
  | 'verified_pending_final'     // TD verified, CEO to finalize
  | 'completed'                  // CEO finalized
  | 'overdue'                    // Past deadline
  | 'cancelled'                  // Cancelled by admin
  | 'rejected'                   // Rejected at any stage

// ============================================================================
// WORKFLOW STAGES
// ============================================================================

export type WorkflowStage = 
  | 'assignment'
  | 'acceptance'
  | 'review'
  | 'verification'
  | 'finalization'

export interface WorkflowStageInfo {
  stage: WorkflowStage
  label: string
  description: string
  order: number
  icon: string
  completedStatuses: ReviewWorkflowStatus[]
}

// ============================================================================
// ACCEPTANCE TRACKING
// ============================================================================

export interface ReviewerAcceptance {
  accepted: boolean
  acceptedAt?: string
  acceptedBy?: string
  rejectionReason?: string
  rejectedAt?: string
}

export interface FirmAcceptance {
  accepted: boolean
  acceptedAt?: string
  acceptedBy?: string
  contactPerson?: string
  rejectionReason?: string
  rejectedAt?: string
}

export interface AcceptanceTracking {
  reviewer: ReviewerAcceptance
  firm: FirmAcceptance
  emailsSent: string[] // Track notification emails sent
  reminders: number // Number of reminder emails sent
}

// ============================================================================
// MULTI-STAGE RATINGS
// ============================================================================

export type GradeValue = '1' | '2' | '3' | '4' | '5'

export interface ReviewerRating {
  grade: GradeValue
  comments: string
  strengths?: string
  areasForImprovement?: string
  recommendations?: string
  submittedBy: string
  submittedByRole: string
  submittedAt: string
  timeSpentHours?: number
}

export interface TechnicalDirectorVerification {
  grade: GradeValue
  originalReviewerGrade: GradeValue
  modified: boolean // True if TD changed the grade
  verificationNotes: string
  agreementLevel: 'full' | 'partial' | 'disagree'
  additionalFindings?: string
  verifiedBy: string
  verifiedByRole: string
  verifiedAt: string
}

export interface CEOFinalReview {
  finalGrade: GradeValue
  reviewerGrade: GradeValue
  technicalDirectorGrade: GradeValue
  finalDecisionNotes: string
  executiveSummary?: string
  actionItems?: string[]
  followUpRequired: boolean
  finalizedBy: string
  finalizedByRole: string
  finalizedAt: string
}

// ============================================================================
// DOCUMENT CATEGORIES
// ============================================================================

export type DocumentCategory = 
  | 'original'           // From Salesforce/Admin
  | 'reviewed'           // Uploaded by reviewer after review
  | 'supporting'         // Additional supporting docs
  | 'final'              // Final documents from CEO
  | 'correspondence'     // Email attachments, etc.

export interface CategorizedDocument {
  id: string
  name: string
  size: string | number
  category: DocumentCategory
  uploadedBy: string
  uploadedByRole: string
  uploadedAt: string
  type: string
  url?: string
  description?: string
  isConfidential?: boolean
}

// ============================================================================
// WORKFLOW HISTORY
// ============================================================================

export interface WorkflowHistoryEntry {
  id: string
  timestamp: string
  action: string
  performedBy: string
  performedByRole: string
  fromStatus?: ReviewWorkflowStatus
  toStatus?: ReviewWorkflowStatus
  notes?: string
  metadata?: Record<string, any>
}

// ============================================================================
// NOTIFICATION TRACKING
// ============================================================================

export interface NotificationLog {
  id: string
  type: 'email' | 'sms' | 'in_app'
  recipient: string
  recipientRole: string
  subject: string
  sentAt: string
  status: 'sent' | 'delivered' | 'failed' | 'pending'
  relatedAction?: string
}

// ============================================================================
// COMPLETE WORKFLOW DATA
// ============================================================================

export interface ReviewWorkflowData {
  // Current status
  status: ReviewWorkflowStatus
  currentStage: WorkflowStage
  
  // Assignment
  assignedTo?: string
  assignedToRole?: string
  assignedBy?: string
  assignedAt?: string
  
  // Acceptance
  acceptance?: AcceptanceTracking
  
  // Ratings
  reviewerRating?: ReviewerRating
  technicalDirectorVerification?: TechnicalDirectorVerification
  ceoFinalReview?: CEOFinalReview
  
  // Documents
  documents: CategorizedDocument[]
  
  // History & Audit
  history: WorkflowHistoryEntry[]
  notifications: NotificationLog[]
  
  // Metadata
  createdAt: string
  lastUpdatedAt: string
  completedAt?: string
  
  // SLA & Deadlines
  dueDate?: string
  remindersSent: number
  isOverdue: boolean
}

// ============================================================================
// WORKFLOW ACTIONS
// ============================================================================

export interface AssignReviewAction {
  reviewId: string
  reviewerId: string
  reviewType: '18' | '8' | '5'
  reviewMode: 'remote' | 'onsite' | 'other'
  assignDate: string
  deadlineDate: string
  teamMeetingLink?: string
  forceAssignment?: boolean
  notes?: string
}

export interface AcceptReviewAction {
  reviewId: string
  acceptedBy: string
  acceptedByRole: 'reviewer' | 'firm'
  acceptanceNotes?: string
}

export interface RejectReviewAction {
  reviewId: string
  rejectedBy: string
  rejectedByRole: 'reviewer' | 'firm'
  rejectionReason: string
}

export interface SubmitReviewAction {
  reviewId: string
  rating: ReviewerRating
  reviewedDocuments: File[] | CategorizedDocument[]
}

export interface VerifyReviewAction {
  reviewId: string
  verification: TechnicalDirectorVerification
}

export interface FinalizeReviewAction {
  reviewId: string
  finalReview: CEOFinalReview
  additionalDocuments?: File[] | CategorizedDocument[]
}

// ============================================================================
// WORKFLOW UTILITIES
// ============================================================================

export interface WorkflowTransition {
  from: ReviewWorkflowStatus
  to: ReviewWorkflowStatus
  action: string
  requiredRole: string[]
  validationRules?: string[]
}

export interface WorkflowPermissions {
  canView: boolean
  canEdit: boolean
  canAssign: boolean
  canAccept: boolean
  canReject: boolean
  canSubmit: boolean
  canVerify: boolean
  canFinalize: boolean
  canCancel: boolean
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isReviewerRatingComplete(rating?: ReviewerRating): boolean {
  return !!(rating && rating.grade && rating.comments && rating.submittedAt)
}

export function isTDVerificationComplete(verification?: TechnicalDirectorVerification): boolean {
  return !!(verification && verification.grade && verification.verifiedAt)
}

export function isCEOReviewComplete(review?: CEOFinalReview): boolean {
  return !!(review && review.finalGrade && review.finalizedAt)
}

export function isAcceptanceComplete(acceptance?: AcceptanceTracking): boolean {
  return !!(
    acceptance &&
    acceptance.reviewer.accepted &&
    acceptance.firm.accepted
  )
}

// ============================================================================
// WORKFLOW STAGE HELPERS
// ============================================================================

export function getWorkflowStageFromStatus(status: ReviewWorkflowStatus): WorkflowStage {
  const stageMap: Record<ReviewWorkflowStatus, WorkflowStage> = {
    'draft': 'assignment',
    'pending_assignment': 'assignment',
    'pending_acceptance': 'acceptance',
    'reviewer_accepted': 'acceptance',
    'firm_accepted': 'acceptance',
    'accepted': 'acceptance',
    'in_progress': 'review',
    'submitted_for_verification': 'verification',
    'verified_pending_final': 'finalization',
    'completed': 'finalization',
    'overdue': 'review', // Could be at any stage, default to review
    'cancelled': 'assignment',
    'rejected': 'acceptance'
  }
  
  return stageMap[status]
}

export function canTransitionTo(
  currentStatus: ReviewWorkflowStatus,
  targetStatus: ReviewWorkflowStatus
): boolean {
  const validTransitions: Record<ReviewWorkflowStatus, ReviewWorkflowStatus[]> = {
    'draft': ['pending_assignment', 'cancelled'],
    'pending_assignment': ['pending_acceptance', 'cancelled'],
    'pending_acceptance': ['reviewer_accepted', 'firm_accepted', 'rejected', 'cancelled'],
    'reviewer_accepted': ['accepted', 'rejected', 'cancelled'],
    'firm_accepted': ['accepted', 'rejected', 'cancelled'],
    'accepted': ['in_progress', 'cancelled'],
    'in_progress': ['submitted_for_verification', 'overdue', 'cancelled'],
    'submitted_for_verification': ['verified_pending_final', 'in_progress', 'cancelled'],
    'verified_pending_final': ['completed', 'submitted_for_verification', 'cancelled'],
    'completed': [], // Final state
    'overdue': ['in_progress', 'submitted_for_verification', 'cancelled'],
    'cancelled': [], // Final state
    'rejected': ['pending_acceptance'] // Can be reassigned
  }
  
  return validTransitions[currentStatus]?.includes(targetStatus) ?? false
}

