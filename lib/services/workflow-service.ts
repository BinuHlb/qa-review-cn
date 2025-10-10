/**
 * Workflow Service
 * Business logic for QA Review workflow management
 */

import type { Review } from '@/types/entities'
import type {
  ReviewWorkflowStatus,
  WorkflowStage,
  AssignReviewAction,
  AcceptReviewAction,
  RejectReviewAction,
  SubmitReviewAction,
  VerifyReviewAction,
  FinalizeReviewAction,
  WorkflowHistoryEntry,
  NotificationLog
} from '@/types/workflow'

import {
  getWorkflowStageFromStatus,
  canTransitionTo,
  isAcceptanceComplete
} from '@/types/workflow'

// ============================================================================
// WORKFLOW TRANSITIONS
// ============================================================================

export class WorkflowService {
  /**
   * Assign a review to a reviewer
   */
  static assignReview(review: Review, action: AssignReviewAction): Review {
    const now = new Date().toISOString()
    
    return {
      ...review,
      reviewer: action.reviewerId, // Should be reviewer name from lookup
      reviewerId: action.reviewerId,
      reviewType: action.reviewType,
      reviewMode: action.reviewMode,
      assignedAt: action.assignDate,
      assignedBy: 'Admin', // TODO: Get from session
      dueDate: action.deadlineDate,
      teamMeetingLink: action.teamMeetingLink,
      workflowStatus: 'pending_acceptance',
      currentStage: 'acceptance',
      status: 'Pending',
      lastUpdated: now,
      acceptance: {
        reviewer: {
          accepted: false
        },
        firm: {
          accepted: false
        },
        emailsSent: [
          `notification-to-reviewer-${now}`,
          `notification-to-firm-${now}`
        ],
        reminders: 0
      },
      workflowHistory: [
        ...(review.workflowHistory || []),
        {
          id: `history-${Date.now()}`,
          timestamp: now,
          action: 'Review Assigned',
          performedBy: 'Admin',
          performedByRole: 'admin',
          fromStatus: review.workflowStatus,
          toStatus: 'pending_acceptance',
          notes: `Assigned to ${action.reviewerId} for ${action.reviewType} hour review`,
          metadata: { assignmentDetails: action }
        }
      ]
    }
  }

  /**
   * Reviewer or Firm accepts the review
   */
  static acceptReview(review: Review, action: AcceptReviewAction): Review {
    const now = new Date().toISOString()
    const isReviewer = action.acceptedByRole === 'reviewer'
    
    const acceptance = review.acceptance || {
      reviewer: { accepted: false },
      firm: { accepted: false },
      emailsSent: [],
      reminders: 0
    }
    
    if (isReviewer) {
      acceptance.reviewer = {
        accepted: true,
        acceptedAt: now,
        acceptedBy: action.acceptedBy
      }
    } else {
      acceptance.firm = {
        accepted: true,
        acceptedAt: now,
        acceptedBy: action.acceptedBy
      }
    }
    
    // Check if both have accepted
    const bothAccepted = acceptance.reviewer.accepted && acceptance.firm.accepted
    
    let newWorkflowStatus: ReviewWorkflowStatus
    if (bothAccepted) {
      newWorkflowStatus = 'accepted'
    } else if (isReviewer) {
      newWorkflowStatus = 'reviewer_accepted'
    } else {
      newWorkflowStatus = 'firm_accepted'
    }
    
    return {
      ...review,
      acceptance,
      workflowStatus: newWorkflowStatus,
      status: bothAccepted ? 'In Progress' : 'Pending',
      lastUpdated: now,
      workflowHistory: [
        ...(review.workflowHistory || []),
        {
          id: `history-${Date.now()}`,
          timestamp: now,
          action: `${isReviewer ? 'Reviewer' : 'Firm'} Accepted`,
          performedBy: action.acceptedBy,
          performedByRole: action.acceptedByRole,
          fromStatus: review.workflowStatus,
          toStatus: newWorkflowStatus,
          notes: action.acceptanceNotes || `Accepted by ${action.acceptedBy}`
        }
      ],
      notifications: [
        ...(review.notifications || []),
        {
          id: `notif-${Date.now()}`,
          type: 'email',
          recipient: 'admin@qa-review.com',
          recipientRole: 'admin',
          subject: `Review ${review.id} accepted by ${isReviewer ? 'Reviewer' : 'Firm'}`,
          sentAt: now,
          status: 'sent',
          relatedAction: 'acceptance_confirmation'
        }
      ]
    }
  }

  /**
   * Reviewer or Firm rejects the review
   */
  static rejectReview(review: Review, action: RejectReviewAction): Review {
    const now = new Date().toISOString()
    const isReviewer = action.rejectedByRole === 'reviewer'
    
    const acceptance = review.acceptance || {
      reviewer: { accepted: false },
      firm: { accepted: false },
      emailsSent: [],
      reminders: 0
    }
    
    if (isReviewer) {
      acceptance.reviewer = {
        accepted: false,
        rejectionReason: action.rejectionReason,
        rejectedAt: now
      }
    } else {
      acceptance.firm = {
        accepted: false,
        rejectionReason: action.rejectionReason,
        rejectedAt: now
      }
    }
    
    return {
      ...review,
      acceptance,
      workflowStatus: 'rejected',
      status: 'Rejected',
      lastUpdated: now,
      workflowHistory: [
        ...(review.workflowHistory || []),
        {
          id: `history-${Date.now()}`,
          timestamp: now,
          action: `${isReviewer ? 'Reviewer' : 'Firm'} Rejected`,
          performedBy: action.rejectedBy,
          performedByRole: action.rejectedByRole,
          fromStatus: review.workflowStatus,
          toStatus: 'rejected',
          notes: `Rejection reason: ${action.rejectionReason}`
        }
      ],
      notifications: [
        ...(review.notifications || []),
        {
          id: `notif-${Date.now()}`,
          type: 'email',
          recipient: 'admin@qa-review.com',
          recipientRole: 'admin',
          subject: `Review ${review.id} rejected by ${isReviewer ? 'Reviewer' : 'Firm'}`,
          sentAt: now,
          status: 'sent',
          relatedAction: 'rejection_notification'
        }
      ]
    }
  }

  /**
   * Start review (when reviewer begins work)
   */
  static startReview(review: Review, startedBy: string): Review {
    const now = new Date().toISOString()
    
    return {
      ...review,
      workflowStatus: 'in_progress',
      currentStage: 'review',
      status: 'In Progress',
      lastUpdated: now,
      workflowHistory: [
        ...(review.workflowHistory || []),
        {
          id: `history-${Date.now()}`,
          timestamp: now,
          action: 'Review Started',
          performedBy: startedBy,
          performedByRole: 'reviewer',
          fromStatus: review.workflowStatus,
          toStatus: 'in_progress'
        }
      ]
    }
  }

  /**
   * Submit review for verification
   */
  static submitReview(review: Review, action: SubmitReviewAction): Review {
    const now = new Date().toISOString()
    
    return {
      ...review,
      reviewerRating: action.rating,
      workflowStatus: 'submitted_for_verification',
      currentStage: 'verification',
      status: 'Submitted',
      currentGrade: action.rating.grade, // Preliminary grade
      lastUpdated: now,
      workflowHistory: [
        ...(review.workflowHistory || []),
        {
          id: `history-${Date.now()}`,
          timestamp: now,
          action: 'Review Submitted for Verification',
          performedBy: action.rating.submittedBy,
          performedByRole: 'reviewer',
          fromStatus: review.workflowStatus,
          toStatus: 'submitted_for_verification',
          notes: `Initial rating: ${action.rating.grade}/5`,
          metadata: { rating: action.rating }
        }
      ],
      notifications: [
        ...(review.notifications || []),
        {
          id: `notif-${Date.now()}`,
          type: 'email',
          recipient: 'technical-director@qa-review.com',
          recipientRole: 'director',
          subject: `Review ${review.id} submitted for verification`,
          sentAt: now,
          status: 'sent',
          relatedAction: 'submission_notification'
        }
      ]
    }
  }

  /**
   * Technical Director verifies the review
   */
  static verifyReview(review: Review, action: VerifyReviewAction): Review {
    const now = new Date().toISOString()
    
    return {
      ...review,
      technicalDirectorVerification: action.verification,
      workflowStatus: 'verified_pending_final',
      currentStage: 'finalization',
      currentGrade: action.verification.grade, // Updated grade
      lastUpdated: now,
      workflowHistory: [
        ...(review.workflowHistory || []),
        {
          id: `history-${Date.now()}`,
          timestamp: now,
          action: 'Review Verified by Technical Director',
          performedBy: action.verification.verifiedBy,
          performedByRole: 'director',
          fromStatus: review.workflowStatus,
          toStatus: 'verified_pending_final',
          notes: `Verified rating: ${action.verification.grade}/5${action.verification.modified ? ' (Modified)' : ''}`,
          metadata: { verification: action.verification }
        }
      ],
      notifications: [
        ...(review.notifications || []),
        {
          id: `notif-${Date.now()}`,
          type: 'email',
          recipient: 'ceo@qa-review.com',
          recipientRole: 'ceo',
          subject: `Review ${review.id} verified and ready for final approval`,
          sentAt: now,
          status: 'sent',
          relatedAction: 'verification_notification'
        }
      ]
    }
  }

  /**
   * CEO finalizes the review
   */
  static finalizeReview(review: Review, action: FinalizeReviewAction): Review {
    const now = new Date().toISOString()
    
    return {
      ...review,
      ceoFinalReview: action.finalReview,
      workflowStatus: 'completed',
      currentStage: 'finalization',
      status: 'Completed',
      currentGrade: action.finalReview.finalGrade, // Final grade
      lastUpdated: now,
      workflowHistory: [
        ...(review.workflowHistory || []),
        {
          id: `history-${Date.now()}`,
          timestamp: now,
          action: 'Review Finalized by CEO',
          performedBy: action.finalReview.finalizedBy,
          performedByRole: 'ceo',
          fromStatus: review.workflowStatus,
          toStatus: 'completed',
          notes: `Final rating: ${action.finalReview.finalGrade}/5`,
          metadata: { finalReview: action.finalReview }
        }
      ],
      notifications: [
        ...(review.notifications || []),
        {
          id: `notif-${Date.now()}`,
          type: 'email',
          recipient: review.memberFirm,
          recipientRole: 'firm',
          subject: `Review ${review.id} completed`,
          sentAt: now,
          status: 'sent',
          relatedAction: 'completion_notification'
        },
        {
          id: `notif-${Date.now() + 1}`,
          type: 'email',
          recipient: review.reviewer,
          recipientRole: 'reviewer',
          subject: `Review ${review.id} completed`,
          sentAt: now,
          status: 'sent',
          relatedAction: 'completion_notification'
        }
      ]
    }
  }

  /**
   * Cancel review
   */
  static cancelReview(review: Review, cancelledBy: string, reason: string): Review {
    const now = new Date().toISOString()
    
    return {
      ...review,
      workflowStatus: 'cancelled',
      status: 'Cancelled',
      lastUpdated: now,
      workflowHistory: [
        ...(review.workflowHistory || []),
        {
          id: `history-${Date.now()}`,
          timestamp: now,
          action: 'Review Cancelled',
          performedBy: cancelledBy,
          performedByRole: 'admin',
          fromStatus: review.workflowStatus,
          toStatus: 'cancelled',
          notes: reason
        }
      ]
    }
  }

  /**
   * Get workflow permissions for a review based on user role
   */
  static getPermissions(review: Review, userRole: string) {
    const status = review.workflowStatus || 'draft'
    
    // Admin can do everything
    if (userRole === 'admin') {
      return {
        canView: true,
        canEdit: true,
        canAssign: true,
        canAccept: true,
        canReject: true,
        canSubmit: true,
        canVerify: true,
        canFinalize: true,
        canCancel: true
      }
    }
    
    // Reviewer permissions
    if (userRole === 'reviewer') {
      return {
        canView: ['pending_acceptance', 'reviewer_accepted', 'accepted', 'in_progress', 'submitted_for_verification', 'verified_pending_final', 'completed'].includes(status),
        canEdit: status === 'in_progress',
        canAssign: false,
        canAccept: status === 'pending_acceptance' || status === 'firm_accepted',
        canReject: status === 'pending_acceptance',
        canSubmit: status === 'in_progress',
        canVerify: false,
        canFinalize: false,
        canCancel: false
      }
    }
    
    // Firm permissions
    if (userRole === 'firm') {
      return {
        canView: ['pending_acceptance', 'firm_accepted', 'accepted', 'in_progress', 'submitted_for_verification', 'verified_pending_final', 'completed'].includes(status),
        canEdit: false,
        canAssign: false,
        canAccept: status === 'pending_acceptance' || status === 'reviewer_accepted',
        canReject: status === 'pending_acceptance',
        canSubmit: false,
        canVerify: false,
        canFinalize: false,
        canCancel: false
      }
    }
    
    // Technical Director permissions
    if (userRole === 'director') {
      return {
        canView: ['submitted_for_verification', 'verified_pending_final', 'completed'].includes(status),
        canEdit: false,
        canAssign: false,
        canAccept: false,
        canReject: false,
        canSubmit: false,
        canVerify: status === 'submitted_for_verification',
        canFinalize: false,
        canCancel: false
      }
    }
    
    // CEO permissions
    if (userRole === 'ceo') {
      return {
        canView: ['verified_pending_final', 'completed'].includes(status),
        canEdit: false,
        canAssign: false,
        canAccept: false,
        canReject: false,
        canSubmit: false,
        canVerify: false,
        canFinalize: status === 'verified_pending_final',
        canCancel: false
      }
    }
    
    // Default: no permissions
    return {
      canView: false,
      canEdit: false,
      canAssign: false,
      canAccept: false,
      canReject: false,
      canSubmit: false,
      canVerify: false,
      canFinalize: false,
      canCancel: false
    }
  }
}

