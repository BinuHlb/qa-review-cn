/**
 * Redux-powered custom hook for managing reviews data
 * Replaces the original useReviews hook with Redux state management
 */

import { useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  setReviews,
  setLoading,
  setError,
  addReview,
  updateReview,
  deleteReview,
  setSelectedReview,
  setViewMode,
  setSearchTerm,
  setStatusFilter,
  setGradeFilter,
  setCountryFilter,
  clearFilters,
} from "@/lib/store/slices/reviewsSlice"
import { ReviewsAPI } from "@/lib/api/reviews"
import { type Review, type CreateReview, type UpdateReview, type AssignReviewer } from "@/lib/schemas/review.schema"
import { useToast } from "@/hooks/use-toast"

export function useReduxReviews() {
  const dispatch = useAppDispatch()
  const { 
    items: reviews, 
    filteredItems, 
    isLoading, 
    error, 
    selectedReview, 
    viewMode, 
    filters,
    stats 
  } = useAppSelector((state) => state.reviews)
  
  const { toast } = useToast()

  // Fetch all reviews
  const fetchReviews = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await ReviewsAPI.getAll()
      dispatch(setReviews(data))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch reviews"
      dispatch(setError(message))
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, toast])

  // Initial fetch
  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Create a new review
  const createReview = useCallback(async (data: CreateReview) => {
    try {
      const newReview = await ReviewsAPI.create(data)
      dispatch(addReview(newReview))
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
  }, [dispatch, toast])

  // Update a review
  const updateReviewAction = useCallback(async (id: string, data: Partial<UpdateReview>) => {
    try {
      const updatedReview = await ReviewsAPI.update(id, data)
      dispatch(updateReview({ id, updates: updatedReview }))
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
  }, [dispatch, toast])

  // Delete a review
  const deleteReviewAction = useCallback(async (id: string) => {
    try {
      await ReviewsAPI.delete(id)
      dispatch(deleteReview(id))
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
  }, [dispatch, toast])

  // Assign a reviewer
  const assignReviewerAction = useCallback(async (data: AssignReviewer) => {
    try {
      const updatedReview = await ReviewsAPI.assignReviewer(data)
      dispatch(updateReview({ id: data.reviewId, updates: updatedReview }))
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
  }, [dispatch, toast])

  // Submit a review
  const submitReviewAction = useCallback(async (id: string) => {
    try {
      const updatedReview = await ReviewsAPI.submit(id)
      dispatch(updateReview({ id, updates: updatedReview }))
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
  }, [dispatch, toast])

  // Filter actions
  const handleSearchChange = useCallback((value: string) => {
    dispatch(setSearchTerm(value))
  }, [dispatch])

  const handleStatusChange = useCallback((value: string) => {
    dispatch(setStatusFilter(value))
  }, [dispatch])

  const handleGradeChange = useCallback((value: string) => {
    dispatch(setGradeFilter(value))
  }, [dispatch])

  const handleCountryChange = useCallback((value: string) => {
    dispatch(setCountryFilter(value))
  }, [dispatch])

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  const handleViewModeChange = useCallback((mode: "list" | "card") => {
    dispatch(setViewMode(mode))
  }, [dispatch])

  // Selection actions
  const selectReview = useCallback((review: Review | null) => {
    dispatch(setSelectedReview(review))
  }, [dispatch])

  return {
    // Data
    reviews,
    filteredReviews: filteredItems,
    selectedReview,
    viewMode,
    filters,
    stats,
    isLoading,
    error,
    
    // Actions
    fetchReviews,
    createReview,
    updateReview: updateReviewAction,
    deleteReview: deleteReviewAction,
    assignReviewer: assignReviewerAction,
    submitReview: submitReviewAction,
    
    // Filter actions
    handleSearchChange,
    handleStatusChange,
    handleGradeChange,
    handleCountryChange,
    handleClearFilters,
    handleViewModeChange,
    
    // Selection actions
    selectReview,
  }
}
