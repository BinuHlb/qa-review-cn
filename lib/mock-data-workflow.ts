/**
 * Mock Data with Complete Workflow Support
 * Shows reviews at different workflow stages
 */

import type { Review } from '@/types/entities'
import type {
  ReviewWorkflowStatus,
  CategorizedDocument,
  WorkflowHistoryEntry,
  NotificationLog
} from '@/types/workflow'

// Helper to create workflow history entry
const createHistoryEntry = (
  action: string,
  performedBy: string,
  performedByRole: string,
  timestamp: string,
  fromStatus?: ReviewWorkflowStatus,
  toStatus?: ReviewWorkflowStatus,
  notes?: string
): WorkflowHistoryEntry => ({
  id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  timestamp,
  action,
  performedBy,
  performedByRole,
  fromStatus,
  toStatus,
  notes
})

// Helper to create notification log
const createNotification = (
  type: string,
  recipient: string,
  recipientRole: string,
  subject: string,
  sentAt: string
): NotificationLog => ({
  id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type: 'email',
  recipient,
  recipientRole,
  subject,
  sentAt,
  status: 'sent',
  relatedAction: type
})

export const workflowMockReviews: Review[] = [
  // ========================================================================
  // PENDING ACCEPTANCE (2 reviews)
  // ========================================================================
  {
    id: 'REV-PENDING-001',
    memberFirm: 'Ernst & Young Global',
    memberFirmId: 'FIRM-005',
    type: 'Current Member',
    reviewer: 'Michael Chen',
    reviewerId: 'REV-101',
    country: 'Singapore',
    year: '2024',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    reviewType: '18',
    reviewMode: 'remote',
    startDate: '2024-10-15',
    endDate: '2025-01-15',
    assignedAt: '2024-10-09T09:00:00Z',
    assignedBy: 'Admin User',
    dueDate: '2025-01-15',
    currentGrade: '3',
    status: 'Pending',
    workflowStatus: 'pending_acceptance',
    currentStage: 'acceptance',
    description: '18-hour quality assurance review for member firm',
    priority: 'High',
    lastUpdated: '2024-10-09T09:00:00Z',
    percentage: 0,
    previousRating: '2',
    teamMeetingLink: 'https://teams.microsoft.com/l/meetup/meeting123',
    isOverdue: false,
    remindersSent: 1,
    
    acceptance: {
      reviewer: {
        accepted: false
      },
      firm: {
        accepted: false
      },
      emailsSent: [
        'notification-to-michael.chen@example.com-2024-10-09',
        'notification-to-ey-global@example.com-2024-10-09'
      ],
      reminders: 1
    },
    
    workflowHistory: [
      createHistoryEntry(
        'Review Assigned',
        'Admin User',
        'admin',
        '2024-10-09T09:00:00Z',
        undefined,
        'pending_acceptance',
        'Assigned to Michael Chen for 18-hour review'
      )
    ],
    
    notifications: [
      createNotification(
        'assignment',
        'michael.chen@example.com',
        'reviewer',
        'New Review Assignment: Ernst & Young Global',
        '2024-10-09T09:00:00Z'
      ),
      createNotification(
        'assignment',
        'contact@ey-global.com',
        'firm',
        'Review Assignment Notification: REV-PENDING-001',
        '2024-10-09T09:00:00Z'
      ),
      createNotification(
        'reminder',
        'michael.chen@example.com',
        'reviewer',
        'Reminder: Please accept review REV-PENDING-001',
        '2024-10-10T09:00:00Z'
      )
    ],
    
    documents: [
      {
        id: 'DOC-PENDING-001',
        name: 'Financial Statements 2024.pdf',
        size: '3.2 MB',
        uploadedBy: 'Admin User',
        uploadedAt: '2024-10-09T09:00:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-PENDING-002',
        name: 'Audit Report Q3.pdf',
        size: '2.1 MB',
        uploadedBy: 'Admin User',
        uploadedAt: '2024-10-09T09:00:00Z',
        type: 'application/pdf'
      }
    ]
  },

  {
    id: 'REV-PENDING-002',
    memberFirm: 'Grant Thornton LLP',
    memberFirmId: 'FIRM-006',
    type: 'Prospect',
    reviewer: 'Emma Wilson',
    reviewerId: 'REV-102',
    country: 'Canada',
    year: '2024',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    reviewType: '8',
    reviewMode: 'onsite',
    startDate: '2024-10-20',
    endDate: '2024-11-20',
    assignedAt: '2024-10-08T14:30:00Z',
    assignedBy: 'Admin User',
    dueDate: '2024-11-20',
    currentGrade: '3',
    status: 'Pending',
    workflowStatus: 'reviewer_accepted',
    currentStage: 'acceptance',
    description: 'Prospect evaluation - 8 hour reduced review',
    priority: 'Medium',
    lastUpdated: '2024-10-09T10:15:00Z',
    percentage: 5,
    previousRating: '3',
    teamMeetingLink: 'https://teams.microsoft.com/l/meetup/meeting456',
    isOverdue: false,
    remindersSent: 0,
    
    acceptance: {
      reviewer: {
        accepted: true,
        acceptedAt: '2024-10-09T10:15:00Z',
        acceptedBy: 'Emma Wilson'
      },
      firm: {
        accepted: false
      },
      emailsSent: [
        'notification-to-emma.wilson@example.com-2024-10-08',
        'notification-to-grant-thornton@example.com-2024-10-08'
      ],
      reminders: 0
    },
    
    workflowHistory: [
      createHistoryEntry(
        'Review Assigned',
        'Admin User',
        'admin',
        '2024-10-08T14:30:00Z',
        undefined,
        'pending_acceptance',
        'Assigned to Emma Wilson for 8-hour review'
      ),
      createHistoryEntry(
        'Reviewer Accepted',
        'Emma Wilson',
        'reviewer',
        '2024-10-09T10:15:00Z',
        'pending_acceptance',
        'reviewer_accepted',
        'Accepted and ready to proceed once firm confirms'
      )
    ],
    
    notifications: [
      createNotification(
        'assignment',
        'emma.wilson@example.com',
        'reviewer',
        'New Review Assignment: Grant Thornton LLP',
        '2024-10-08T14:30:00Z'
      ),
      createNotification(
        'assignment',
        'contact@grant-thornton.com',
        'firm',
        'Review Assignment Notification',
        '2024-10-08T14:30:00Z'
      ),
      createNotification(
        'acceptance',
        'admin@qa-review.com',
        'admin',
        'Reviewer Accepted Review REV-PENDING-002',
        '2024-10-09T10:15:00Z'
      )
    ],
    
    documents: [
      {
        id: 'DOC-GT-001',
        name: 'Company Profile.pdf',
        size: '1.5 MB',
        uploadedBy: 'Admin User',
        uploadedAt: '2024-10-08T14:30:00Z',
        type: 'application/pdf'
      }
    ]
  },

  // ========================================================================
  // IN PROGRESS (2 reviews)
  // ========================================================================
  {
    id: 'REV-PROGRESS-001',
    memberFirm: 'Deloitte & Associates',
    memberFirmId: 'FIRM-001',
    type: 'Current Member',
    reviewer: 'John Smith',
    reviewerId: 'REV-103',
    country: 'United States',
    year: '2024',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    reviewType: '18',
    reviewMode: 'remote',
    startDate: '2024-09-15',
    endDate: '2024-12-15',
    assignedAt: '2024-09-10T09:00:00Z',
    assignedBy: 'Admin User',
    dueDate: '2024-12-15',
    currentGrade: '3',
    status: 'In Progress',
    workflowStatus: 'in_progress',
    currentStage: 'review',
    description: 'Annual quality review for established member',
    priority: 'High',
    lastUpdated: '2024-10-05T14:20:00Z',
    percentage: 45,
    previousRating: '2',
    teamMeetingLink: 'https://teams.microsoft.com/l/meetup/meeting789',
    isOverdue: false,
    remindersSent: 0,
    
    acceptance: {
      reviewer: {
        accepted: true,
        acceptedAt: '2024-09-11T08:30:00Z',
        acceptedBy: 'John Smith'
      },
      firm: {
        accepted: true,
        acceptedAt: '2024-09-11T10:45:00Z',
        acceptedBy: 'Michael Johnson',
        contactPerson: 'Michael Johnson, Partner'
      },
      emailsSent: [
        'notification-to-john.smith@example.com-2024-09-10',
        'notification-to-deloitte@example.com-2024-09-10'
      ],
      reminders: 0
    },
    
    workflowHistory: [
      createHistoryEntry(
        'Review Assigned',
        'Admin User',
        'admin',
        '2024-09-10T09:00:00Z',
        undefined,
        'pending_acceptance'
      ),
      createHistoryEntry(
        'Reviewer Accepted',
        'John Smith',
        'reviewer',
        '2024-09-11T08:30:00Z',
        'pending_acceptance',
        'reviewer_accepted'
      ),
      createHistoryEntry(
        'Firm Accepted',
        'Michael Johnson',
        'firm',
        '2024-09-11T10:45:00Z',
        'reviewer_accepted',
        'accepted'
      ),
      createHistoryEntry(
        'Review Started',
        'John Smith',
        'reviewer',
        '2024-09-15T09:00:00Z',
        'accepted',
        'in_progress',
        'Downloaded files and began review process'
      )
    ],
    
    documents: [
      {
        id: 'DOC-PROG-001',
        name: 'Financial Statements 2023.pdf',
        size: '2.5 MB',
        uploadedBy: 'Admin User',
        uploadedAt: '2024-09-10T09:00:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-PROG-002',
        name: 'Audit Report.pdf',
        size: '1.8 MB',
        uploadedBy: 'Admin User',
        uploadedAt: '2024-09-10T09:00:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-PROG-003',
        name: 'Compliance Certificate.pdf',
        size: '850 KB',
        uploadedBy: 'Admin User',
        uploadedAt: '2024-09-10T09:00:00Z',
        type: 'application/pdf'
      }
    ]
  },

  {
    id: 'REV-PROGRESS-002',
    memberFirm: 'BDO International',
    memberFirmId: 'FIRM-007',
    type: 'Current Member',
    reviewer: 'Sarah Martinez',
    reviewerId: 'REV-104',
    country: 'Spain',
    year: '2024',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    reviewType: '5',
    reviewMode: 'remote',
    startDate: '2024-10-01',
    endDate: '2024-10-20',
    assignedAt: '2024-09-25T11:00:00Z',
    assignedBy: 'Admin User',
    dueDate: '2024-10-20',
    currentGrade: '2',
    status: 'In Progress',
    workflowStatus: 'in_progress',
    currentStage: 'review',
    description: 'Quick 5-hour compliance check',
    priority: 'Low',
    lastUpdated: '2024-10-08T16:45:00Z',
    percentage: 75,
    previousRating: '3',
    teamMeetingLink: 'https://teams.microsoft.com/l/meetup/meeting321',
    isOverdue: false,
    remindersSent: 0,
    
    acceptance: {
      reviewer: {
        accepted: true,
        acceptedAt: '2024-09-26T09:00:00Z',
        acceptedBy: 'Sarah Martinez'
      },
      firm: {
        accepted: true,
        acceptedAt: '2024-09-26T09:15:00Z',
        acceptedBy: 'Carlos Rodriguez'
      },
      emailsSent: [],
      reminders: 0
    },
    
    workflowHistory: [
      createHistoryEntry(
        'Review Assigned',
        'Admin User',
        'admin',
        '2024-09-25T11:00:00Z',
        undefined,
        'pending_acceptance'
      ),
      createHistoryEntry(
        'Reviewer Accepted',
        'Sarah Martinez',
        'reviewer',
        '2024-09-26T09:00:00Z',
        'pending_acceptance',
        'reviewer_accepted'
      ),
      createHistoryEntry(
        'Firm Accepted',
        'Carlos Rodriguez',
        'firm',
        '2024-09-26T09:15:00Z',
        'reviewer_accepted',
        'accepted'
      ),
      createHistoryEntry(
        'Review Started',
        'Sarah Martinez',
        'reviewer',
        '2024-10-01T08:00:00Z',
        'accepted',
        'in_progress'
      )
    ],
    
    documents: [
      {
        id: 'DOC-BDO-001',
        name: 'Compliance Checklist.pdf',
        size: '1.2 MB',
        uploadedBy: 'Admin User',
        uploadedAt: '2024-09-25T11:00:00Z',
        type: 'application/pdf'
      }
    ]
  },

  // ========================================================================
  // SUBMITTED FOR VERIFICATION (2 reviews)
  // ========================================================================
  {
    id: 'REV-SUBMITTED-001',
    memberFirm: 'KPMG Advisory',
    memberFirmId: 'FIRM-002',
    type: 'Current Member',
    reviewer: 'David Lee',
    reviewerId: 'REV-105',
    country: 'South Korea',
    year: '2024',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    reviewType: '18',
    reviewMode: 'onsite',
    startDate: '2024-08-01',
    endDate: '2024-10-31',
    assignedAt: '2024-07-25T10:00:00Z',
    assignedBy: 'Admin User',
    dueDate: '2024-10-31',
    currentGrade: '2',
    status: 'Submitted',
    workflowStatus: 'submitted_for_verification',
    currentStage: 'verification',
    description: 'Comprehensive onsite review',
    priority: 'High',
    lastUpdated: '2024-10-07T11:30:00Z',
    percentage: 100,
    previousRating: '3',
    teamMeetingLink: 'https://teams.microsoft.com/l/meetup/meeting654',
    isOverdue: false,
    remindersSent: 0,
    
    acceptance: {
      reviewer: {
        accepted: true,
        acceptedAt: '2024-07-26T09:00:00Z',
        acceptedBy: 'David Lee'
      },
      firm: {
        accepted: true,
        acceptedAt: '2024-07-26T09:30:00Z',
        acceptedBy: 'Jin Park'
      },
      emailsSent: [],
      reminders: 0
    },
    
    reviewerRating: {
      grade: '2',
      comments: 'Overall strong compliance with quality standards. Financial controls are robust. Documentation is thorough and well-organized. Minor improvements needed in risk assessment procedures.',
      strengths: 'Excellent documentation practices, Strong internal controls, Well-trained staff',
      areasForImprovement: 'Risk assessment methodology could be enhanced, Some procedures need updating',
      recommendations: 'Implement quarterly risk reviews, Update engagement letter templates',
      submittedBy: 'David Lee',
      submittedByRole: 'reviewer',
      submittedAt: '2024-10-07T11:30:00Z',
      timeSpentHours: 17.5
    },
    
    workflowHistory: [
      createHistoryEntry(
        'Review Assigned',
        'Admin User',
        'admin',
        '2024-07-25T10:00:00Z',
        undefined,
        'pending_acceptance'
      ),
      createHistoryEntry(
        'Both Parties Accepted',
        'System',
        'system',
        '2024-07-26T09:30:00Z',
        'pending_acceptance',
        'accepted'
      ),
      createHistoryEntry(
        'Review Started',
        'David Lee',
        'reviewer',
        '2024-08-01T08:00:00Z',
        'accepted',
        'in_progress'
      ),
      createHistoryEntry(
        'Review Submitted for Verification',
        'David Lee',
        'reviewer',
        '2024-10-07T11:30:00Z',
        'in_progress',
        'submitted_for_verification',
        'Initial rating: 2/5. Comprehensive review completed with detailed findings.'
      )
    ],
    
    notifications: [
      createNotification(
        'submission',
        'technical-director@qa-review.com',
        'director',
        'Review REV-SUBMITTED-001 ready for verification',
        '2024-10-07T11:30:00Z'
      )
    ],
    
    documents: [
      {
        id: 'DOC-KPMG-001',
        name: 'Financial Audit Report.pdf',
        size: '4.2 MB',
        uploadedBy: 'Admin User',
        uploadedAt: '2024-07-25T10:00:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-KPMG-002',
        name: 'Review Findings - REVIEWED.pdf',
        size: '3.8 MB',
        uploadedBy: 'David Lee',
        uploadedAt: '2024-10-07T11:00:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-KPMG-003',
        name: 'Compliance Checklist - COMPLETED.xlsx',
        size: '890 KB',
        uploadedBy: 'David Lee',
        uploadedAt: '2024-10-07T11:15:00Z',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    ]
  },

  {
    id: 'REV-SUBMITTED-002',
    memberFirm: 'Crowe Global',
    memberFirmId: 'FIRM-008',
    type: 'Prospect',
    reviewer: 'Lisa Anderson',
    reviewerId: 'REV-106',
    country: 'Australia',
    year: '2024',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    reviewType: '8',
    reviewMode: 'remote',
    startDate: '2024-09-01',
    endDate: '2024-10-15',
    assignedAt: '2024-08-25T14:00:00Z',
    assignedBy: 'Admin User',
    dueDate: '2024-10-15',
    currentGrade: '3',
    status: 'Submitted',
    workflowStatus: 'submitted_for_verification',
    currentStage: 'verification',
    description: 'Prospect evaluation - 8 hour review',
    priority: 'Medium',
    lastUpdated: '2024-10-06T15:45:00Z',
    percentage: 100,
    previousRating: '4',
    isOverdue: false,
    remindersSent: 0,
    
    reviewerRating: {
      grade: '3',
      comments: 'Satisfactory performance with room for improvement. Basic quality controls in place but need strengthening. Staff competency is adequate.',
      strengths: 'Good client communication, Timely delivery of services',
      areasForImprovement: 'Quality control processes, Technical training for staff, Documentation standards',
      submittedBy: 'Lisa Anderson',
      submittedByRole: 'reviewer',
      submittedAt: '2024-10-06T15:45:00Z',
      timeSpentHours: 7.5
    },
    
    workflowHistory: [
      createHistoryEntry(
        'Review Submitted for Verification',
        'Lisa Anderson',
        'reviewer',
        '2024-10-06T15:45:00Z',
        'in_progress',
        'submitted_for_verification',
        'Initial rating: 3/5'
      )
    ],
    
    documents: [
      {
        id: 'DOC-CROWE-001',
        name: 'Prospect Assessment.pdf',
        size: '2.1 MB',
        uploadedBy: 'Admin User',
        uploadedAt: '2024-08-25T14:00:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-CROWE-002',
        name: 'Assessment Report - REVIEWED.pdf',
        size: '2.5 MB',
        uploadedBy: 'Lisa Anderson',
        uploadedAt: '2024-10-06T15:30:00Z',
        type: 'application/pdf'
      }
    ]
  },

  // ========================================================================
  // VERIFIED - PENDING FINAL (2 reviews)
  // ========================================================================
  {
    id: 'REV-VERIFIED-001',
    memberFirm: 'PwC Global',
    memberFirmId: 'FIRM-003',
    type: 'Current Member',
    reviewer: 'Robert Taylor',
    reviewerId: 'REV-107',
    country: 'United Kingdom',
    year: '2024',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    reviewType: '18',
    reviewMode: 'remote',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    assignedAt: '2024-06-25T10:00:00Z',
    assignedBy: 'Admin User',
    dueDate: '2024-09-30',
    currentGrade: '1',
    status: 'Submitted',
    workflowStatus: 'verified_pending_final',
    currentStage: 'finalization',
    description: 'Premium member annual review',
    priority: 'High',
    lastUpdated: '2024-10-08T09:15:00Z',
    percentage: 100,
    previousRating: '1',
    isOverdue: false,
    remindersSent: 0,
    
    reviewerRating: {
      grade: '2',
      comments: 'Excellent quality standards maintained throughout. Comprehensive documentation and strong internal controls.',
      strengths: 'World-class quality management, Exceptional documentation, Strong governance',
      areasForImprovement: 'Could enhance digital transformation initiatives',
      submittedBy: 'Robert Taylor',
      submittedByRole: 'reviewer',
      submittedAt: '2024-09-28T16:00:00Z',
      timeSpentHours: 18
    },
    
    technicalDirectorVerification: {
      grade: '1',
      originalReviewerGrade: '2',
      modified: true,
      verificationNotes: 'After thorough review, I believe the performance warrants a Grade 1. The firm has demonstrated exceptional commitment to quality and has implemented best-in-class procedures that exceed industry standards. The digital transformation concerns mentioned are minor and being actively addressed.',
      agreementLevel: 'partial',
      additionalFindings: 'Notable excellence in risk management framework. Industry-leading audit methodology.',
      verifiedBy: 'Dr. James Patterson',
      verifiedByRole: 'director',
      verifiedAt: '2024-10-08T09:15:00Z'
    },
    
    workflowHistory: [
      createHistoryEntry(
        'Review Submitted for Verification',
        'Robert Taylor',
        'reviewer',
        '2024-09-28T16:00:00Z',
        'in_progress',
        'submitted_for_verification',
        'Initial rating: 2/5'
      ),
      createHistoryEntry(
        'Review Verified by Technical Director',
        'Dr. James Patterson',
        'director',
        '2024-10-08T09:15:00Z',
        'submitted_for_verification',
        'verified_pending_final',
        'Verified rating: 1/5 (Modified from 2/5)'
      )
    ],
    
    notifications: [
      createNotification(
        'verification',
        'ceo@qa-review.com',
        'ceo',
        'Review REV-VERIFIED-001 verified and ready for final approval',
        '2024-10-08T09:15:00Z'
      )
    ],
    
    documents: [
      {
        id: 'DOC-PWC-001',
        name: 'Annual Quality Report.pdf',
        size: '5.5 MB',
        uploadedBy: 'Admin User',
        uploadedAt: '2024-06-25T10:00:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-PWC-002',
        name: 'Reviewed Report - FINAL.pdf',
        size: '5.8 MB',
        uploadedBy: 'Robert Taylor',
        uploadedAt: '2024-09-28T15:45:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-PWC-003',
        name: 'Technical Director Notes.pdf',
        size: '1.2 MB',
        uploadedBy: 'Dr. James Patterson',
        uploadedAt: '2024-10-08T09:00:00Z',
        type: 'application/pdf'
      }
    ]
  },

  {
    id: 'REV-VERIFIED-002',
    memberFirm: 'Baker Tilly International',
    memberFirmId: 'FIRM-009',
    type: 'Current Member',
    reviewer: 'Maria Garcia',
    reviewerId: 'REV-108',
    country: 'Mexico',
    year: '2024',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    reviewType: '8',
    reviewMode: 'onsite',
    startDate: '2024-08-15',
    endDate: '2024-09-30',
    assignedAt: '2024-08-10T11:00:00Z',
    assignedBy: 'Admin User',
    dueDate: '2024-09-30',
    currentGrade: '3',
    status: 'Submitted',
    workflowStatus: 'verified_pending_final',
    currentStage: 'finalization',
    description: '8-hour focused review',
    priority: 'Medium',
    lastUpdated: '2024-10-07T14:30:00Z',
    percentage: 100,
    previousRating: '4',
    isOverdue: false,
    remindersSent: 0,
    
    reviewerRating: {
      grade: '3',
      comments: 'Adequate quality controls with some areas needing attention. Good overall performance.',
      submittedBy: 'Maria Garcia',
      submittedByRole: 'reviewer',
      submittedAt: '2024-09-29T17:00:00Z',
      timeSpentHours: 8
    },
    
    technicalDirectorVerification: {
      grade: '3',
      originalReviewerGrade: '3',
      modified: false,
      verificationNotes: 'I concur with the reviewer\'s assessment. The Grade 3 rating is appropriate. The firm meets minimum standards but should focus on the improvement areas identified.',
      agreementLevel: 'full',
      verifiedBy: 'Dr. James Patterson',
      verifiedByRole: 'director',
      verifiedAt: '2024-10-07T14:30:00Z'
    },
    
    workflowHistory: [
      createHistoryEntry(
        'Review Verified by Technical Director',
        'Dr. James Patterson',
        'director',
        '2024-10-07T14:30:00Z',
        'submitted_for_verification',
        'verified_pending_final',
        'Verified rating: 3/5 (Confirmed reviewer rating)'
      )
    ],
    
    documents: [
      {
        id: 'DOC-BAKER-001',
        name: 'Quality Assessment.pdf',
        size: '2.3 MB',
        uploadedBy: 'Admin User',
        uploadedAt: '2024-08-10T11:00:00Z',
        type: 'application/pdf'
      }
    ]
  },

  // ========================================================================
  // COMPLETED (5 reviews)
  // ========================================================================
  {
    id: 'REV-COMPLETE-001',
    memberFirm: 'RSM International',
    memberFirmId: 'FIRM-004',
    type: 'Current Member',
    reviewer: 'Thomas Brown',
    reviewerId: 'REV-109',
    country: 'Germany',
    year: '2024',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    reviewType: '18',
    reviewMode: 'onsite',
    startDate: '2024-05-01',
    endDate: '2024-08-01',
    assignedAt: '2024-04-25T09:00:00Z',
    assignedBy: 'Admin User',
    dueDate: '2024-08-01',
    currentGrade: '2',
    status: 'Completed',
    workflowStatus: 'completed',
    currentStage: 'finalization',
    description: 'Comprehensive 18-hour quality review',
    priority: 'High',
    lastUpdated: '2024-08-15T11:00:00Z',
    percentage: 100,
    previousRating: '3',
    isOverdue: false,
    remindersSent: 0,
    
    reviewerRating: {
      grade: '2',
      comments: 'High quality standards maintained. Excellent documentation and processes.',
      submittedBy: 'Thomas Brown',
      submittedByRole: 'reviewer',
      submittedAt: '2024-07-30T16:00:00Z',
      timeSpentHours: 17.5
    },
    
    technicalDirectorVerification: {
      grade: '2',
      originalReviewerGrade: '2',
      modified: false,
      verificationNotes: 'Fully agree with Grade 2 assessment. Excellent quality management system.',
      agreementLevel: 'full',
      verifiedBy: 'Dr. James Patterson',
      verifiedByRole: 'director',
      verifiedAt: '2024-08-05T10:00:00Z'
    },
    
    ceoFinalReview: {
      finalGrade: '2',
      reviewerGrade: '2',
      technicalDirectorGrade: '2',
      finalDecisionNotes: 'Excellent performance confirmed. The firm has demonstrated strong commitment to quality and professional standards. Grade 2 rating is well deserved.',
      executiveSummary: 'RSM International Germany has maintained high quality standards throughout the review period. The firm shows strong governance, excellent documentation practices, and commitment to continuous improvement.',
      actionItems: [
        'Continue quarterly quality reviews',
        'Share best practices with other member firms',
        'Consider for quality excellence award nomination'
      ],
      followUpRequired: false,
      finalizedBy: 'CEO Margaret Thompson',
      finalizedByRole: 'ceo',
      finalizedAt: '2024-08-15T11:00:00Z'
    },
    
    workflowHistory: [
      createHistoryEntry(
        'Review Finalized by CEO',
        'CEO Margaret Thompson',
        'ceo',
        '2024-08-15T11:00:00Z',
        'verified_pending_final',
        'completed',
        'Final rating: 2/5'
      )
    ],
    
    notifications: [
      createNotification(
        'finalization',
        'rsm-germany@example.com',
        'firm',
        'Review REV-COMPLETE-001 completed - Grade 2',
        '2024-08-15T11:00:00Z'
      ),
      createNotification(
        'finalization',
        'thomas.brown@example.com',
        'reviewer',
        'Review REV-COMPLETE-001 completed',
        '2024-08-15T11:00:00Z'
      )
    ],
    
    documents: [
      {
        id: 'DOC-RSM-001',
        name: 'Quality Management Review.pdf',
        size: '6.2 MB',
        uploadedBy: 'Admin User',
        uploadedAt: '2024-04-25T09:00:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-RSM-002',
        name: 'Final Report - APPROVED.pdf',
        size: '6.8 MB',
        uploadedBy: 'CEO Margaret Thompson',
        uploadedAt: '2024-08-15T10:45:00Z',
        type: 'application/pdf'
      }
    ]
  },

  {
    id: 'REV-COMPLETE-002',
    memberFirm: 'Mazars Group',
    memberFirmId: 'FIRM-010',
    type: 'Current Member',
    reviewer: 'Sophie Dubois',
    reviewerId: 'REV-110',
    country: 'France',
    year: '2024',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    reviewType: '8',
    reviewMode: 'remote',
    startDate: '2024-06-01',
    endDate: '2024-07-15',
    assignedAt: '2024-05-28T10:00:00Z',
    assignedBy: 'Admin User',
    dueDate: '2024-07-15',
    currentGrade: '1',
    status: 'Completed',
    workflowStatus: 'completed',
    currentStage: 'finalization',
    description: 'Focused 8-hour review',
    priority: 'Medium',
    lastUpdated: '2024-07-20T14:30:00Z',
    percentage: 100,
    previousRating: '2',
    isOverdue: false,
    remindersSent: 0,
    
    reviewerRating: {
      grade: '1',
      comments: 'Exceptional quality management. Industry-leading practices.',
      submittedBy: 'Sophie Dubois',
      submittedByRole: 'reviewer',
      submittedAt: '2024-07-14T15:00:00Z',
      timeSpentHours: 8
    },
    
    technicalDirectorVerification: {
      grade: '1',
      originalReviewerGrade: '1',
      modified: false,
      verificationNotes: 'Outstanding performance confirmed. Grade 1 is appropriate.',
      agreementLevel: 'full',
      verifiedBy: 'Dr. James Patterson',
      verifiedByRole: 'director',
      verifiedAt: '2024-07-16T09:00:00Z'
    },
    
    ceoFinalReview: {
      finalGrade: '1',
      reviewerGrade: '1',
      technicalDirectorGrade: '1',
      finalDecisionNotes: 'Exemplary performance. One of our top-rated member firms.',
      followUpRequired: false,
      finalizedBy: 'CEO Margaret Thompson',
      finalizedByRole: 'ceo',
      finalizedAt: '2024-07-20T14:30:00Z'
    },
    
    workflowHistory: [
      createHistoryEntry(
        'Review Finalized by CEO',
        'CEO Margaret Thompson',
        'ceo',
        '2024-07-20T14:30:00Z',
        'verified_pending_final',
        'completed',
        'Final rating: 1/5 - Excellence confirmed'
      )
    ],
    
    documents: []
  },

  {
    id: 'REV-COMPLETE-003',
    memberFirm: 'HLB International',
    memberFirmId: 'FIRM-011',
    type: 'Current Member',
    reviewer: 'Anna Kowalski',
    reviewerId: 'REV-111',
    country: 'Poland',
    year: '2023',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    reviewType: '18',
    reviewMode: 'onsite',
    startDate: '2023-11-01',
    endDate: '2024-01-31',
    currentGrade: '3',
    status: 'Completed',
    workflowStatus: 'completed',
    currentStage: 'finalization',
    description: 'Annual quality assurance review',
    priority: 'Medium',
    lastUpdated: '2024-02-15T10:00:00Z',
    percentage: 100,
    isOverdue: false,
    remindersSent: 0,
    
    reviewerRating: {
      grade: '3',
      comments: 'Meets minimum quality standards. Improvement areas identified.',
      submittedBy: 'Anna Kowalski',
      submittedByRole: 'reviewer',
      submittedAt: '2024-01-30T17:00:00Z',
      timeSpentHours: 18
    },
    
    technicalDirectorVerification: {
      grade: '3',
      originalReviewerGrade: '3',
      modified: false,
      verificationNotes: 'Grade 3 confirmed. Follow-up review recommended in 6 months.',
      agreementLevel: 'full',
      verifiedBy: 'Dr. James Patterson',
      verifiedByRole: 'director',
      verifiedAt: '2024-02-05T11:00:00Z'
    },
    
    ceoFinalReview: {
      finalGrade: '3',
      reviewerGrade: '3',
      technicalDirectorGrade: '3',
      finalDecisionNotes: 'Acceptable performance with improvement plan required.',
      followUpRequired: true,
      finalizedBy: 'CEO Margaret Thompson',
      finalizedByRole: 'ceo',
      finalizedAt: '2024-02-15T10:00:00Z'
    },
    
    workflowHistory: [],
    documents: []
  },

  {
    id: 'REV-COMPLETE-004',
    memberFirm: 'Nexia International',
    type: 'Prospect',
    reviewer: 'James O\'Brien',
    country: 'Ireland',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    startDate: '2023-09-01',
    endDate: '2023-10-31',
    currentGrade: '4',
    status: 'Completed',
    workflowStatus: 'completed',
    currentStage: 'finalization',
    priority: 'Low',
    lastUpdated: '2023-11-15T14:00:00Z',
    percentage: 100,
    reviewType: '8',
    year: '2023',
    
    ceoFinalReview: {
      finalGrade: '4',
      reviewerGrade: '4',
      technicalDirectorGrade: '4',
      finalDecisionNotes: 'Prospect does not meet our standards. Membership declined.',
      followUpRequired: false,
      finalizedBy: 'CEO Margaret Thompson',
      finalizedByRole: 'ceo',
      finalizedAt: '2023-11-15T14:00:00Z'
    },
    
    workflowHistory: [],
    documents: []
  },

  {
    id: 'REV-COMPLETE-005',
    memberFirm: 'Moore Global',
    type: 'Current Member',
    reviewer: 'Patricia Wong',
    country: 'Hong Kong',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    startDate: '2023-06-01',
    endDate: '2023-09-01',
    currentGrade: '2',
    status: 'Completed',
    workflowStatus: 'completed',
    currentStage: 'finalization',
    priority: 'High',
    lastUpdated: '2023-09-20T16:30:00Z',
    percentage: 100,
    reviewType: '18',
    year: '2023',
    
    ceoFinalReview: {
      finalGrade: '2',
      reviewerGrade: '2',
      technicalDirectorGrade: '2',
      finalDecisionNotes: 'Strong performance maintained. Membership renewed with commendation.',
      followUpRequired: false,
      finalizedBy: 'CEO Margaret Thompson',
      finalizedByRole: 'ceo',
      finalizedAt: '2023-09-20T16:30:00Z'
    },
    
    workflowHistory: [],
    documents: []
  }
]

// Export for use in application
export default workflowMockReviews


