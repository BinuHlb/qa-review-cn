"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Clock, 
  Star,
  AlertCircle,
  ThumbsUp,
  ThumbsDown
} from "lucide-react"
import { type Review, type Comment, type Attachment } from "@/lib/schemas/review.schema"
import { useToast } from "@/hooks/use-toast"
import { ScrollablePanel } from "@/components/shared/scrollable-panel"
import { AttachmentsSection } from "@/components/shared/attachments-section"
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


  const handleFileUpload = (files: File[]) => {
    // Handle file upload logic here
    console.log("Files uploaded:", files)
  }

  const handleFileRemove = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
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
            <h2 className="text-lg font-bold text-gray-900">Final Review</h2>
            <p className="text-xs text-gray-600">ID: {review.id}</p>
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

  return (
    <ScrollablePanel
      header={header}
      contentClassName="p-3"
    >
        <div className="space-y-3">
          {/* Attachments */}
          <AttachmentsSection className="shadow-none border-none bg-slate-50/50 rounded-lg"
            attachments={attachments.map(att => ({
              ...att,
              size: typeof att.size === 'number' ? formatFileSize(att.size) : att.size,
              uploadedAt: new Date(att.uploadedAt).toISOString().split('T')[0]
            }))}
            onUpload={handleFileUpload}
            onRemove={handleFileRemove}
            title="Attachments"
            showUpload={false}
            maxHeight="max-h-48"
          />

          {/* Final Review Actions - Optimized Layout */}
          <div className="bg-gradient-to-br from-slate-50/80 to-white rounded-lg border border-slate-200/60 p-4">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200/60">
              <div className="p-1.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                <Star className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900">Final Review & Grading</h3>
            </div>

            <div className="space-y-4">
              {/* Compact Grade Selection */}
              <div className="space-y-2">
                <Label htmlFor="finalGrade" className="text-xs font-medium text-slate-600">
                  Final Grade *
                </Label>
                <Select value={finalGrade} onValueChange={(value) => setFinalGrade(value)}>
                  <SelectTrigger className="h-9 text-sm bg-white border-slate-300">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+ (Excellent)</SelectItem>
                    <SelectItem value="A">A (Very Good)</SelectItem>
                    <SelectItem value="A-">A- (Good)</SelectItem>
                    <SelectItem value="B+">B+ (Above Average)</SelectItem>
                    <SelectItem value="B">B (Average)</SelectItem>
                    <SelectItem value="B-">B- (Below Average)</SelectItem>
                    <SelectItem value="C+">C+ (Needs Improvement)</SelectItem>
                    <SelectItem value="C">C (Poor)</SelectItem>
                    <SelectItem value="C-">C- (Very Poor)</SelectItem>
                    <SelectItem value="D">D (Unsatisfactory)</SelectItem>
                    <SelectItem value="F">F (Failed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Compact Admin Notes */}
              <div className="space-y-2">
                <Label htmlFor="adminNotes" className="text-xs font-medium text-slate-600">
                  Admin Notes (Optional)
                </Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Add notes or comments..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                  className="text-sm resize-none bg-white border-slate-300"
                />
              </div>

              <div className="border-t border-slate-200/60 pt-3 mt-3" />

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
                  className="flex-1 h-9 text-sm font-medium border-slate-300 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                >
                  <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
                  Reject
                </Button>
              </div>

              {/* Compact Rejection Form */}
              {showRejectForm && (
                <div className="space-y-3 p-3 bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/60 rounded-lg">
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
