"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type Review, getGradeColor } from "@/lib/mock-data"
import { AttachmentsSection, type Attachment } from "@/components/shared/attachments-section"
import { GradeSelect } from "@/components/shared/grade-select"
import { useAttachments } from "@/hooks/use-attachments"
import { 
  generateInitials,
  generateAvatarColor
} from "@/lib/utils/review-utils"
import { Star, Send } from "lucide-react"


interface ReviewActionPanelProps {
  review: Review
  initialAttachments?: Attachment[]
  onAttachmentUpload?: (files: File[]) => Promise<Attachment[]>
  onAttachmentRemove?: (attachmentId: string) => Promise<void>
  onAttachmentDownload?: (attachment: Attachment) => Promise<void>
  showSubmitRating?: boolean
  onSubmitRating?: (reviewId: string, grade: string, notes: string) => Promise<void>
}

export function ReviewActionPanel({ 
  review, 
  initialAttachments = [],
  onAttachmentUpload,
  onAttachmentRemove,
  onAttachmentDownload,
  showSubmitRating = false,
  onSubmitRating
}: ReviewActionPanelProps) {
  
  const [selectedGrade, setSelectedGrade] = useState<string>(review.currentGrade)
  const [reviewNotes, setReviewNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Use review documents or initial attachments
  const initialDocs = review.documents || initialAttachments
  
  // Use dynamic attachments hook
  const {
    attachments,
    handleUpload,
    handleRemove,
    handleDownload
  } = useAttachments({
    initialAttachments: initialDocs,
    onUpload: onAttachmentUpload,
    onRemove: onAttachmentRemove,
    onDownload: onAttachmentDownload
  })

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





  return (
    <div className="h-full flex flex-col bg-background overflow-hidden p-6">
      {/* Selected Review Header */}
      <div className="flex-shrink-0 pb-4 border-b">
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

      {/* Current Grade - Highlighted */}
      <div className="flex-shrink-0 my-4 bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${getGradeColor(review.currentGrade)} p-3 rounded-lg`}>
              <Star className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Current Rating</p>
              <p className="text-2xl font-bold text-neutral-900 mt-0.5">Rating {review.currentGrade}</p>
            </div>
          </div>
          <div className="text-center">
            <Badge className={`${getGradeColor(review.currentGrade)} text-base px-4 py-1.5 font-semibold`}>
              {review.currentGrade}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {review.currentGrade === '1' ? 'Best' :
               review.currentGrade === '2' ? 'Good' :
               review.currentGrade === '3' ? 'Ok' :
               review.currentGrade === '4' ? 'Bad' :
               'Poor'}
            </p>
          </div>
        </div>
      </div>

      {/* File Attachments - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <AttachmentsSection
          attachments={attachments}
          onUpload={handleUpload}
          onRemove={handleRemove}
          onDownload={handleDownload}
          showUpload={true}
          showDownload={true}
          showRemove={true}
        />
      </div>

      {/* Submit Rating Form - Fixed at Bottom */}
      {showSubmitRating && (
        <div className="flex-shrink-0 mt-4 pt-4 border-t">
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-neutral-900">Submit Review Rating</h3>
            </div>

            {/* Grade Selection */}
            <GradeSelect
              value={selectedGrade}
              onValueChange={setSelectedGrade}
              label="Your Grade"
              placeholder="Select grade"
              required={true}
            />

            {/* Review Notes */}
            <div className="space-y-2">
              <Label htmlFor="reviewNotes" className="text-xs font-medium text-muted-foreground">
                Review Notes (Optional)
              </Label>
              <Textarea
                id="reviewNotes"
                placeholder="Add your review comments and findings..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                className="text-sm resize-none bg-white"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitRating}
              disabled={isSubmitting || !selectedGrade}
              className="w-full h-9 bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}

