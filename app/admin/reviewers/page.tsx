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
  UserPlus,
  Settings
} from "lucide-react"
import { PageLayout } from "@/components/shared/page-layout"
import { FilterSection } from "@/components/shared/filter-section"
import { UnifiedView } from "@/components/shared/unified-view"
import { ReviewerItem } from "@/components/reviewers/reviewer-item"
import { 
  mockReviewers, 
  type Reviewer
} from "@/lib/reviewers-mock-data"

export default function AdminReviewersPage() {
  const [reviewers] = useState<Reviewer[]>(mockReviewers)
  const [filteredReviewers, setFilteredReviewers] = useState<Reviewer[]>(mockReviewers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "card">("list")

  const handleFilter = () => {
    let filtered = reviewers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (reviewer) =>
          reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reviewer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reviewer.specialization.some(spec => 
            spec.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((reviewer) => reviewer.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((reviewer) => reviewer.status === statusFilter)
    }

    setFilteredReviewers(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setRoleFilter("all")
    setStatusFilter("all")
    setFilteredReviewers(reviewers)
  }

  const hasActiveFilters = Boolean(searchTerm || roleFilter !== "all" || statusFilter !== "all")

  // Get unique values for filters
  const uniqueRoles = Array.from(new Set(reviewers.map((reviewer) => reviewer.role))).sort()
  const uniqueStatuses = Array.from(new Set(reviewers.map((reviewer) => reviewer.status))).sort()

  const handleAddReviewer = () => {
    console.log("Add new reviewer")
    // TODO: Implement add reviewer functionality
  }

  const handleViewReviewer = (reviewer: Reviewer) => {
    console.log("View reviewer:", reviewer)
    // TODO: Implement view reviewer functionality
  }

  const handleEditReviewer = (reviewer: Reviewer) => {
    console.log("Edit reviewer:", reviewer)
    // TODO: Implement edit reviewer functionality
  }

  const handleDeleteReviewer = (reviewer: Reviewer) => {
    console.log("Delete reviewer:", reviewer)
    // TODO: Implement delete reviewer functionality
  }

  const handleAssignReview = (reviewer: Reviewer) => {
    console.log("Assign review to:", reviewer)
    // TODO: Implement assign review functionality
  }

  // Calculate stats
  // const totalReviewers = reviewers.length
  // const activeReviewers = reviewers.filter(reviewer => reviewer.status === "Active").length
  // const availableReviewers = reviewers.filter(reviewer => reviewer.workload === "Available").length
  // const busyReviewers = reviewers.filter(reviewer => reviewer.workload === "Busy").length

  const headerActions = (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddReviewer}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Add Reviewer
      </Button>
      <Button
        variant="outline"
        size="sm"
      >
        <Settings className="h-4 w-4 mr-2" />
        Roles
      </Button>
    </>
  )

  // const statsCards = (
  //   <>
  //     <StatsCard
  //       icon={Users}
  //       label="Total Reviewers"
  //       value={totalReviewers}
  //       color="blue"
  //       compact={true}
  //     />
  //     <StatsCard
  //       icon={CheckCircle}
  //       label="Active"
  //       value={activeReviewers}
  //       color="green"
  //       compact={true}
  //     />
  //     <StatsCard
  //       icon={Clock}
  //       label="Available"
  //       value={availableReviewers}
  //       color="yellow"
  //       compact={true}
  //     />
  //     <StatsCard
  //       icon={AlertTriangle}
  //       label="Busy"
  //       value={busyReviewers}
  //       color="red"
  //       compact={true}
  //     />
  //   </>
  // )

  return (
    <PageLayout
      title="Manage Reviewers"
      description="Manage reviewer accounts, roles, and assignments"
      headerActions={headerActions}
    >
      {/* Filters */}
      <FilterSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilter={handleFilter}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        resultsCount={filteredReviewers.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchPlaceholder="Search reviewers..."
        compact={true}
      >
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-8 text-xs w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
      </FilterSection>

      {/* Reviewers View */}
      <UnifiedView
        viewMode={viewMode}
        items={filteredReviewers}
        renderItem={(reviewer) => (
          <ReviewerItem
            reviewer={reviewer}
            viewMode={viewMode}
            onView={handleViewReviewer}
            onEdit={handleEditReviewer}
            onAssign={handleAssignReview}
            onDelete={handleDeleteReviewer}
          />
        )}
      />
    </PageLayout>
  )
}