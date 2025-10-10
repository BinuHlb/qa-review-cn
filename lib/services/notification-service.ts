/**
 * Notification Service
 * Simulates email notifications (will be replaced with real email service in production)
 */

import type { NotificationLog } from '@/types/workflow'

export interface SendNotificationParams {
  type: 'assignment' | 'acceptance' | 'rejection' | 'submission' | 'verification' | 'finalization' | 'reminder' | 'cancellation'
  recipient: string
  recipientRole: string
  reviewId: string
  reviewTitle: string
  additionalData?: Record<string, any>
}

export class NotificationService {
  /**
   * Send notification (simulated via toast in development)
   */
  static async send(params: SendNotificationParams): Promise<NotificationLog> {
    const now = new Date().toISOString()
    
    const subjects = {
      assignment: `New Review Assignment: ${params.reviewTitle}`,
      acceptance: `Review Accepted: ${params.reviewTitle}`,
      rejection: `Review Rejected: ${params.reviewTitle}`,
      submission: `Review Submitted for Verification: ${params.reviewTitle}`,
      verification: `Review Verified: ${params.reviewTitle}`,
      finalization: `Review Completed: ${params.reviewTitle}`,
      reminder: `Reminder: ${params.reviewTitle}`,
      cancellation: `Review Cancelled: ${params.reviewTitle}`
    }
    
    const notification: NotificationLog = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'email',
      recipient: params.recipient,
      recipientRole: params.recipientRole,
      subject: subjects[params.type],
      sentAt: now,
      status: 'sent',
      relatedAction: params.type
    }
    
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email Notification Sent:', {
        to: params.recipient,
        role: params.recipientRole,
        subject: notification.subject,
        type: params.type,
        reviewId: params.reviewId
      })
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return notification
  }

  /**
   * Send assignment notifications to reviewer and firm
   */
  static async sendAssignmentNotifications(
    reviewId: string,
    reviewTitle: string,
    reviewerEmail: string,
    firmEmail: string
  ): Promise<NotificationLog[]> {
    const [reviewerNotif, firmNotif] = await Promise.all([
      this.send({
        type: 'assignment',
        recipient: reviewerEmail,
        recipientRole: 'reviewer',
        reviewId,
        reviewTitle
      }),
      this.send({
        type: 'assignment',
        recipient: firmEmail,
        recipientRole: 'firm',
        reviewId,
        reviewTitle
      })
    ])
    
    return [reviewerNotif, firmNotif]
  }

  /**
   * Send acceptance confirmation to admin
   */
  static async sendAcceptanceConfirmation(
    reviewId: string,
    reviewTitle: string,
    acceptedBy: string,
    acceptedByRole: string
  ): Promise<NotificationLog> {
    return this.send({
      type: 'acceptance',
      recipient: 'admin@qa-review.com',
      recipientRole: 'admin',
      reviewId,
      reviewTitle,
      additionalData: { acceptedBy, acceptedByRole }
    })
  }

  /**
   * Send rejection notification to admin
   */
  static async sendRejectionNotification(
    reviewId: string,
    reviewTitle: string,
    rejectedBy: string,
    rejectedByRole: string,
    reason: string
  ): Promise<NotificationLog> {
    return this.send({
      type: 'rejection',
      recipient: 'admin@qa-review.com',
      recipientRole: 'admin',
      reviewId,
      reviewTitle,
      additionalData: { rejectedBy, rejectedByRole, reason }
    })
  }

  /**
   * Send submission notification to technical director
   */
  static async sendSubmissionNotification(
    reviewId: string,
    reviewTitle: string,
    technicalDirectorEmail: string
  ): Promise<NotificationLog> {
    return this.send({
      type: 'submission',
      recipient: technicalDirectorEmail,
      recipientRole: 'director',
      reviewId,
      reviewTitle
    })
  }

  /**
   * Send verification notification to CEO
   */
  static async sendVerificationNotification(
    reviewId: string,
    reviewTitle: string,
    ceoEmail: string
  ): Promise<NotificationLog> {
    return this.send({
      type: 'verification',
      recipient: ceoEmail,
      recipientRole: 'ceo',
      reviewId,
      reviewTitle
    })
  }

  /**
   * Send completion notifications to all stakeholders
   */
  static async sendCompletionNotifications(
    reviewId: string,
    reviewTitle: string,
    reviewerEmail: string,
    firmEmail: string,
    technicalDirectorEmail: string
  ): Promise<NotificationLog[]> {
    const notifications = await Promise.all([
      this.send({
        type: 'finalization',
        recipient: reviewerEmail,
        recipientRole: 'reviewer',
        reviewId,
        reviewTitle
      }),
      this.send({
        type: 'finalization',
        recipient: firmEmail,
        recipientRole: 'firm',
        reviewId,
        reviewTitle
      }),
      this.send({
        type: 'finalization',
        recipient: technicalDirectorEmail,
        recipientRole: 'director',
        reviewId,
        reviewTitle
      })
    ])
    
    return notifications
  }

  /**
   * Send reminder notification
   */
  static async sendReminder(
    reviewId: string,
    reviewTitle: string,
    recipient: string,
    recipientRole: string,
    reminderType: string
  ): Promise<NotificationLog> {
    return this.send({
      type: 'reminder',
      recipient,
      recipientRole,
      reviewId,
      reviewTitle,
      additionalData: { reminderType }
    })
  }

  /**
   * Display toast notification (for UI feedback)
   */
  static displayToast(
    title: string,
    description: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) {
    // This will be called from components using useToast hook
    return {
      title,
      description,
      variant: type === 'error' ? 'destructive' : 'default'
    }
  }
}

