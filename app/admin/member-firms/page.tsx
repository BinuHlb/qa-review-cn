"use client"

import { useState, useMemo, useCallback } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { ListDetailLayout } from "@/components/layouts/list-detail-layout"
import { MemberFirmView } from "@/components/features/member-firms/member-firm-view"
import { MemberFirmActionPanel } from "@/components/features/member-firms/member-firm-action-panel"
import { useToast } from "@/hooks/use-toast"
import { 
  mockMemberFirms, 
  type MemberFirm
} from "@/lib/member-firms-mock-data"
import { Building2, MapPin, Target, AlertTriangle, FileText } from "lucide-react"
import { DataFilterBar } from "@/components/common/data-display/data-filter-bar"
import { EmptyState } from "@/components/common/empty-state"

export default function AdminMemberFirmsPage() {
  const [memberFirms] = useState<MemberFirm[]>(mockMemberFirms)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [selectedFirm, setSelectedFirm] = useState<MemberFirm | null>(null)
  const { toast } = useToast()

  // Memoized filtered member firms
  const filteredMemberFirms = useMemo(() => {
    let filtered = memberFirms

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (firm) =>
          firm.name.toLowerCase().includes(searchLower) ||
          firm.location.toLowerCase().includes(searchLower) ||
          firm.country.toLowerCase().includes(searchLower) ||
          firm.specializations.some(spec => 
            spec.toLowerCase().includes(searchLower)
          )
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((firm) => firm.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((firm) => firm.type === typeFilter)
    }

    // Region filter
    if (regionFilter !== "all") {
      filtered = filtered.filter((firm) => firm.region === regionFilter)
    }

    // Risk level filter
    if (riskLevelFilter !== "all") {
      filtered = filtered.filter((firm) => firm.riskLevel === riskLevelFilter)
    }

    return filtered
  }, [memberFirms, searchTerm, statusFilter, typeFilter, regionFilter, riskLevelFilter])

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

  const hasActiveFilters = useMemo(() => 
    Boolean(searchTerm || statusFilter !== "all" || typeFilter !== "all" || regionFilter !== "all" || riskLevelFilter !== "all"),
    [searchTerm, statusFilter, typeFilter, regionFilter, riskLevelFilter]
  )

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setStatusFilter("all")
    setTypeFilter("all")
    setRegionFilter("all")
    setRiskLevelFilter("all")
  }, [])

  // Filter configuration for DataFilterBar
  const filters = useMemo(() => [
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

  const filterValues = useMemo(() => ({
    status: statusFilter,
    type: typeFilter,
    region: regionFilter,
    riskLevel: riskLevelFilter
  }), [statusFilter, typeFilter, regionFilter, riskLevelFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    switch (key) {
      case "status": setStatusFilter(value); break
      case "type": setTypeFilter(value); break
      case "region": setRegionFilter(value); break
      case "riskLevel": setRiskLevelFilter(value); break
    }
  }, [])

  const handleViewMemberFirm = (memberFirm: MemberFirm) => {
    console.log("View member firm:", memberFirm)
    // TODO: Implement view member firm functionality
  }

  const handleEditMemberFirm = (memberFirm: MemberFirm) => {
    console.log("Edit member firm:", memberFirm)
    // TODO: Implement edit member firm functionality
  }

  const handleDeleteMemberFirm = (memberFirm: MemberFirm) => {
    console.log("Delete member firm:", memberFirm)
    // TODO: Implement delete member firm functionality
  }

  const handleReviewMemberFirm = (memberFirm: MemberFirm) => {
    setSelectedFirm(memberFirm)
  }

  const handleAcceptReview = async (firmId: string, notes: string) => {
    console.log("Accept review for firm:", firmId, "Notes:", notes)
    // TODO: Implement accept review API call
    toast({
      title: "Review Accepted",
      description: `Successfully accepted the review for ${selectedFirm?.name}`,
    })
  }

  const handleRejectReview = async (firmId: string, notes: string) => {
    console.log("Reject review for firm:", firmId, "Notes:", notes)
    // TODO: Implement reject review API call
    toast({
      title: "Review Rejected",
      description: `Review rejected for ${selectedFirm?.name}`,
      variant: "destructive"
    })
  }

  return (
    <DashboardLayout 
      noPadding
      search={{
        searchTerm,
        searchPlaceholder: "Search member firms...",
        onSearchChange: setSearchTerm
      }}
    >
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
                resultCount={filteredMemberFirms.length}
                totalCount={memberFirms.length}
              />
            </div>

            {/* Member Firms List */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <MemberFirmView
                memberFirms={filteredMemberFirms}
                viewMode={viewMode}
                selectedFirm={selectedFirm}
                onView={handleViewMemberFirm}
                onEdit={handleEditMemberFirm}
                onDelete={handleDeleteMemberFirm}
                onReview={handleReviewMemberFirm}
              />
            </div>
          </>
        }
        detailContent={
          selectedFirm ? (
            <MemberFirmActionPanel
              memberFirm={selectedFirm}
              onAccept={handleAcceptReview}
              onReject={handleRejectReview}
            />
          ) : (
            <EmptyState
              icon={FileText}
              title="No Firm Selected"
              description="Select a member firm from the list to review details and take action"
            />
          )
        }
        detailScrollable={false}
      />
    </DashboardLayout>
  )
}