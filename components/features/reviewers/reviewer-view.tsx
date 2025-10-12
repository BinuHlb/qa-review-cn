"use client"

import { ReviewerItem } from "./reviewer-item"
import { DataViewContainer } from "@/components/common/data-display/data-view-container"
import type { Reviewer } from "@/lib/reviewers-mock-data"

interface ReviewerViewProps {
  reviewers: Reviewer[]
  viewMode: "list" | "card"
  selectedReviewer?: Reviewer | null
  onView?: (reviewer: Reviewer) => void
  onEdit?: (reviewer: Reviewer) => void
  onAssign?: (reviewer: Reviewer) => void
  onDelete?: (reviewer: Reviewer) => void
}

export function ReviewerView({ 
  reviewers, 
  viewMode, 
  selectedReviewer, 
  onView, 
  onEdit, 
  onAssign,
  onDelete 
}: ReviewerViewProps) {
  return (
    <DataViewContainer 
      viewMode={viewMode}
      listSpacing="space-y-1"
    >
      {reviewers.map((reviewer) => (
        <ReviewerItem
          key={reviewer.id}
          reviewer={reviewer}
          viewMode={viewMode}
          isSelected={selectedReviewer?.id === reviewer.id}
          onView={onView}
          onEdit={onEdit}
          onAssign={onAssign}
          onDelete={onDelete}
        />
      ))}
    </DataViewContainer>
  )
}

