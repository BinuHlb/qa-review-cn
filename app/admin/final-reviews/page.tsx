"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ListDetailLayout } from "@/components/layouts/list-detail-layout"
import { EmptyState } from "@/components/common/empty-state"
import { ReviewView } from "@/components/features/reviews/review-view"
import { FinalReviewScreen } from "@/components/features/reviews/final-review-screen"
import { Star, Award, MapPin, CheckCircle2, Flag } from "lucide-react"
import { DataFilterBar } from "@/components/common/data-display/data-filter-bar"

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
      review.status === 'Submitted'
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


  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setStatusFilter("all")
    setGradeFilter("all")
    setPriorityFilter("all")
    setCountryFilter("all")
  }, [])

  // Filter configuration for DataFilterBar
  const filters = useMemo(() => [
    {
      key: "status",
      placeholder: "Status",
      icon: CheckCircle2,
      options: [
        { value: "all", label: "All Status" },
        ...uniqueStatuses.map(status => ({ value: status, label: status }))
      ]
    },
    {
      key: "grade",
      placeholder: "Grade",
      icon: Award,
      options: [
        { value: "all", label: "All Grades" },
        ...uniqueGrades.map(grade => ({ value: grade, label: `Grade ${grade}` }))
      ]
    },
    {
      key: "priority",
      placeholder: "Priority",
      icon: Flag,
      options: [
        { value: "all", label: "All Priority" },
        ...uniquePriorities.map(priority => ({ value: priority, label: priority }))
      ]
    },
    {
      key: "country",
      placeholder: "Country",
      icon: MapPin,
      options: [
        { value: "all", label: "All Countries" },
        ...uniqueCountries.map(country => ({ value: country, label: country }))
      ]
    }
  ], [uniqueStatuses, uniqueGrades, uniquePriorities, uniqueCountries])

  const filterValues = useMemo(() => ({
    status: statusFilter,
    grade: gradeFilter,
    priority: priorityFilter,
    country: countryFilter
  }), [statusFilter, gradeFilter, priorityFilter, countryFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    switch (key) {
      case "status": setStatusFilter(value); break
      case "grade": setGradeFilter(value); break
      case "priority": setPriorityFilter(value); break
      case "country": setCountryFilter(value); break
    }
  }, [])



  // Empty state configuration
  const emptyStateConfig = {
    icon: Star,
    iconColor: "text-primary",
    iconBgColor: "bg-primary/10",
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
        description: "Set the official grade (1 to 5, where 1 is excellent and 5 is poor)"
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
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader 
          search={{
            searchTerm,
            searchPlaceholder: "Search reviews...",
            onSearchChange: setSearchTerm
          }}
        />
        <ListDetailLayout
          listContent={
            <>
              {/* Header with Filters */}
              <div className="flex-shrink-0 mb-6">
                <DataFilterBar
                  showSearch={false}
                  filters={filters}
                  filterValues={filterValues}
                  onFilterChange={handleFilterChange}
                  showViewToggle={true}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  hasActiveFilters={hasActiveFilters}
                  onClearFilters={clearFilters}
                  resultCount={filteredReviews.length}
                  totalCount={reviews.length}
                />
              </div>

              {/* Review List */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <ReviewView
                  reviews={filteredReviews}
                  viewMode={viewMode}
                  selectedReview={selectedReview}
                  onView={handleViewReview}
                  onEdit={undefined}
                  onAssign={undefined}
                />
              </div>
            </>
          }
          detailContent={
            selectedReview ? (
              <FinalReviewScreen
                review={selectedReview}
                onConfirm={handleConfirmFinalReview}
                onReject={handleRejectReview}
                onBack={handleBack}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <EmptyState {...emptyStateConfig} />
              </div>
            )
          }
        />
      </SidebarInset>
    </SidebarProvider>
  )
}