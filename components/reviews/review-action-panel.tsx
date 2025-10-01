"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  Upload,
  X,
  Send,
  Paperclip,
  Download,
  CheckCircle
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { generateReviewerInitials, generateReviewerAvatarColor } from "@/lib/reviewers-mock-data"
import { type Review } from "@/lib/mock-data"

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

interface ReviewActionPanelProps {
  review: Review
  reviewers?: Array<{ id: string; name: string; role: string; status: string }>
  onSubmit?: () => void
  onAssignReviewer?: (reviewerId: string) => void
}

export function ReviewActionPanel({ review, reviewers = [], onSubmit, onAssignReviewer }: ReviewActionPanelProps) {
  const [selectedReviewer, setSelectedReviewer] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
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

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      const newAttachments = Array.from(files).map((file, index) => ({
        id: `attachment-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        uploadedBy: "Current User",
        uploadedAt: new Date().toISOString().split('T')[0],
        type: file.type
      }))
      setAttachments(prev => [...prev, ...newAttachments])
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
      const newAttachments = Array.from(files).map((file, index) => ({
        id: `attachment-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        uploadedBy: "Current User",
        uploadedAt: new Date().toISOString().split('T')[0],
        type: file.type
      }))
      setAttachments(prev => [...prev, ...newAttachments])
    }
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id))
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊'
    if (type.includes('word') || type.includes('document')) return '📝'
    if (type.includes('image')) return '🖼️'
    return '📎'
  }

  const handleReviewerChange = (reviewerId: string) => {
    setSelectedReviewer(reviewerId)
    onAssignReviewer?.(reviewerId)
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    onSubmit?.()
  }

  // If submitted, show success UI
  if (isSubmitted) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center space-y-4 px-6 max-w-md">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-neutral-900">Review Submitted Successfully!</h3>
            <p className="text-sm text-neutral-600">
              Your review for <span className="font-semibold">{review.memberFirm}</span> has been submitted.
            </p>
          </div>
          <div className="pt-4 space-y-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-left">
              <p className="font-medium text-green-900 mb-1">Review Details:</p>
              <ul className="space-y-1 text-green-700 text-xs">
                <li>• Review ID: {review.id}</li>
                <li>• Type: {review.type}</li>
                <li>• Attachments: {attachments.length} file(s)</li>
                <li>• Comments: {comments.length} comment(s)</li>
                {selectedReviewer && <li>• Assigned Reviewer: Yes</li>}
              </ul>
            </div>
            <Button 
              onClick={() => setIsSubmitted(false)} 
              variant="outline" 
              className="w-full"
            >
              Back to Review
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const generateFirmInitials = (firmName: string) => {
    return firmName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  const generateFirmAvatarColor = (firmName: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-cyan-500'
    ]
    
    let hash = 0
    for (let i = 0; i < firmName.length; i++) {
      hash = firmName.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Selected Review Header */}
      <div className="flex-shrink-0 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback className={`${generateFirmAvatarColor(review.memberFirm)} text-white text-sm font-semibold`}>
              {generateFirmInitials(review.memberFirm)}
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pt-4">
        {/* Assign Reviewer Section */}
        <Card className="shadow-none border-none p-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Assign Reviewer</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedReviewer} onValueChange={handleReviewerChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reviewer..." />
              </SelectTrigger>
              <SelectContent>
                {reviewers.length > 0 ? (
                  reviewers.map((reviewer) => (
                    <SelectItem key={reviewer.id} value={reviewer.id}>
                      {reviewer.name} ({reviewer.role})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No reviewers available</SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedReviewer && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Reviewer assigned successfully
              </p>
            )}
          </CardContent>
        </Card>

        {/* File Attachments */}
        <Card className="shadow-none border-none p-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Attachments ({attachments.length})</CardTitle>
            <label htmlFor="file-upload-action">
              <Button size="sm" variant="outline" asChild>
                <span className="cursor-pointer">
                  <Upload className="h-3 w-3 mr-2" />
                  Upload
                </span>
              </Button>
              <input
                id="file-upload-action"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
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
              Drag and drop files here
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
                        {attachment.size} • {attachment.uploadedBy}
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
      <Card className="shadow-none border-none p-0 flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-base">Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col overflow-hidden">
          {/* Comments List */}
          <div className="space-y-4 flex-1 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={`${generateReviewerAvatarColor(comment.author)} text-white text-xs`}>
                    {generateReviewerInitials(comment.author)}
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
          <div className="space-y-2 flex-shrink-0">
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

      {/* Submit Button */}
      <div className="flex-shrink-0 pt-4 border-t bg-white">
        <Button onClick={handleSubmit} className="w-full" size="lg">
          <CheckCircle className="h-4 w-4 mr-2" />
          Submit Review
        </Button>
      </div>
    </div>
  )
}

