"use client"

import { ReviewItem } from "./review-item"
import { type Review } from "@/lib/mock-data"

interface ReviewViewProps {
  reviews: Review[]
  viewMode: "list" | "card"
  onView?: (review: Review) => void
  onEdit?: (review: Review) => void
  onAssign?: (review: Review) => void
}

export function ReviewView({ reviews, viewMode, onView, onEdit, onAssign }: ReviewViewProps) {
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
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {reviews.map((review, index) => (
        <div
          key={review.id}
          className="break-inside-avoid mb-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ReviewItem
            review={review}
            viewMode="card"
            onView={onView}
            onEdit={onEdit}
            onAssign={onAssign}
          />
        </div>
      ))}
    </div>
  )
}
