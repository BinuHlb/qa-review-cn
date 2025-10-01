"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MessageSquare } from "lucide-react"
import { generateInitials, generateAvatarColor } from "@/lib/utils/review-utils"

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  avatar?: string
}

interface CommentsSectionProps {
  comments: Comment[]
  onAddComment?: (content: string) => void
  title?: string
  maxHeight?: string
  showAddComment?: boolean
  placeholder?: string
  className?: string
}

/**
 * Reusable comments section component
 * Handles comment display and adding new comments
 */
export function CommentsSection({
  comments,
  onAddComment,
  title = "Comments",
  maxHeight = "max-h-80",
  showAddComment = true,
  placeholder = "Add a comment...",
  className = ""
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment)
      setNewComment("")
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {title} ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comments List */}
        <div className={`space-y-4 ${maxHeight} overflow-y-auto`}>
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
                  <p className="text-xs text-neutral-400">{formatTimestamp(comment.timestamp)}</p>
                </div>
                <p className="text-sm text-neutral-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        {showAddComment && onAddComment && (
          <>
            <Separator />
            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder={placeholder}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddComment} 
                  size="sm" 
                  disabled={!newComment.trim()}
                >
                  <Send className="h-3 w-3 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
