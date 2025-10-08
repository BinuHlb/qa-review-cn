"use client"

import { ReviewItem } from "./review-item"
import { type Review } from "@/lib/mock-data"

interface ReviewViewProps {
  reviews: Review[]
  viewMode: "list" | "card"
  selectedReview?: Review | null
  onView?: (review: Review) => void
  onEdit?: (review: Review) => void
  onAssign?: (review: Review) => void
}

export function ReviewView({ reviews, viewMode, selectedReview, onView, onEdit, onAssign }: ReviewViewProps) {
  if (viewMode === "list") {
    return (
      <div className="space-y-1 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className="animate-in fade-in-0 slide-in-from-left-2 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ReviewItem
              review={review}
              viewMode="list"
              isSelected={selectedReview?.id === review.id}
              onView={onView}
              onEdit={onEdit}
              onAssign={onAssign}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {reviews.map((review, index) => (
        <div
          key={review.id}
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ReviewItem
            review={review}
            viewMode="card"
            isSelected={selectedReview?.id === review.id}
            onView={onView}
            onEdit={onEdit}
            onAssign={onAssign}
          />
        </div>
      ))}
    </div>
  )
}
