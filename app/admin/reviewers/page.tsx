"use client"

import { useState } from "react"
import { DualSidebarLayout } from "@/components/shared/dual-sidebar-layout"
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

  // Calculate stats for sidebar
  const sidebarStats = {
    total: reviewers.length,
    completed: reviewers.filter(reviewer => reviewer.status === "active").length,
    inProgress: reviewers.filter(reviewer => reviewer.currentWorkload >= reviewer.maxWorkload).length,
    pending: reviewers.filter(reviewer => reviewer.currentWorkload < reviewer.maxWorkload).length,
    overdue: reviewers.filter(reviewer => reviewer.status === "inactive").length
  }


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
    <DualSidebarLayout
      title=""
      description=""
      rightSidebarProps={{
        stats: sidebarStats,
        onNewReview: handleAddReviewer,
        onExport: () => console.log("Export reviewers"),
        onImport: () => console.log("Import reviewers"),
        onSettings: () => console.log("Reviewer settings"),
        filters: {
          searchTerm,
          statusFilter,
          gradeFilter: roleFilter, // Using roleFilter as gradeFilter for consistency
          priorityFilter: "all", // Not applicable for reviewers
          countryFilter: "all", // Not applicable for reviewers
          onSearchChange: setSearchTerm,
          onStatusChange: setStatusFilter,
          onGradeChange: setRoleFilter,
          onPriorityChange: () => {}, // Not applicable
          onCountryChange: () => {}, // Not applicable
          onFilter: handleFilter,
          onClearFilters: clearFilters,
          hasActiveFilters,
          resultsCount: filteredReviewers.length,
          viewMode,
          onViewModeChange: setViewMode,
          statusOptions: uniqueStatuses,
          gradeOptions: uniqueRoles,
          priorityOptions: [],
          countryOptions: []
        }
      }}
      className="!p-0"
    >
      <div className="h-[calc(100vh-120px)] p-6">
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
      </div>
    </DualSidebarLayout>
  )
}