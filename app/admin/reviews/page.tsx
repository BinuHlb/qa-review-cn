"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { DualSidebarLayout } from "@/components/shared/dual-sidebar-layout"
import { ReviewView } from "@/components/reviews/review-view"
import { ReviewActionPanel } from "@/components/reviews/review-action-panel"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockReviews, type Review } from "@/lib/mock-data"
import { mockReviewers } from "@/lib/reviewers-mock-data"

export default function AdminReviewsPage() {
  const [reviews] = useState<Review[]>(mockReviews)
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

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

  // Handlers
  const handleViewReview = useCallback((review: Review) => {
    setSelectedReview(prev => prev?.id === review.id ? null : review)
  }, [])

  const handleEditReview = useCallback((review: Review) => {
    // TODO: Implement edit review functionality
    if (process.env.NODE_ENV === 'development') {
      console.log("Edit review:", review)
    }
  }, [])

  const handleAssignReview = useCallback((review: Review) => {
    // TODO: Implement assign review functionality
    if (process.env.NODE_ENV === 'development') {
      console.log("Assign review:", review)
    }
  }, [])

  const handleAssignReviewer = useCallback((reviewerId: string) => {
    // TODO: Implement reviewer assignment to selected review
    if (process.env.NODE_ENV === 'development') {
      console.log("Assign reviewer:", reviewerId, "to review:", selectedReview?.id)
    }
  }, [selectedReview])

  const handleSubmitReview = useCallback(() => {
    // TODO: Implement submit review functionality
    if (process.env.NODE_ENV === 'development') {
      console.log("Submit review:", selectedReview)
    }
  }, [selectedReview])

  const handleCreateReview = useCallback(() => {
    // TODO: Implement create review functionality
    if (process.env.NODE_ENV === 'development') {
      console.log("Create new review")
    }
  }, [])

  const handleExportReviews = useCallback(() => {
    // TODO: Implement export functionality
    if (process.env.NODE_ENV === 'development') {
      console.log("Export reviews")
    }
  }, [])

  const handleImportReviews = useCallback(() => {
    // TODO: Implement import functionality
    if (process.env.NODE_ENV === 'development') {
      console.log("Import reviews")
    }
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

  // Memoized header actions

  // Statistics for right sidebar
  const sidebarStats = useMemo(() => {
    const total = reviews.length
    const completed = reviews.filter(r => r.status === 'Completed').length
    const inProgress = reviews.filter(r => r.status === 'In Progress').length
    const pending = reviews.filter(r => r.status === 'Pending').length
    const overdue = reviews.filter(r => r.status === 'Overdue').length

    return { total, completed, inProgress, pending, overdue }
  }, [reviews])

  return (
    <DualSidebarLayout
      title=""
      description=""
      rightSidebarProps={{
        stats: sidebarStats,
        onNewReview: handleCreateReview,
        onExport: handleExportReviews,
        onImport: handleImportReviews,
        onSettings: () => console.log("Settings clicked"),
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
          {/* Left Side - Review List with Filters */}
          <div className="flex flex-col h-full overflow-hidden lg:col-span-2">

            {/* Review List */}
            <div className="flex-1 overflow-y-auto">
              <ReviewView
                reviews={filteredReviews}
                viewMode={viewMode}
                selectedReview={selectedReview}
                onView={handleViewReview}
                onEdit={handleEditReview}
                onAssign={handleAssignReview}
              />
            </div>
          </div>

          {/* Right Side - Action Panel or Empty State */}
          <div className="lg:col-span-1 overflow-hidden pl-2 border-l h-full">
            {selectedReview ? (
              <ReviewActionPanel
                key={selectedReview.id}
                review={selectedReview}
                reviewers={mockReviewers.map(reviewer => ({
                  id: reviewer.id,
                  name: reviewer.name,
                  role: reviewer.role,
                  status: reviewer.status
                }))}
                onSubmit={handleSubmitReview}
                onAssignReviewer={handleAssignReviewer}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-3 px-6">
                  <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-neutral-400"
                    >
                      <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                      <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">No Review Selected</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Select a review from the list to view attachments, comments, and actions
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DualSidebarLayout>
  )
}
