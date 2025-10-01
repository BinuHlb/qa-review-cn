/**
 * Custom hook for managing comments
 */

import { useState, useEffect, useCallback } from "react"
import { CommentsAPI } from "@/lib/api/comments"
import { type Comment, type CreateComment } from "@/lib/schemas/review.schema"
import { useToast } from "@/hooks/use-toast"

export function useComments(reviewId: string | null) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch comments when reviewId changes
  useEffect(() => {
    if (!reviewId) {
      setComments([])
      return
    }

    const fetchComments = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await CommentsAPI.getByReviewId(reviewId)
        setComments(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch comments"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [reviewId])

  // Add a comment
  const addComment = useCallback(async (content: string, authorId: string, author: string) => {
    if (!reviewId) return

    try {
      const newComment = await CommentsAPI.create({
        reviewId,
        content,
        authorId,
        author,
      })
      setComments(prev => [...prev, newComment])
      toast({
        title: "Success",
        description: "Comment posted successfully",
      })
      return newComment
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to post comment"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    }
  }, [reviewId, toast])

  // Delete a comment
  const deleteComment = useCallback(async (id: string) => {
    try {
      await CommentsAPI.delete(id)
      setComments(prev => prev.filter(comment => comment.id !== id))
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete comment"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  return {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
  }
}

