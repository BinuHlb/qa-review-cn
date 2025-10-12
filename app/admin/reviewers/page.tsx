"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { ListDetailPageLayout } from "@/components/layouts"
import { useListDetailPage } from "@/hooks"
import { ReviewView } from "@/components/features/reviews/review-view"
import { ReviewActionPanel } from "@/components/features/reviews/review-action-panel"
import { Award, MapPin, CheckCircle2, Flag, UserCheck } from "lucide-react"
import { mockReviews } from "@/lib/mock-data"
import type { Review } from "@/types/entities"
import { type Attachment } from "@/components/common/documents/attachments-section"

export default function AdminReviewersPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewAttachments, setReviewAttachments] = useState<Record<string, Attachment[]>>({})

  // Load assigned reviews (reviews that have been assigned to reviewers)
  useEffect(() => {
    const assignedReviews = mockReviews.filter(review => 
      review.status !== 'Pending' && review.reviewer
    )
    setReviews(assignedReviews)
  }, [])

  // Use the unified hook for page state management
  const pageState = useListDetailPage({
    data: reviews,
    searchFields: ['memberFirm', 'reviewer', 'type', 'country'],
    getItemId: (review) => review.id,
    initialViewMode: "list"
  })

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

  // Filter configuration
  const filterConfigs = useMemo(() => [
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

  const handleFilterChange = useCallback((key: string, value: string) => {
    pageState.setFilter(key, value)
  }, [pageState])

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
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Submitting rating:', { reviewId, grade, notes })
    
    setReviews(prev => prev.map(r => 
      r.id === reviewId 
        ? { ...r, currentGrade: grade as Review['currentGrade'], status: 'Submitted' as Review['status'] }
        : r
    ))
    
    pageState.clearSelection()
  }, [pageState])

  // Empty state configuration
  const emptyStateConfig = useMemo(() => ({
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
  }), [reviews.length])

  return (
    <ListDetailPageLayout
      searchTerm={pageState.searchTerm}
      searchPlaceholder="Search reviews..."
      onSearchChange={pageState.setSearchTerm}
      filters={filterConfigs}
      filterValues={pageState.filters}
      onFilterChange={handleFilterChange}
      hasActiveFilters={pageState.hasActiveFilters}
      onClearFilters={pageState.clearFilters}
      showViewToggle={true}
      viewMode={pageState.viewMode}
      onViewModeChange={pageState.setViewMode}
      resultCount={pageState.filteredCount}
      totalCount={pageState.totalCount}
      listContent={
        <ReviewView
          reviews={pageState.filteredData}
          viewMode={pageState.viewMode}
          selectedReview={pageState.selectedItem}
          onView={pageState.toggleSelection}
          onEdit={undefined}
          onAssign={undefined}
        />
      }
      detailContent={
        pageState.selectedItem ? (
          <ReviewActionPanel
            key={pageState.selectedItem.id}
            review={pageState.selectedItem}
            initialAttachments={reviewAttachments[pageState.selectedItem.id] || []}
            onAttachmentUpload={(files) => handleAttachmentUpload(pageState.selectedItem!.id, files)}
            onAttachmentRemove={(attachmentId) => handleAttachmentRemove(pageState.selectedItem!.id, attachmentId)}
            onAttachmentDownload={handleAttachmentDownload}
            showSubmitRating={true}
            onSubmitRating={handleSubmitRating}
          />
        ) : null
      }
      emptyStateConfig={emptyStateConfig}
      detailScrollable={false}
    />
  )
}
