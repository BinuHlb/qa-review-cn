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
  Flag,
  CheckCircle
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
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50/50 to-white">
      {/* Modern Header */}
      <div className="flex-shrink-0 p-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">{review.memberFirm}</h2>
                  <p className="text-sm text-slate-500 font-medium">{review.type}</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => onAssign?.(review)}
              size="sm"
              className="ml-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-md"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Assign
            </Button>
          </div>

          {/* Enhanced Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={`${getGradeColor(review.currentGrade)} shadow-sm border-0 px-3 py-1`}>
              <Award className="h-3 w-3 mr-1.5" />
              {review.currentGrade}
            </Badge>
            <Badge className={`${getStatusColor(review.status)} shadow-sm border-0 px-3 py-1`}>
              <CheckCircle className="h-3 w-3 mr-1.5" />
              {review.status}
            </Badge>
            <Badge className={`${getPriorityColor(review.priority)} shadow-sm border-0 px-3 py-1`}>
              <Flag className="h-3 w-3 mr-1.5" />
              {review.priority} Priority
            </Badge>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        {/* Enhanced Quick Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-slate-200/60 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300/40">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-1.5 font-medium">Member Firm</p>
                  <p className="font-semibold text-sm text-slate-900 truncate" title={review.memberFirm}>
                    {review.memberFirm}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 hover:border-emerald-300/40">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-1.5 font-medium">Reviewer</p>
                  <p className="font-semibold text-sm text-slate-900 truncate" title={review.reviewer}>
                    {review.reviewer}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Review Details */}
        <Card className="border-slate-200/60 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-4 bg-gradient-to-r from-slate-50/80 to-slate-100/50 rounded-t-lg">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
              Review Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                  <div className="p-1 bg-slate-100 rounded-md">
                    <MapPin className="h-3 w-3 text-slate-600" />
                  </div>
                  <span>Country</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 ml-6">{review.country}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                  <div className="p-1 bg-slate-100 rounded-md">
                    <Calendar className="h-3 w-3 text-slate-600" />
                  </div>
                  <span>Review Period</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 ml-6">
                  {dateRange.start} - {dateRange.end}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                  <div className="p-1 bg-slate-100 rounded-md">
                    <User className="h-3 w-3 text-slate-600" />
                  </div>
                  <span>Reviewer Status</span>
                </div>
                <div className="ml-6">
                  <Badge className={`${getReviewerStatusColor(review.reviewerStatus)} text-xs px-2.5 py-1 shadow-sm border-0`}>
                    {review.reviewerStatus}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                  <div className="p-1 bg-slate-100 rounded-md">
                    <Building2 className="h-3 w-3 text-slate-600" />
                  </div>
                  <span>Partner Status</span>
                </div>
                <div className="ml-6">
                  <Badge className={`${getReviewerStatusColor(review.partnerStatus)} text-xs px-2.5 py-1 shadow-sm border-0`}>
                    {review.partnerStatus}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                  <div className="p-1 bg-slate-100 rounded-md">
                    <Clock className="h-3 w-3 text-slate-600" />
                  </div>
                  <span>Last Updated</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 ml-6">
                  {new Date(review.lastUpdated).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                  <div className="p-1 bg-slate-100 rounded-md">
                    <FileText className="h-3 w-3 text-slate-600" />
                  </div>
                  <span>Review ID</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 ml-6 font-mono">{review.id}</p>
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

        {/* Enhanced File Attachments */}
        <Card className="border-slate-200/60 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50/80 to-emerald-100/50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg">
                  <Paperclip className="h-4 w-4 text-white" />
                </div>
                Attachments ({attachments.length})
              </CardTitle>
              <label htmlFor="file-upload">
                <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-0 shadow-sm" asChild>
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
          <CardContent className="space-y-4 p-5">
            {/* Enhanced Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                isDragging 
                  ? 'border-emerald-400 bg-emerald-50/80 scale-[1.02]' 
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-300'
              }`}
            >
              <div className={`p-3 rounded-full mx-auto mb-3 w-fit transition-colors ${
                isDragging ? 'bg-emerald-500' : 'bg-slate-200'
              }`}>
                <Paperclip className={`h-5 w-5 ${isDragging ? 'text-white' : 'text-slate-600'}`} />
              </div>
              <p className="text-sm font-medium text-slate-700 mb-1">
                {isDragging ? 'Drop files here' : 'Drag and drop files here'}
              </p>
              <p className="text-xs text-slate-500">
                or click Upload button to browse
              </p>
            </div>

            {/* Enhanced Attachments List */}
            {attachments.length > 0 && (
              <div className="space-y-3">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/80 to-white rounded-xl border border-slate-200/60 hover:shadow-md hover:border-slate-300/60 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 p-2 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg">
                        <span className="text-lg">{getFileIcon(attachment.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate mb-1" title={attachment.name}>
                          {attachment.name}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="font-medium">{attachment.size}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>{attachment.uploadedBy}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>{new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-300 hover:bg-blue-50 hover:border-blue-300">
                        <Download className="h-3.5 w-3.5 text-slate-600" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                      >
                        <X className="h-3.5 w-3.5" />
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

