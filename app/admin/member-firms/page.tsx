"use client"

import { useState, useMemo, useCallback } from "react"
import { ListDetailPageLayout } from "@/components/layouts"
import { useListDetailPage } from "@/hooks"
import { MemberFirmView } from "@/components/features/member-firms/member-firm-view"
import { MemberFirmActionPanel } from "@/components/features/member-firms/member-firm-action-panel"
import { useToast } from "@/hooks/use-toast"
import { mockMemberFirms, type MemberFirm } from "@/lib/member-firms-mock-data"
import { Building2, MapPin, Target, AlertTriangle, FileText } from "lucide-react"

export default function AdminMemberFirmsPage() {
  const [memberFirms] = useState<MemberFirm[]>(mockMemberFirms)
  const { toast } = useToast()

  // Use the unified hook for page state management
  const pageState = useListDetailPage<MemberFirm>({
    data: memberFirms,
    searchFields: ['name', 'location', 'country'],
    getItemId: (firm) => firm.id,
    initialViewMode: "list"
  })

  // Get unique values for filters
  const uniqueStatuses = useMemo(() => 
    Array.from(new Set(memberFirms.map((firm) => firm.status))).sort(),
    [memberFirms]
  )
  const uniqueTypes = useMemo(() => 
    Array.from(new Set(memberFirms.map((firm) => firm.type))).sort(),
    [memberFirms]
  )
  const uniqueRegions = useMemo(() => 
    Array.from(new Set(memberFirms.map((firm) => firm.region))).sort(),
    [memberFirms]
  )
  const uniqueRiskLevels = useMemo(() => 
    Array.from(new Set(memberFirms.map((firm) => firm.riskLevel))).sort(),
    [memberFirms]
  )

  // Filter configuration
  const filterConfigs = useMemo(() => [
    {
      key: "status",
      placeholder: "Status",
      icon: Target,
      options: [
        { value: "all", label: "All Statuses" },
        ...uniqueStatuses.map(status => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) }))
      ]
    },
    {
      key: "type",
      placeholder: "Type",
      icon: Building2,
      options: [
        { value: "all", label: "All Types" },
        ...uniqueTypes.map(type => ({ 
          value: type, 
          label: type === 'current_member' ? 'Current Member' : 'Prospect' 
        }))
      ]
    },
    {
      key: "region",
      placeholder: "Region",
      icon: MapPin,
      options: [
        { value: "all", label: "All Regions" },
        ...uniqueRegions.map(region => ({ value: region, label: region }))
      ]
    },
    {
      key: "riskLevel",
      placeholder: "Risk Level",
      icon: AlertTriangle,
      options: [
        { value: "all", label: "All Risk Levels" },
        ...uniqueRiskLevels.map(level => ({ value: level, label: level.charAt(0).toUpperCase() + level.slice(1) }))
      ]
    }
  ], [uniqueStatuses, uniqueTypes, uniqueRegions, uniqueRiskLevels])

  const handleFilterChange = useCallback((key: string, value: string) => {
    pageState.setFilter(key, value)
  }, [pageState])

  const handleViewMemberFirm = useCallback((memberFirm: MemberFirm) => {
    console.log("View member firm:", memberFirm)
  }, [])

  const handleEditMemberFirm = useCallback((memberFirm: MemberFirm) => {
    console.log("Edit member firm:", memberFirm)
  }, [])

  const handleDeleteMemberFirm = useCallback((memberFirm: MemberFirm) => {
    console.log("Delete member firm:", memberFirm)
  }, [])

  const handleReviewMemberFirm = useCallback((memberFirm: MemberFirm) => {
    pageState.selectItem(memberFirm)
  }, [pageState])

  const handleAcceptReview = useCallback(async (firmId: string, notes: string) => {
    console.log("Accept review for firm:", firmId, "Notes:", notes)
    toast({
      title: "Review Accepted",
      description: `Successfully accepted the review for ${pageState.selectedItem?.name}`,
    })
  }, [pageState.selectedItem, toast])

  const handleRejectReview = useCallback(async (firmId: string, notes: string) => {
    console.log("Reject review for firm:", firmId, "Notes:", notes)
    toast({
      title: "Review Rejected",
      description: `Review rejected for ${pageState.selectedItem?.name}`,
      variant: "destructive"
    })
  }, [pageState.selectedItem, toast])

  // Empty state configuration
  const emptyStateConfig = useMemo(() => ({
    icon: FileText,
    iconColor: "text-primary",
    iconBgColor: "bg-primary/10",
    title: "No Firm Selected",
    description: "Select a member firm from the list to review details and take action",
    badge: {
      text: `${memberFirms.length} member firms`,
      variant: "outline" as const
    }
  }), [memberFirms.length])

  return (
    <ListDetailPageLayout
      searchTerm={pageState.searchTerm}
      searchPlaceholder="Search member firms..."
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
        <MemberFirmView
          memberFirms={pageState.filteredData}
          viewMode={pageState.viewMode}
          selectedFirm={pageState.selectedItem}
          onView={handleViewMemberFirm}
          onEdit={handleEditMemberFirm}
          onDelete={handleDeleteMemberFirm}
          onReview={handleReviewMemberFirm}
        />
      }
      detailContent={
        pageState.selectedItem ? (
          <MemberFirmActionPanel
            memberFirm={pageState.selectedItem}
            onAccept={handleAcceptReview}
            onReject={handleRejectReview}
          />
        ) : null
      }
      emptyStateConfig={emptyStateConfig}
      detailScrollable={false}
    />
  )
}
