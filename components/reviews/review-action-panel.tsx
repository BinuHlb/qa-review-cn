"use client"

import { useState } from "react"
import type { Review } from "@/types/entities"
import { AttachmentsSection, type Attachment } from "@/components/shared/attachments-section"
import { ReviewTimeline } from "@/components/shared/review-timeline"
import { RatingForm } from "@/components/shared/rating-form"
import { 
  ActionPanelLayout,
  ActionPanelHeader,
  ActionPanelSection
} from "@/components/shared/action-panel-layout"
import { Star } from "lucide-react"


interface ReviewActionPanelProps {
  review: Review
  initialAttachments?: Attachment[]
  onAttachmentUpload?: (files: File[]) => Promise<Attachment[]>
  onAttachmentRemove?: (attachmentId: string) => Promise<void>
  onAttachmentDownload?: (attachment: Attachment) => Promise<void>
  showSubmitRating?: boolean
  onSubmitRating?: (reviewId: string, grade: string, notes: string) => Promise<void>
  showTechnicalDirectorRating?: boolean
  onTechnicalDirectorRating?: (reviewId: string, grade: string, notes: string) => Promise<void>
  showTimeline?: boolean
  reviewerGrade?: string
  reviewerNotes?: string
  reviewerDate?: string
  technicalDirectorGrade?: string
  technicalDirectorNotes?: string
  technicalDirectorDate?: string
  finalReviewStatus?: 'approved' | 'rejected' | 'pending'
  finalReviewNotes?: string
  finalReviewDate?: string
  reviewers?: Array<{ id: string; name: string; role: string; status: string }>
  onSubmit?: (data: Record<string, unknown>) => void
  onAssignReviewer?: (review: Review) => void
}

export function ReviewActionPanel({ 
  review, 
  initialAttachments = [],
  onAttachmentUpload,
  onAttachmentRemove,
  onAttachmentDownload,
  showSubmitRating = false,
  onSubmitRating,
  showTechnicalDirectorRating = false,
  onTechnicalDirectorRating,
  showTimeline = false,
  reviewerGrade,
  reviewerNotes,
  reviewerDate,
  technicalDirectorGrade,
  technicalDirectorNotes,
  technicalDirectorDate,
  finalReviewStatus,
  finalReviewNotes,
  finalReviewDate
}: ReviewActionPanelProps) {
  
  const [attachments, setAttachments] = useState<Attachment[]>(
    (review.documents || initialAttachments) as Attachment[]
  )

  const handleFileUpload = async (files: File[]) => {
    if (onAttachmentUpload) {
      try {
        const newAttachments = await onAttachmentUpload(files)
        setAttachments(prev => [...prev, ...newAttachments])
      } catch (error) {
        console.error("Failed to upload files:", error)
      }
    } else {
      // Fallback if no upload handler
      files.forEach(file => {
        const newAttachment: Attachment = {
          id: String(Date.now() + Math.random()),
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          uploadedBy: "Current User",
          uploadedAt: new Date().toISOString(),
          type: file.type
        }
        setAttachments(prev => [...prev, newAttachment])
      })
    }
  }

  const handleRemoveAttachment = async (id: string) => {
    if (onAttachmentRemove) {
      try {
        await onAttachmentRemove(id)
        setAttachments(prev => prev.filter(att => att.id !== id))
      } catch (error) {
        console.error("Failed to remove attachment:", error)
      }
    } else {
      setAttachments(prev => prev.filter(att => att.id !== id))
    }
  }

  const handleDownloadAttachment = async (attachment: Attachment) => {
    if (onAttachmentDownload) {
      try {
        await onAttachmentDownload(attachment)
      } catch (error) {
        console.error("Failed to download attachment:", error)
      }
    } else {
      console.log('Download attachment:', attachment)
    }
  }





  return (
    <ActionPanelLayout
      header={
        <ActionPanelHeader
          title={review.memberFirm}
          subtitle={review.type}
          avatar={{ name: review.memberFirm }}
        />
      }
    >
      <ActionPanelSection>
          {/* Review Documents - First Position */}
          <div>
            <AttachmentsSection
              attachments={attachments}
              onUpload={handleFileUpload}
              onRemove={handleRemoveAttachment}
              onDownload={handleDownloadAttachment}
              maxHeight="100%"
              showUpload={true}
              showDownload={true}
              showRemove={true}
              title="Review Documents"
            />
          </div>

          {/* Review Timeline - If enabled */}
          {showTimeline && (
            <div>
              <ReviewTimeline
                review={review}
                reviewerGrade={reviewerGrade}
                reviewerNotes={reviewerNotes}
                reviewerDate={reviewerDate}
                technicalDirectorGrade={technicalDirectorGrade}
                technicalDirectorNotes={technicalDirectorNotes}
                technicalDirectorDate={technicalDirectorDate}
                finalReviewStatus={finalReviewStatus}
                finalReviewNotes={finalReviewNotes}
                finalReviewDate={finalReviewDate}
              />
            </div>
          )}

          {/* Submit Rating Form */}
          {(showSubmitRating || showTechnicalDirectorRating) && (
            <RatingForm
              currentGrade={review.currentGrade}
              initialGrade={review.currentGrade}
              title={showTechnicalDirectorRating ? "Technical Director Rating" : "Submit Review Rating"}
              icon={<Star className="h-5 w-5 text-primary" />}
              description={showTechnicalDirectorRating 
                ? `Reviewer: ${review.reviewer} • Grade: ${review.currentGrade}/5 - Review the submitted work and provide your technical assessment`
                : undefined}
              variant={showTechnicalDirectorRating ? "primary" : "default"}
              gradeLabel={showTechnicalDirectorRating ? "Technical Director Grade" : "Your Grade"}
              notesLabel={showTechnicalDirectorRating ? "Technical Feedback (Optional)" : "Review Notes (Optional)"}
              notesPlaceholder={showTechnicalDirectorRating 
                ? "Add your technical assessment and feedback..."
                : "Add your review comments and findings..."}
              showAdditionalDocsRequest={true}
              submitButtonText={showTechnicalDirectorRating ? "Submit Technical Rating" : "Submit Rating"}
              onSubmit={async (grade, notes, additionalDocs) => {
                if (showTechnicalDirectorRating && onTechnicalDirectorRating) {
                  await onTechnicalDirectorRating(review.id, grade, notes)
                } else if (onSubmitRating) {
                  await onSubmitRating(review.id, grade, notes)
                }
              }}
            />
          )}
      </ActionPanelSection>
    </ActionPanelLayout>
  )
}

