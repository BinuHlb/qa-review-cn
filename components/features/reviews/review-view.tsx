"use client"

import { ReviewItem } from "./review-item"
import { DataViewContainer } from "@/components/common/data-display/data-view-container"
import type { Review } from "@/types/entities"

interface ReviewViewProps {
  reviews: Review[]
  viewMode: "list" | "card"
  selectedReview?: Review | null
  onView?: (review: Review) => void
  onEdit?: (review: Review) => void
  onAssign?: (review: Review) => void
  onViewModeChange?: (mode: "list" | "card") => void
  onSelectReview?: (review: Review | null) => void
}

export function ReviewView({ reviews, viewMode, selectedReview, onView, onEdit, onAssign, onViewModeChange, onSelectReview }: ReviewViewProps) {
  return (
    <DataViewContainer 
      viewMode={viewMode}
      listSpacing="space-y-1"
    >
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          viewMode={viewMode}
          isSelected={selectedReview?.id === review.id}
          onView={onView}
          onEdit={onEdit}
          onAssign={onAssign}
        />
      ))}
    </DataViewContainer>
  )
}
