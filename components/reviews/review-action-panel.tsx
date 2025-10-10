"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Review } from "@/types/entities"
import { getGradeColor } from "@/lib/mock-data"
import { GradeSelect } from "@/components/shared/grade-select"
import { AttachmentsSection, type Attachment } from "@/components/shared/attachments-section"
import { ReviewTimeline } from "@/components/shared/review-timeline"
import { 
  generateInitials,
  generateAvatarColor
} from "@/lib/utils/review-utils"
import { Star, Send, FileText } from "lucide-react"


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
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Selected Review Header */}
      <div className="flex-shrink-0 p-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback className={`${generateAvatarColor(review.memberFirm)} text-sm font-semibold`}>
              {generateInitials(review.memberFirm)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-neutral-900 truncate" title={review.memberFirm}>
              {review.memberFirm}
            </h3>
            <p className="text-sm text-neutral-500 truncate" title={review.type}>
              {review.type}
            </p>
          </div>
        </div>
      </div>

      {/* Review Timeline - If enabled */}
      {showTimeline && (
        <div className="flex-shrink-0 px-6 py-4">
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

      {/* Review Documents - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
        <AttachmentsSection
          attachments={attachments}
          onUpload={handleFileUpload}
          onRemove={handleRemoveAttachment}
          onDownload={handleDownloadAttachment}
          maxHeight="500px"
          showUpload={true}
          showDownload={true}
          showRemove={true}
          title="Review Documents"
        />
      </div>

      {/* Submit Rating Form - Fixed at Bottom */}
      {(showSubmitRating || showTechnicalDirectorRating) && (
        <div className="flex-shrink-0 px-6 py-4 border-t">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-neutral-900">
                  {showTechnicalDirectorRating 
                    ? "Technical Director Rating" 
                    : "Submit Review Rating"}
                </h3>
              </div>
              {review.currentGrade && (
                <Badge variant="outline" className={`${getGradeColor(review.currentGrade)} text-xs`}>
                  Previous: {review.currentGrade}/5
                </Badge>
              )}
            </div>

            {showTechnicalDirectorRating && (
              <div className="p-2.5 bg-blue-50/50 border border-blue-200/50 rounded text-xs text-muted-foreground">
                <p className="text-blue-800">
                  <strong>Reviewer:</strong> {review.reviewer} • <strong>Grade:</strong> {review.currentGrade}/5
                </p>
                <p className="text-blue-700 mt-1">
                  Review the submitted work and provide your technical assessment
                </p>
              </div>
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
            <div className="space-y-1.5">
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
                rows={3}
                className="text-sm resize-none bg-white"
              />
            </div>

            {/* Request Additional Documents */}
            <div className="space-y-1.5">
              <Label htmlFor="additional-docs-request" className="text-xs font-medium text-muted-foreground">
                Request Additional Documents (Optional)
              </Label>
              <Textarea
                id="additional-docs-request"
                placeholder="Specify any additional documents needed from the member firm"
                value={additionalDocsRequest}
                onChange={(e) => setAdditionalDocsRequest(e.target.value)}
                rows={3}
                className="text-sm resize-none bg-white"
              />
              {additionalDocsRequest && (
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Request will be sent to member firm via email
                </p>
              )}
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
          </div>
        </div>
      )}

    </div>
  )
}

