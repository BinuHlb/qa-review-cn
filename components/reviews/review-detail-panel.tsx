"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  Building2, 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  Send,
  UserPlus,
  Clock
} from "lucide-react"
import type { Review } from "@/types/entities"
import { AttachmentsSection, type Attachment } from "@/components/shared/attachments-section"
import { 
  getGradeColor, 
  getStatusColor, 
  getPriorityColor, 
  getReviewerStatusColor,
  generateInitials,
  generateAvatarColor,
  formatDateRange
} from "@/lib/utils/review-utils"

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  avatar?: string
}

interface ReviewDetailPanelProps {
  review: Review | null
  onAssign?: (review: Review) => void
}

export function ReviewDetailPanel({ review, onAssign }: ReviewDetailPanelProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "John Smith",
      content: "Initial review findings look promising. Need to verify compliance documentation.",
      timestamp: "2024-01-15 10:30 AM"
    },
    {
      id: "2",
      author: "Sarah Johnson",
      content: "Follow-up meeting scheduled for next week to discuss risk assessment findings.",
      timestamp: "2024-01-16 2:45 PM"
    }
  ])
  
  const [attachments, setAttachments] = useState<Attachment[]>([
    {
      id: "1",
      name: "Financial_Report_Q4_2023.pdf",
      size: "2.4 MB",
      uploadedBy: "John Smith",
      uploadedAt: "2024-01-15",
      type: "application/pdf"
    },
    {
      id: "2",
      name: "Compliance_Checklist.xlsx",
      size: "156 KB",
      uploadedBy: "Sarah Johnson",
      uploadedAt: "2024-01-16",
      type: "application/vnd.ms-excel"
    }
  ])
  
  const [newComment, setNewComment] = useState("")

  if (!review) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        <div className="text-center space-y-2">
          <FileText className="h-16 w-16 mx-auto opacity-20" />
          <p className="text-sm">Select a review to view details</p>
        </div>
      </div>
    )
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: String(comments.length + 1),
        author: "Current User",
        content: newComment,
        timestamp: new Date().toLocaleString('en-US', { 
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  const handleFileUpload = (files: File[]) => {
    files.forEach(file => {
      const newAttachment: Attachment = {
        id: String(attachments.length + 1),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        uploadedBy: "Current User",
        uploadedAt: new Date().toISOString(),
        type: file.type
      }
      setAttachments(prev => [...prev, newAttachment])
    })
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id))
  }

  const handleDownloadAttachment = (attachment: Attachment) => {
    console.log('Download attachment:', attachment)
    // Implement actual download logic here
  }


  const dateRange = formatDateRange(review.startDate, review.endDate)

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Modern Header */}
      <div className="flex-shrink-0 p-6 pb-4 border-b dark:border-neutral-700">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarFallback className={`${generateAvatarColor(review.memberFirm)} text-sm font-semibold`}>
                    {generateInitials(review.memberFirm)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 truncate" title={review.memberFirm}>
                    {review.memberFirm}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate" title={review.type}>
                    {review.type}
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => onAssign?.(review)}
              size="sm"
              className="ml-4"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Reviewer
            </Button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={`${getStatusColor(review.status)} text-xs`}>
              {review.status}
            </Badge>
            <Badge className={`${getGradeColor(review.currentGrade)} text-xs`}>
              Grade {review.currentGrade}
            </Badge>
            <Badge className={`${getPriorityColor(review.priority)} text-xs`}>
              {review.priority} Priority
            </Badge>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium">Member Firm</p>
            </div>
            <p className="font-semibold text-sm text-foreground truncate" title={review.memberFirm}>
              {review.memberFirm}
            </p>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium">Reviewer</p>
            </div>
            <p className="font-semibold text-sm text-foreground truncate" title={review.reviewer}>
              {review.reviewer}
            </p>
          </div>
        </div>

        {/* Review Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Review Details</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Country:</span>
              <span className="font-medium">{review.country}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Period:</span>
              <span className="font-medium text-xs">{dateRange.start} - {dateRange.end}</span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Reviewer Status:</span>
              <Badge className={`${getReviewerStatusColor(review.reviewerStatus)} text-xs`}>
                {review.reviewerStatus}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Partner Status:</span>
              <Badge className={`${getReviewerStatusColor(review.partnerStatus)} text-xs`}>
                {review.partnerStatus}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Last Updated:</span>
              <span className="font-medium text-xs">
                {new Date(review.lastUpdated).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Review ID:</span>
              <span className="font-medium text-xs font-mono">{review.id}</span>
            </div>
          </div>

          {review.description && (
            <div className="pt-3 border-t dark:border-neutral-700">
              <p className="text-xs text-muted-foreground font-medium mb-1.5">Description</p>
              <p className="text-sm text-foreground">{review.description}</p>
            </div>
          )}
        </div>

        {/* File Attachments */}
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

        {/* Comments Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Comments ({comments.length})</h4>
          </div>
          <div className="space-y-3">
            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5 p-3 bg-muted/30 rounded-lg">
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarFallback className={`${generateAvatarColor(comment.author)} text-xs`}>
                      {generateInitials(comment.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <p className="text-xs font-semibold text-foreground">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                    </div>
                    <p className="text-xs text-foreground">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="space-y-2 pt-3 border-t dark:border-neutral-700">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
                className="resize-none text-sm"
              />
              <div className="flex justify-end">
                <Button onClick={handleAddComment} size="sm" disabled={!newComment.trim()}>
                  <Send className="h-3 w-3 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

