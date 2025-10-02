"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { DualSidebarLayout } from "@/components/shared/dual-sidebar-layout"
import { EmptyState } from "@/components/shared/empty-state"
import { ReviewView } from "@/components/reviews/review-view"
import { FinalReviewScreen } from "@/components/reviews/final-review-screen"
import { Star } from "lucide-react"

import { mockReviews } from "@/lib/mock-data"
import { type Review } from "@/lib/schemas/review.schema"
import { useFinalReview } from "@/hooks/use-final-review"

export default function FinalReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const { confirmFinalReview, rejectReview } = useFinalReview()

  // Load reviews
  useEffect(() => {
    // Filter reviews that are ready for final review (completed by reviewer)
    const readyForFinalReview = mockReviews.filter(review => 
      review.status === 'Completed'
    )
    setReviews(readyForFinalReview)
  }, [])

  // Memoized filtered reviews based on all filter criteria
  const filteredReviews = useMemo(() => {
    let filtered = reviews

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (review) =>
          review.memberFirm.toLowerCase().includes(searchLower) ||
          review.reviewer.toLowerCase().includes(searchLower) ||
          review.type.toLowerCase().includes(searchLower) ||
          review.country.toLowerCase().includes(searchLower)
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((review) => review.status === statusFilter)
    }

    // Grade filter
    if (gradeFilter !== "all") {
      filtered = filtered.filter((review) => review.currentGrade === gradeFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((review) => review.priority === priorityFilter)
    }

    // Country filter
    if (countryFilter !== "all") {
      filtered = filtered.filter((review) => review.country === countryFilter)
    }

    return filtered
  }, [reviews, searchTerm, statusFilter, gradeFilter, priorityFilter, countryFilter])

  // Clear selection if filtered reviews change and selected review is no longer in the list
  useEffect(() => {
    if (filteredReviews.length === 0) {
      setSelectedReview(null)
    } else if (selectedReview && !filteredReviews.find(r => r.id === selectedReview.id)) {
      setSelectedReview(null)
    }
  }, [filteredReviews, selectedReview])

  // Memoized unique filter values
  const uniqueCountries = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.country))).sort(),
    [reviews]
  )
  
  const uniqueStatuses = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.status))).sort(),
    [reviews]
  )
  
  const uniqueGrades = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.currentGrade))).sort(),
    [reviews]
  )
  
  const uniquePriorities = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.priority))).sort(),
    [reviews]
  )

  const hasActiveFilters = useMemo(() => 
    Boolean(searchTerm || statusFilter !== "all" || gradeFilter !== "all" || priorityFilter !== "all" || countryFilter !== "all"),
    [searchTerm, statusFilter, gradeFilter, priorityFilter, countryFilter]
  )

  // Event handlers
  const handleViewReview = useCallback((review: Review) => {
    setSelectedReview(prev => prev?.id === review.id ? null : review)
  }, [])

  const handleConfirmFinalReview = useCallback(async (
    reviewId: string, 
    finalGrade: string, 
    adminNotes: string
  ) => {
    try {
      const updatedReview = await confirmFinalReview(reviewId, finalGrade, adminNotes)
      setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
      setSelectedReview(null)
    } catch {
      // Error handling is done in the hook
    }
  }, [confirmFinalReview])

  const handleRejectReview = useCallback(async (
    reviewId: string, 
    rejectionReason: string
  ) => {
    try {
      const updatedReview = await rejectReview(reviewId, rejectionReason)
      setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
      setSelectedReview(null)
    } catch {
      // Error handling is done in the hook
    }
  }, [rejectReview])

  const handleBack = useCallback(() => {
    setSelectedReview(null)
  }, [])

  const handleExportReviews = useCallback(() => {
    // Export reviews logic
    console.log("Export reviews")
  }, [])

  const handleFilter = useCallback(() => {
    // Filter logic is now handled by the filteredReviews useMemo
    // This function is kept for compatibility with FilterSection component
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setStatusFilter("all")
    setGradeFilter("all")
    setPriorityFilter("all")
    setCountryFilter("all")
  }, [])



  // Empty state configuration
  const emptyStateConfig = {
    icon: Star,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-100",
    title: "Final Review Process",
    description: "Select a completed review from the list to:",
    steps: [
      {
        number: "1",
        title: "Review Details",
        description: "Examine attachments, comments, and reviewer notes"
      },
      {
        number: "2", 
        title: "Assign Final Grade",
        description: "Set the official grade (A+ to F)"
      },
      {
        number: "3",
        title: "Confirm or Reject", 
        description: "Approve the review or send back for revision"
      }
    ],
    badge: {
      text: `${reviews.length} reviews ready for final review`,
      variant: "outline" as const
    }
  }

  // Statistics for right sidebar
  const sidebarStats = useMemo(() => ({
    total: reviews.length,
    completed: reviews.filter(r => r.status === 'Completed').length,
    inProgress: reviews.filter(r => r.status === 'In Progress').length,
    pending: reviews.filter(r => r.status === 'Pending').length,
    overdue: reviews.filter(r => r.status === 'Overdue').length
  }), [reviews])

  return (
    <DualSidebarLayout
      title=""
      description=""
      rightSidebarProps={{
        stats: sidebarStats,
        onExport: handleExportReviews,
        onImport: () => console.log("Import final reviews"),
        onSettings: () => console.log("Final review settings"),
        filters: {
          searchTerm,
          statusFilter,
          gradeFilter,
          priorityFilter,
          countryFilter,
          onSearchChange: setSearchTerm,
          onStatusChange: setStatusFilter,
          onGradeChange: setGradeFilter,
          onPriorityChange: setPriorityFilter,
          onCountryChange: setCountryFilter,
          onFilter: handleFilter,
          onClearFilters: clearFilters,
          hasActiveFilters,
          resultsCount: filteredReviews.length,
          viewMode,
          onViewModeChange: setViewMode,
          statusOptions: uniqueStatuses,
          gradeOptions: uniqueGrades,
          priorityOptions: uniquePriorities,
          countryOptions: uniqueCountries
        }
      }}
      className="!p-0"
    >
      <div className="h-[calc(100vh-120px)] p-6">
        {/* Split View Layout */}
        <div className="grid gap-6 h-full grid-cols-1 lg:grid-cols-3">
          {/* Left Side - Review List */}
          <div className="flex flex-col h-full overflow-hidden lg:col-span-2">
            {/* Review List */}
            <div className="flex-1 overflow-y-auto">
              <ReviewView
                reviews={filteredReviews}
                viewMode={viewMode}
                selectedReview={selectedReview}
                onView={handleViewReview}
                onEdit={undefined}
                onAssign={undefined}
              />
            </div>
          </div>

          {/* Right Side - Final Review Screen or Empty State */}
          <div className="lg:col-span-1 overflow-hidden pl-2 border-l h-full">
            {selectedReview ? (
              <FinalReviewScreen
                review={selectedReview}
                onConfirm={handleConfirmFinalReview}
                onReject={handleRejectReview}
                onBack={handleBack}
              />
            ) : (
              <EmptyState {...emptyStateConfig} />
            )}
          </div>
        </div>
      </div>
    </DualSidebarLayout>
  )
}