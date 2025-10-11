"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Clock, 
  Star,
  AlertCircle,
  ThumbsDown
} from "lucide-react"
import type { Review, Attachment } from "@/types/entities"
import { useToast } from "@/hooks/use-toast"
import { AttachmentsSection } from "@/components/shared/attachments-section"
import { ReviewTimeline } from "@/components/shared/review-timeline"
import { RatingForm } from "@/components/shared/rating-form"
import { 
  ActionPanelLayout,
  ActionPanelHeader,
  ActionPanelSection
} from "@/components/shared/action-panel-layout"
import { 
  getGradeColor, 
  getStatusColor, 
  formatFileSize
} from "@/lib/utils/review-utils"

interface FinalReviewScreenProps {
  review: Review
  onConfirm: (reviewId: string, finalGrade: string, notes: string) => Promise<void>
  onReject: (reviewId: string, reason: string) => Promise<void>
  onBack: () => void
}

export function FinalReviewScreen({ review, onConfirm, onReject, onBack }: FinalReviewScreenProps) {
  const isProspect = review.type === 'Prospect'
  const [prospectDecision, setProspectDecision] = useState<'pass' | 'fail' | ''>('')
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const { toast } = useToast()
  
  const rejectFormRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to reject form when it becomes visible
  useEffect(() => {
    if (showRejectForm && rejectFormRef.current) {
      setTimeout(() => {
        rejectFormRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        })
      }, 100)
    }
  }, [showRejectForm])

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate loading attachments
    setAttachments([
      {
        id: "1",
        reviewId: review.id,
        name: "Financial_Report_2024.pdf",
        size: 2457600,
        type: "application/pdf",
        url: "/files/financial-report.pdf",
        uploadedBy: "John Smith",
        uploadedById: "user-1",
        uploadedAt: "2024-01-15T10:00:00Z"
      },
      {
        id: "2",
        reviewId: review.id,
        name: "Compliance_Checklist.xlsx",
        size: 156800,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        url: "/files/compliance-checklist.xlsx",
        uploadedBy: "Sarah Johnson",
        uploadedById: "user-2",
        uploadedAt: "2024-01-16T09:15:00Z"
      }
    ])
  }, [review.id])

  const handleFileUpload = (files: File[]) => {
    files.forEach(file => {
      const newAttachment: Attachment = {
        id: String(Date.now() + Math.random()),
        reviewId: review.id,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedBy: "Current User",
        uploadedById: "current-user",
        uploadedAt: new Date().toISOString(),
        url: ""
      }
      setAttachments(prev => [...prev, newAttachment])
    })
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const handleDownloadAttachment = (attachment: Attachment) => {
    console.log('Download attachment:', attachment)
  }


  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      })
      return
    }

    setIsRejecting(true)
    try {
      await onReject(review.id, rejectionReason)
      toast({
        title: "Review Rejected",
        description: "Review has been rejected and sent back for revision"
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to reject review",
        variant: "destructive"
      })
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <ActionPanelLayout
      header={
        <ActionPanelHeader
          title="Final Review"
          subtitle={`ID: ${review.id}`}
          badges={[
            { label: review.status, className: getStatusColor(review.status) },
            { label: review.currentGrade, className: getGradeColor(review.currentGrade) }
          ]}
          actions={
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Back
            </Button>
          }
        />
      }
    >
      <ActionPanelSection>
        {/* Review Documents - First Position */}
        <AttachmentsSection
          attachments={attachments.map(att => ({
            id: att.id,
            name: att.name,
            size: typeof att.size === 'number' ? formatFileSize(att.size) : String(att.size),
            uploadedBy: att.uploadedBy,
            uploadedAt: new Date(att.uploadedAt).toISOString(),
            type: att.type,
            url: att.url
          }))}
          onUpload={handleFileUpload}
          onRemove={handleRemoveAttachment}
          onDownload={handleDownloadAttachment}
          maxHeight="100%"
          showUpload={true}
          showDownload={true}
          showRemove={true}
          title="Review Documents"
        />

        {/* Review Timeline */}
        <ReviewTimeline
          review={review}
          reviewerGrade={review.currentGrade}
          reviewerNotes="Initial review completed"
          reviewerDate={review.lastUpdated}
          technicalDirectorGrade={review.status === 'Submitted' || review.status === 'Completed' ? review.currentGrade : undefined}
          technicalDirectorNotes={review.status === 'Submitted' || review.status === 'Completed' ? "Technical assessment completed" : undefined}
          technicalDirectorDate={review.status === 'Submitted' || review.status === 'Completed' ? review.lastUpdated : undefined}
          finalReviewStatus={review.status === 'Completed' ? 'approved' : 'pending'}
        />

        {/* Final Review Actions */}
        <RatingForm
          currentGrade={review.currentGrade}
          initialGrade={review.currentGrade}
          title="Final Review & Grading"
          icon={
            <div className="p-1.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
              <Star className="h-4 w-4 text-white" />
            </div>
          }
          gradeLabel="Final Grade"
          notesLabel="Admin Notes (Optional)"
          notesPlaceholder="Add notes or comments..."
          submitButtonText="Confirm Review"
          isProspect={isProspect}
          prospectDecision={prospectDecision}
          onProspectDecisionChange={setProspectDecision}
          onSubmit={async (grade, notes) => {
            await onConfirm(review.id, grade, notes)
            toast({
              title: "Success",
              description: "Review confirmed successfully"
            })
          }}
        />

        {/* Rejection Section */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowRejectForm(!showRejectForm)}
            className="w-full"
          >
            <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
            Reject Review
          </Button>

          {/* Compact Rejection Form */}
          {showRejectForm && (
            <div ref={rejectFormRef} className="space-y-3 p-3 bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium text-sm">Reject Review</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rejectionReason" className="text-xs font-medium text-red-800 dark:text-red-400">
                  Reason for Rejection *
                </Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Provide reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={2}
                  className="border-red-300 focus:border-red-500 text-sm resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleReject}
                  disabled={isRejecting || !rejectionReason.trim()}
                  variant="destructive"
                  size="sm"
                >
                  {isRejecting ? (
                    <>
                      <Clock className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
                      Confirm Rejection
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowRejectForm(false)
                    setRejectionReason("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </ActionPanelSection>
    </ActionPanelLayout>
  )
}
