"use client"

import { useState } from "react"
import { DualSidebarLayout } from "@/components/shared/dual-sidebar-layout"
import { UnifiedView } from "@/components/shared/unified-view"
import { MemberFirmItem } from "@/components/member-firms/member-firm-item"
import { MemberFirmReviewDialog } from "@/components/member-firms/member-firm-review-dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  mockMemberFirms, 
  type MemberFirm
} from "@/lib/member-firms-mock-data"

export default function AdminMemberFirmsPage() {
  const [memberFirms] = useState<MemberFirm[]>(mockMemberFirms)
  const [filteredMemberFirms, setFilteredMemberFirms] = useState<MemberFirm[]>(mockMemberFirms)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedFirmForReview, setSelectedFirmForReview] = useState<MemberFirm | null>(null)
  const { toast } = useToast()

  const handleFilter = () => {
    let filtered = memberFirms

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (firm) =>
          firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          firm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          firm.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          firm.specializations.some(spec => 
            spec.toLowerCase().includes(searchTerm.toLowerCase())
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

    setFilteredMemberFirms(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setTypeFilter("all")
    setRegionFilter("all")
    setRiskLevelFilter("all")
    setFilteredMemberFirms(memberFirms)
  }

  const hasActiveFilters = Boolean(searchTerm || statusFilter !== "all" || typeFilter !== "all" || regionFilter !== "all" || riskLevelFilter !== "all")

  // Get unique values for filters
  const uniqueStatuses = Array.from(new Set(memberFirms.map((firm) => firm.status))).sort()
  const uniqueTypes = Array.from(new Set(memberFirms.map((firm) => firm.type))).sort()
  const uniqueRegions = Array.from(new Set(memberFirms.map((firm) => firm.region))).sort()
  const uniqueRiskLevels = Array.from(new Set(memberFirms.map((firm) => firm.riskLevel))).sort()

  const handleAddMemberFirm = () => {
    console.log("Add new member firm")
    // TODO: Implement add member firm functionality
  }

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
    setSelectedFirmForReview(memberFirm)
    setReviewDialogOpen(true)
  }

  const handleAcceptReview = async (firmId: string, notes: string) => {
    console.log("Accept review for firm:", firmId, "Notes:", notes)
    // TODO: Implement accept review API call
    toast({
      title: "Review Accepted",
      description: `Successfully accepted the review for ${selectedFirmForReview?.name}`,
    })
  }

  const handleRejectReview = async (firmId: string, notes: string) => {
    console.log("Reject review for firm:", firmId, "Notes:", notes)
    // TODO: Implement reject review API call
    toast({
      title: "Review Rejected",
      description: `Review rejected for ${selectedFirmForReview?.name}`,
      variant: "destructive"
    })
  }

  // Calculate stats for sidebar
  const sidebarStats = {
    total: memberFirms.length,
    completed: memberFirms.filter(firm => firm.status === 'active').length,
    inProgress: memberFirms.filter(firm => firm.status === 'pending').length,
    pending: memberFirms.filter(firm => firm.status === 'inactive').length,
    overdue: memberFirms.filter(firm => firm.riskLevel === 'high').length
  }


  // const statsCards = (
  //   <>
  //     <StatsCard
  //       icon={Building}
  //       label="Total Firms"
  //       value={totalFirms}
  //       color="blue"
  //       compact={true}
  //     />
  //     <StatsCard
  //       icon={Building}
  //       label="Active"
  //       value={activeFirms}
  //       color="green"
  //       compact={true}
  //     />
  //     <StatsCard
  //       icon={AlertTriangle}
  //       label="High Risk"
  //       value={highRiskFirms}
  //       color="yellow"
  //       compact={true}
  //     />
  //     <StatsCard
  //       icon={Star}
  //       label="Avg Compliance"
  //       value={`${Math.round(averageCompliance)}%`}
  //       color="purple"
  //       compact={true}
  //     />
  //   </>
  // )

  return (
    <DualSidebarLayout
      title=""
      description=""
      rightSidebarProps={{
        stats: sidebarStats,
        onExport: () => console.log("Export member firms"),
        onImport: () => console.log("Import member firms"),
        onSettings: () => console.log("Member firm settings"),
        filters: {
          searchTerm,
          statusFilter,
          gradeFilter: typeFilter, // Using typeFilter as gradeFilter for consistency
          priorityFilter: riskLevelFilter, // Using riskLevelFilter as priorityFilter
          countryFilter: regionFilter, // Using regionFilter as countryFilter
          onSearchChange: setSearchTerm,
          onStatusChange: setStatusFilter,
          onGradeChange: setTypeFilter,
          onPriorityChange: setRiskLevelFilter,
          onCountryChange: setRegionFilter,
          onFilter: handleFilter,
          onClearFilters: clearFilters,
          hasActiveFilters,
          resultsCount: filteredMemberFirms.length,
          viewMode,
          onViewModeChange: setViewMode,
          statusOptions: uniqueStatuses,
          gradeOptions: uniqueTypes,
          priorityOptions: uniqueRiskLevels,
          countryOptions: uniqueRegions
        }
      }}
      className="!p-0"
    >
      <div className="h-[calc(100vh-120px)] p-6">
        {/* Member Firms View */}
        <UnifiedView
          viewMode={viewMode}
          items={filteredMemberFirms}
          renderItem={(memberFirm) => (
            <MemberFirmItem
              memberFirm={memberFirm}
              viewMode={viewMode}
              onView={handleViewMemberFirm}
              onEdit={handleEditMemberFirm}
              onDelete={handleDeleteMemberFirm}
              onReview={handleReviewMemberFirm}
            />
          )}
        />
      </div>

      {/* Review Dialog */}
      <MemberFirmReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        memberFirm={selectedFirmForReview}
        onAccept={handleAcceptReview}
        onReject={handleRejectReview}
      />
    </DualSidebarLayout>
  )
}