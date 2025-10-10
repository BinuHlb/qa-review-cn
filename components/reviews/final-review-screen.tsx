"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Clock, 
  Star,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  
} from "lucide-react"
import type { Review, Attachment } from "@/types/entities"
import { type Comment } from "@/lib/schemas/review.schema"
import { useToast } from "@/hooks/use-toast"
import { ScrollablePanel } from "@/components/shared/scrollable-panel"
import { AttachmentsSection } from "@/components/shared/attachments-section"
import { ReviewTimeline } from "@/components/shared/review-timeline"
import { GradeSelect } from "@/components/shared/grade-select"
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
  const [finalGrade, setFinalGrade] = useState<string>(review.currentGrade)
  const [adminNotes, setAdminNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isConfirming, setIsConfirming] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)

  const [_comments, _setComments] = useState<Comment[]>([])
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
    // Simulate loading comments and attachments
    _setComments([
      {
        id: "1",
        reviewId: review.id,
        author: "John Smith",
        authorId: "user-1",
        content: "Initial review completed. All documents verified.",
        timestamp: "2024-01-15T10:30:00Z"
      },
      {
        id: "2", 
        reviewId: review.id,
        author: "Sarah Johnson",
        authorId: "user-2",
        content: "Additional verification needed for financial statements.",
        timestamp: "2024-01-16T14:20:00Z"
      }
    ])

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

  const handleConfirm = async () => {
    if (!finalGrade) {
      toast({
        title: "Error",
        description: "Please select a final grade",
        variant: "destructive"
      })
      return
    }

    setIsConfirming(true)
    try {
      await onConfirm(review.id, finalGrade, adminNotes)
      toast({
        title: "Success",
        description: "Review confirmed successfully"
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to confirm review",
        variant: "destructive"
      })
    } finally {
      setIsConfirming(false)
    }
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

  const _handleAddComment = (_content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      reviewId: review.id,
      author: "Current User",
      authorId: "current-user",
      content: _content,
      timestamp: new Date().toISOString()
    }
    _setComments(prev => [...prev, newComment])
  }

  const header = (
    <div className="bg-white border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
            ←
          </Button>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Final Review</h2>
            <p className="text-xs text-muted-foreground">ID: {review.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(review.status)}>
            {review.status}
          </Badge>
          <Badge className={getGradeColor(review.currentGrade)}>
            {review.currentGrade}
          </Badge>
        </div>
      </div>
    </div>
  )

  // If assign form is shown, render the assign form

  return (
    <ScrollablePanel
      header={header}
      contentClassName="p-3"
    >
      <div className="space-y-4">
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

        {/* Review Documents */}
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
          maxHeight="400px"
          showUpload={true}
          showDownload={true}
          showRemove={true}
          title="Review Documents"
        />

        {/* Final Review Actions - Optimized Layout */}
        <div className="bg-muted/50 rounded-lg p-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-muted">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                <Star className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900">Final Review & Grading</h3>
            </div>
            {review.currentGrade && (
              <Badge variant="outline" className={`${getGradeColor(review.currentGrade)} text-xs`}>
                Previous: {review.currentGrade}/5
              </Badge>
            )}
          </div>

            <div className="space-y-4">
              {/* Compact Grade Selection */}
              <GradeSelect
                value={finalGrade}
                onValueChange={setFinalGrade}
                label="Final Grade"
                placeholder="Select grade"
                required={true}
              />

              {/* Compact Admin Notes */}
              <div className="space-y-2">
                <Label htmlFor="adminNotes" className="text-xs font-medium text-muted-foreground">
                  Admin Notes (Optional)
                </Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Add notes or comments..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                  className="text-sm resize-none bg-white border-input"
                />
              </div>

              <div className="border-t border-muted pt-3 mt-3" />

              {/* Compact Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleConfirm}
                  disabled={isConfirming || !finalGrade}
                  className="flex-1 h-9 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-sm font-medium shadow-sm"
                >
                  {isConfirming ? (
                    <>
                      <Clock className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                      Confirm Review
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(!showRejectForm)}
                  className="flex-1 h-9 text-sm font-medium border-input hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                >
                  <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
                  Reject
                </Button>
              </div>

              {/* Compact Rejection Form */}
              {showRejectForm && (
                <div ref={rejectFormRef} className="space-y-3 p-3 bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/60 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <div className="p-1 bg-red-500 rounded">
                      <AlertCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium text-sm">Reject Review</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rejectionReason" className="text-xs font-medium text-red-800">
                      Reason for Rejection *
                    </Label>
                    <Textarea
                      id="rejectionReason"
                      placeholder="Provide reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={2}
                      className="border-red-300 focus:border-red-500 text-sm resize-none bg-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleReject}
                      disabled={isRejecting || !rejectionReason.trim()}
                      variant="destructive"
                      size="sm"
                      className="h-8 text-xs font-medium"
                    >
                      {isRejecting ? (
                        <>
                          <Clock className="h-3 w-3 mr-1 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          Confirm Rejection
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
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
          </div>
        </div>
    </ScrollablePanel>
  )
}
