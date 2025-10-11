"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { 
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ListDetailLayout } from "@/components/shared/list-detail-layout"
import { EmptyState } from "@/components/shared/empty-state"
import { ReviewView } from "@/components/reviews/review-view"
import { ReviewActionPanel } from "@/components/reviews/review-action-panel"
import { Award, MapPin, CheckCircle2, Flag, UserCheck } from "lucide-react"
import { DataFilterBar } from "@/components/shared/data-filter-bar"

import { mockReviews } from "@/lib/mock-data"
import type { Review } from "@/types/entities"
import { type Attachment } from "@/components/shared/attachments-section"

export default function AdminReviewersPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [reviewAttachments, setReviewAttachments] = useState<Record<string, Attachment[]>>({})

  // Load assigned reviews (reviews that have been assigned to reviewers)
  useEffect(() => {
    // Filter reviews that are assigned (have a reviewer and not pending)
    const assignedReviews = mockReviews.filter(review => 
      review.status !== 'Pending' && review.reviewer
    )
    setReviews(assignedReviews)
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

  // Handlers
  const handleViewReview = useCallback((review: Review) => {
    setSelectedReview(prev => prev?.id === review.id ? null : review)
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

  // Attachment handlers
  const handleAttachmentUpload = useCallback(async (reviewId: string, files: File[]): Promise<Attachment[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newAttachments: Attachment[] = files.map((file, index) => ({
      id: `attachment-${reviewId}-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy: "Current User",
      uploadedAt: new Date().toISOString(),
      type: file.type
    }))
    
    setReviewAttachments(prev => ({
      ...prev,
      [reviewId]: [...(prev[reviewId] || []), ...newAttachments]
    }))
    
    return newAttachments
  }, [])

  const handleAttachmentRemove = useCallback(async (reviewId: string, attachmentId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setReviewAttachments(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || []).filter(att => att.id !== attachmentId)
    }))
  }, [])

  const handleAttachmentDownload = useCallback(async (attachment: Attachment): Promise<void> => {
    console.log('Downloading attachment:', attachment.name)
  }, [])

  const handleSubmitRating = useCallback(async (reviewId: string, grade: string, notes: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Submitting rating:', { reviewId, grade, notes })
    
    // Update the review with new grade
    setReviews(prev => prev.map(r => 
      r.id === reviewId 
        ? { ...r, currentGrade: grade as Review['currentGrade'], status: 'Submitted' as Review['status'] }
        : r
    ))
    
    // Close the detail panel
    setSelectedReview(null)
  }, [])

  // Empty state configuration
  const emptyStateConfig = {
    icon: UserCheck,
    iconColor: "text-primary",
    iconBgColor: "bg-primary/10",
    title: "Assigned QA Reviews",
    description: "Select a review from the list to:",
    steps: [
      {
        number: "1",
        title: "View Details",
        description: "Examine review information, documents, and reviewer notes"
      },
      {
        number: "2", 
        title: "Track Progress",
        description: "Monitor the status and progress of assigned reviews"
      },
      {
        number: "3",
        title: "Review Documents", 
        description: "Access and review all uploaded documents and files"
      }
    ],
    badge: {
      text: `${reviews.length} assigned reviews`,
      variant: "outline" as const
    }
  }

  // Statistics for right sidebar
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <ListDetailLayout
          listContent={
            <>
              {/* Header with Filters */}
              <div className="flex-shrink-0 mb-6">
                <DataFilterBar
                  searchTerm={searchTerm}
                  searchPlaceholder="Search reviews..."
                  onSearchChange={setSearchTerm}
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
              <ReviewActionPanel
                key={selectedReview.id}
                review={selectedReview}
                initialAttachments={reviewAttachments[selectedReview.id] || []}
                onAttachmentUpload={(files) => handleAttachmentUpload(selectedReview.id, files)}
                onAttachmentRemove={(attachmentId) => handleAttachmentRemove(selectedReview.id, attachmentId)}
                onAttachmentDownload={handleAttachmentDownload}
                showSubmitRating={true}
                onSubmitRating={handleSubmitRating}
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