/**
 * Custom hook for managing final review operations
 */

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

export function useFinalReview() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Confirm final review with grade
  const confirmFinalReview = useCallback(async (
    reviewId: string, 
    finalGrade: string, 
    adminNotes: string
  ) => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/reviews/${reviewId}/final-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          finalGrade,
          adminNotes,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to confirm final review')
      }

      const updatedReview = await response.json()
      
      toast({
        title: "Review Confirmed",
        description: `Review has been finalized with grade ${finalGrade}`,
      })

      return updatedReview
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to confirm final review'
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Reject review and send back for revision
  const rejectReview = useCallback(async (
    reviewId: string, 
    rejectionReason: string
  ) => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/reviews/${reviewId}/final-review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejectionReason,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to reject review')
      }

      const updatedReview = await response.json()
      
      toast({
        title: "Review Rejected",
        description: "Review has been rejected and sent back for revision",
      })

      return updatedReview
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reject review'
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return {
    confirmFinalReview,
    rejectReview,
    isLoading,
  }
}
