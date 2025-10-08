import { z } from "zod"

/**
 * Review validation schemas for form validation and API requests
 */

export const reviewSchema = z.object({
  id: z.string(),
  memberFirm: z.string().min(1, "Member firm is required"),
  type: z.string().min(1, "Review type is required"),
  reviewer: z.string().min(1, "Reviewer is required"),
  reviewerId: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  reviewerStatus: z.enum(['Active', 'Inactive', 'Pending']),
  partnerStatus: z.enum(['Active', 'Inactive', 'Pending']),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  currentGrade: z.enum(['1', '2', '3', '4', '5']),
  status: z.enum(['Completed', 'Submitted', 'In Progress', 'Pending', 'Overdue', 'Cancelled', 'Rejected']),
  description: z.string().optional(),
  priority: z.enum(['High', 'Medium', 'Low']),
  lastUpdated: z.string(),
})

export const createReviewSchema = reviewSchema.omit({ id: true, lastUpdated: true })

export const updateReviewSchema = reviewSchema.partial().required({ id: true })

export const assignReviewerSchema = z.object({
  reviewId: z.string().min(1, "Review ID is required"),
  reviewerId: z.string().min(1, "Reviewer is required"),
  priority: z.enum(['High', 'Medium', 'Low']).optional(),
  notes: z.string().optional(),
})

export const commentSchema = z.object({
  id: z.string(),
  reviewId: z.string(),
  author: z.string().min(1, "Author is required"),
  authorId: z.string().min(1, "Author ID is required"),
  content: z.string().min(1, "Comment content is required"),
  timestamp: z.string(),
})

export const createCommentSchema = commentSchema.omit({ id: true, timestamp: true })

export const attachmentSchema = z.object({
  id: z.string(),
  reviewId: z.string(),
  name: z.string(),
  size: z.number(),
  uploadedBy: z.string(),
  uploadedById: z.string(),
  uploadedAt: z.string(),
  type: z.string(),
  url: z.string(),
})

export const uploadAttachmentSchema = z.object({
  reviewId: z.string().min(1, "Review ID is required"),
  file: z.any(), // File will be validated separately
})

export type Review = z.infer<typeof reviewSchema>
export type CreateReview = z.infer<typeof createReviewSchema>
export type UpdateReview = z.infer<typeof updateReviewSchema>
export type AssignReviewer = z.infer<typeof assignReviewerSchema>
export type Comment = z.infer<typeof commentSchema>
export type CreateComment = z.infer<typeof createCommentSchema>
export type Attachment = z.infer<typeof attachmentSchema>

