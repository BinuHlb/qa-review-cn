"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Review } from "@/types/entities"
import { getGradeColor } from "@/lib/mock-data"
import { GradeSelect } from "@/components/shared/grade-select"
import { AttachmentsSection, type Attachment } from "@/components/shared/attachments-section"
import { ReviewTimeline } from "@/components/shared/review-timeline"
import { 
  ActionPanelLayout,
  ActionPanelHeader,
  ActionPanelSection,
  ActionPanelFormSection
} from "@/components/shared/action-panel-layout"
import { Star, Send } from "lucide-react"


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
  
  const [selectedGrade, setSelectedGrade] = useState<string>(review.currentGrade)
  const [reviewNotes, setReviewNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>(
    (review.documents || initialAttachments) as Attachment[]
  )
  const [additionalDocsRequest, setAdditionalDocsRequest] = useState("")

  const handleSubmitRating = async () => {
    if (!selectedGrade || !onSubmitRating) return
    
    setIsSubmitting(true)
    try {
      await onSubmitRating(review.id, selectedGrade, reviewNotes)
      // Reset form after successful submission
      setReviewNotes("")
    } catch (error) {
      console.error("Failed to submit rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTechnicalDirectorRating = async () => {
    if (!selectedGrade || !onTechnicalDirectorRating) return
    
    setIsSubmitting(true)
    try {
      await onTechnicalDirectorRating(review.id, selectedGrade, reviewNotes)
      // Reset form after successful submission
      setReviewNotes("")
    } catch (error) {
      console.error("Failed to submit technical director rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <ActionPanelFormSection
              title={showTechnicalDirectorRating ? "Technical Director Rating" : "Submit Review Rating"}
              icon={<Star className="h-5 w-5 text-primary" />}
              description={showTechnicalDirectorRating 
                ? `Reviewer: ${review.reviewer} • Grade: ${review.currentGrade}/5 - Review the submitted work and provide your technical assessment`
                : undefined}
              variant={showTechnicalDirectorRating ? "primary" : "default"}
            >
              {review.currentGrade && (
                <Badge variant="outline" className={`${getGradeColor(review.currentGrade)} text-xs mb-3`}>
                  Previous: {review.currentGrade}/5
                </Badge>
              )}

              {/* Grade Selection */}
              <GradeSelect
                value={selectedGrade}
                onValueChange={setSelectedGrade}
                label={showTechnicalDirectorRating ? "Technical Director Grade" : "Your Grade"}
                placeholder="Select grade"
                required={true}
              />

              {/* Review Notes */}
              <div className="space-y-1">
                <Label htmlFor="reviewNotes" className="text-xs font-medium text-muted-foreground">
                  {showTechnicalDirectorRating ? "Technical Feedback (Optional)" : "Review Notes (Optional)"}
                </Label>
                <Textarea
                  id="reviewNotes"
                  name="reviewNotes"
                  placeholder={showTechnicalDirectorRating 
                    ? "Add your technical assessment and feedback..."
                    : "Add your review comments and findings..."}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={2}
                  className="text-sm resize-none bg-white dark:bg-neutral-800"
                />
              </div>

              {/* Request Additional Documents */}
              <div className="space-y-1">
                <Label htmlFor="additional-docs-request" className="text-xs font-medium text-muted-foreground">
                  Request Additional Documents (Optional)
                </Label>
                <Textarea
                  id="additional-docs-request"
                  placeholder="Specify any additional documents needed from the member firm"
                  value={additionalDocsRequest}
                  onChange={(e) => setAdditionalDocsRequest(e.target.value)}
                  rows={2}
                  className="text-sm resize-none bg-white dark:bg-neutral-800"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={showTechnicalDirectorRating ? handleTechnicalDirectorRating : handleSubmitRating}
                disabled={isSubmitting || !selectedGrade}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting 
                  ? "Submitting..." 
                  : showTechnicalDirectorRating 
                    ? "Submit Technical Rating" 
                    : "Submit Rating"}
              </Button>
            </ActionPanelFormSection>
          )}
      </ActionPanelSection>
    </ActionPanelLayout>
  )
}

