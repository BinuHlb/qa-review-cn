"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, 
  Settings
} from "lucide-react"
import { PageLayout } from "@/components/shared/page-layout"
import { FilterSection } from "@/components/shared/filter-section"
import { UnifiedView } from "@/components/shared/unified-view"
import { MemberFirmItem } from "@/components/member-firms/member-firm-item"
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
    console.log("Review member firm:", memberFirm)
    // TODO: Implement review member firm functionality
  }

  // Calculate stats
  // const totalFirms = memberFirms.length
  // const activeFirms = memberFirms.filter(firm => firm.status === 'active').length
  // const pendingFirms = memberFirms.filter(firm => firm.status === 'pending').length
  // const highRiskFirms = memberFirms.filter(firm => firm.riskLevel === 'high').length
  // const averageCompliance = memberFirms.reduce((sum, firm) => sum + firm.complianceScore, 0) / memberFirms.length

  const headerActions = (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddMemberFirm}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Firm
      </Button>
      <Button
        variant="outline"
        size="sm"
      >
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
    </>
  )

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
    <PageLayout
      title="Member Firms"
      description="Manage member firm accounts, compliance, and reviews"
      headerActions={headerActions}
    >
      {/* Filters */}
      <FilterSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilter={handleFilter}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        resultsCount={filteredMemberFirms.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchPlaceholder="Search member firms..."
        compact={true}
      >
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 text-xs w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-8 text-xs w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="h-8 text-xs w-36">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {uniqueRegions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
          <SelectTrigger className="h-8 text-xs w-32">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            {uniqueRiskLevels.map((riskLevel) => (
              <SelectItem key={riskLevel} value={riskLevel}>
                {riskLevel.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

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
    </PageLayout>
  )
}