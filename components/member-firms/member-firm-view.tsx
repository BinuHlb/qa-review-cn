"use client"

import { MemberFirmItem } from "./member-firm-item"
import { DataViewContainer } from "@/components/shared/data-view-container"
import type { MemberFirm } from "@/lib/member-firms-mock-data"

interface MemberFirmViewProps {
  memberFirms: MemberFirm[]
  viewMode: "list" | "card"
  selectedFirm?: MemberFirm | null
  onView?: (memberFirm: MemberFirm) => void
  onEdit?: (memberFirm: MemberFirm) => void
  onDelete?: (memberFirm: MemberFirm) => void
  onReview?: (memberFirm: MemberFirm) => void
}

export function MemberFirmView({ 
  memberFirms, 
  viewMode, 
  selectedFirm, 
  onView, 
  onEdit, 
  onDelete,
  onReview 
}: MemberFirmViewProps) {
  return (
    <DataViewContainer 
      viewMode={viewMode}
      listSpacing="space-y-1"
      cardGridCols={{
        sm: "grid-cols-1",
        md: "md:grid-cols-2",
        lg: "lg:grid-cols-2",
        xl: "xl:grid-cols-3"
      }}
    >
      {memberFirms.map((firm) => (
        <MemberFirmItem
          key={firm.id}
          memberFirm={firm}
          viewMode={viewMode}
          isSelected={selectedFirm?.id === firm.id}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onReview={onReview}
        />
      ))}
    </DataViewContainer>
  )
}

