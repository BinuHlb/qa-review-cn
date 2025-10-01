"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  Building2, 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  Upload,
  X,
  Send,
  Paperclip,
  Download,
  UserPlus,
  Clock,
  Award,
  Flag
} from "lucide-react"
import { type Review } from "@/lib/mock-data"
import { 
  getGradeColor, 
  getStatusColor, 
  getPriorityColor, 
  getReviewerStatusColor,
  generateInitials,
  generateAvatarColor,
  formatDateRange,
  getFileIcon
} from "@/lib/utils/review-utils"

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  avatar?: string
}

interface Attachment {
  id: string
  name: string
  size: string
  uploadedBy: string
  uploadedAt: string
  type: string
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
  const [isDragging, setIsDragging] = useState(false)

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const newAttachment: Attachment = {
          id: String(attachments.length + 1),
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          uploadedBy: "Current User",
          uploadedAt: new Date().toISOString().split('T')[0],
          type: file.type
        }
        setAttachments(prev => [...prev, newAttachment])
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files) {
      Array.from(files).forEach(file => {
        const newAttachment: Attachment = {
          id: String(attachments.length + 1),
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          uploadedBy: "Current User",
          uploadedAt: new Date().toISOString().split('T')[0],
          type: file.type
        }
        setAttachments(prev => [...prev, newAttachment])
      })
    }
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id))
  }


  const dateRange = formatDateRange(review.startDate, review.endDate)

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h2 className="text-2xl font-bold text-neutral-900">{review.memberFirm}</h2>
            <p className="text-sm text-neutral-500">{review.type}</p>
          </div>
          <Button
            onClick={() => onAssign?.(review)}
            size="sm"
            className="ml-4"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Assign
          </Button>
        </div>

        {/* Key Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={`${getGradeColor(review.currentGrade)}`}>
            <Award className="h-3 w-3 mr-1" />
            {review.currentGrade}
          </Badge>
          <Badge className={`${getStatusColor(review.status)}`}>
            {review.status}
          </Badge>
          <Badge className={`${getPriorityColor(review.priority)}`}>
            <Flag className="h-3 w-3 mr-1" />
            {review.priority} Priority
          </Badge>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 mb-1">Member Firm</p>
                  <p className="font-semibold text-sm text-neutral-900 truncate" title={review.memberFirm}>
                    {review.memberFirm}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 mb-1">Reviewer</p>
                  <p className="font-semibold text-sm text-neutral-900 truncate" title={review.reviewer}>
                    {review.reviewer}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Details */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Review Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <MapPin className="h-3 w-3" />
                  <span>Country</span>
                </div>
                <p className="text-sm font-medium text-neutral-900">{review.country}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Calendar className="h-3 w-3" />
                  <span>Review Period</span>
                </div>
                <p className="text-sm font-medium text-neutral-900">
                  {dateRange.start} - {dateRange.end}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <User className="h-3 w-3" />
                  <span>Reviewer Status</span>
                </div>
                <Badge variant="outline" className={`${getReviewerStatusColor(review.reviewerStatus)} text-xs`}>
                  {review.reviewerStatus}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <User className="h-3 w-3" />
                  <span>Partner Status</span>
                </div>
                <Badge variant="outline" className={`${getReviewerStatusColor(review.partnerStatus)} text-xs`}>
                  {review.partnerStatus}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Clock className="h-3 w-3" />
                  <span>Last Updated</span>
                </div>
                <p className="text-sm font-medium text-neutral-900">
                  {new Date(review.lastUpdated).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <FileText className="h-3 w-3" />
                  <span>Review ID</span>
                </div>
                <p className="text-sm font-medium text-neutral-900">{review.id}</p>
              </div>
            </div>

            {review.description && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs text-neutral-500 font-medium">Description</p>
                  <p className="text-sm text-neutral-700">{review.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* File Attachments */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Attachments jj({attachments.length})</CardTitle>
              <label htmlFor="file-upload">
                <Button size="sm" variant="outline" asChild>
                  <span className="cursor-pointer">
                    <Upload className="h-3 w-3 mr-2" />
                    Upload
                  </span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
              }`}
            >
              <Paperclip className="h-6 w-6 mx-auto text-neutral-400 mb-2" />
              <p className="text-xs text-neutral-500">
                Drag and drop files here, or click Upload button
              </p>
            </div>

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{getFileIcon(attachment.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate" title={attachment.name}>
                          {attachment.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {attachment.size} • {attachment.uploadedBy} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Comments ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Comments List */}
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={`${generateAvatarColor(comment.author)} text-white text-xs`}>
                      {generateInitials(comment.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-semibold text-neutral-900">{comment.author}</p>
                      <p className="text-xs text-neutral-400">{comment.timestamp}</p>
                    </div>
                    <p className="text-sm text-neutral-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button onClick={handleAddComment} size="sm" disabled={!newComment.trim()}>
                  <Send className="h-3 w-3 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

