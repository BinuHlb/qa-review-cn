/**
 * Custom hook for managing reviews data
 * Provides CRUD operations with loading and error states
 */

import { useState, useEffect, useCallback } from "react"
import { ReviewsAPI } from "@/lib/api/reviews"
import { type Review, type CreateReview, type UpdateReview, type AssignReviewer } from "@/lib/schemas/review.schema"
import { useToast } from "@/hooks/use-toast"

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch all reviews
  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await ReviewsAPI.getAll()
      setReviews(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch reviews"
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Initial fetch
  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Create a new review
  const createReview = useCallback(async (data: CreateReview) => {
    try {
      const newReview = await ReviewsAPI.create(data)
      setReviews(prev => [newReview, ...prev])
      toast({
        title: "Success",
        description: "Review created successfully",
      })
      return newReview
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create review"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  // Update a review
  const updateReview = useCallback(async (id: string, data: Partial<UpdateReview>) => {
    try {
      const updatedReview = await ReviewsAPI.update(id, data)
      setReviews(prev => prev.map(review => review.id === id ? updatedReview : review))
      toast({
        title: "Success",
        description: "Review updated successfully",
      })
      return updatedReview
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update review"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  // Delete a review
  const deleteReview = useCallback(async (id: string) => {
    try {
      await ReviewsAPI.delete(id)
      setReviews(prev => prev.filter(review => review.id !== id))
      toast({
        title: "Success",
        description: "Review deleted successfully",
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete review"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  // Assign a reviewer
  const assignReviewer = useCallback(async (data: AssignReviewer) => {
    try {
      const updatedReview = await ReviewsAPI.assignReviewer(data)
      setReviews(prev => prev.map(review => review.id === data.reviewId ? updatedReview : review))
      toast({
        title: "Success",
        description: "Reviewer assigned successfully",
      })
      return updatedReview
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to assign reviewer"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  // Submit a review
  const submitReview = useCallback(async (id: string) => {
    try {
      const updatedReview = await ReviewsAPI.submit(id)
      setReviews(prev => prev.map(review => review.id === id ? updatedReview : review))
      toast({
        title: "Success",
        description: "Review submitted successfully",
      })
      return updatedReview
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit review"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  return {
    reviews,
    isLoading,
    error,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
    assignReviewer,
    submitReview,
  }
}

