"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Download, Upload } from "lucide-react"
import { PageLayout } from "@/components/shared/page-layout"
import { FilterSection } from "@/components/shared/filter-section"
import { ReviewView } from "@/components/reviews/review-view"
import { AssignDrawer } from "@/components/shared/assign-drawer"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockReviews, type Review } from "@/lib/mock-data"
import { mockReviewers } from "@/lib/reviewers-mock-data"

export default function AdminReviewsPage() {
  const [reviews] = useState<Review[]>(mockReviews)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews)
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  const handleViewReview = (review: Review) => {
    console.log("View review:", review)
    // TODO: Implement view review functionality
  }

  const handleEditReview = (review: Review) => {
    console.log("Edit review:", review)
    // TODO: Implement edit review functionality
  }

  const handleAssignReview = (review: Review) => {
    setSelectedReview(review)
    setAssignDrawerOpen(true)
  }

  const handleAssignSubmit = (data: {
    reviewerId: string
    priority: string
    type: string
    dueDate: string
    notes: string
  }) => {
    console.log("Assigning review:", selectedReview, "with data:", data)
    // TODO: Implement assign review functionality
    setAssignDrawerOpen(false)
    setSelectedReview(null)
  }

  const handleCreateReview = () => {
    console.log("Create new review")
    // TODO: Implement create review functionality
  }

  const handleExportReviews = () => {
    console.log("Export reviews")
    // TODO: Implement export functionality
  }

  const handleImportReviews = () => {
    console.log("Import reviews")
    // TODO: Implement import functionality
  }

  const handleFilter = () => {
    let filtered = reviews

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.memberFirm.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((review) => review.status === statusFilter)
    }

    // Grade filter
    if (gradeFilter !== "all") {
      filtered = filtered.filter((review) => review.currentGrade === gradeFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((review) => review.priority === priorityFilter)
    }

    // Country filter
    if (countryFilter !== "all") {
      filtered = filtered.filter((review) => review.country === countryFilter)
    }

    setFilteredReviews(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setGradeFilter("all")
    setPriorityFilter("all")
    setCountryFilter("all")
    setFilteredReviews(reviews)
  }

  const hasActiveFilters = Boolean(searchTerm || statusFilter !== "all" || gradeFilter !== "all" || priorityFilter !== "all" || countryFilter !== "all")

  // Get unique values for filters
  const uniqueCountries = Array.from(new Set(reviews.map((review) => review.country))).sort()
  const uniqueStatuses = Array.from(new Set(reviews.map((review) => review.status))).sort()
  const uniqueGrades = Array.from(new Set(reviews.map((review) => review.currentGrade))).sort()
  const uniquePriorities = Array.from(new Set(reviews.map((review) => review.priority))).sort()

  // Calculate stats
  // const totalReviews = reviews.length
  // const completedReviews = reviews.filter(review => review.status === "Completed").length
  // const inProgressReviews = reviews.filter(review => review.status === "In Progress").length
  // const overdueReviews = reviews.filter(review => review.status === "Overdue").length

  const headerActions = (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCreateReview}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Review
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportReviews}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleImportReviews}
      >
        <Upload className="h-4 w-4 mr-2" />
        Import
      </Button>
    </>
  )

  // const statsCards = (
  //   <>
  //     <StatsCard
  //       icon={FileText}
  //       label="Total Reviews"
  //       value={totalReviews}
  //       color="blue"
  //       compact={true}
  //     />
  //     <StatsCard
  //       icon={CheckCircle}
  //       label="Completed"
  //       value={completedReviews}
  //       color="green"
  //       compact={true}
  //     />
  //     <StatsCard
  //       icon={Clock}
  //       label="In Progress"
  //       value={inProgressReviews}
  //       color="yellow"
  //       compact={true}
  //     />
  //     <StatsCard
  //       icon={AlertTriangle}
  //       label="Overdue"
  //       value={overdueReviews}
  //       color="red"
  //       compact={true}
  //     />
  //   </>
  // )

  return (
    <PageLayout
      title="QA Reviews"
      description="Manage quality assurance reviews for member firms"
      headerActions={headerActions}
    >
      <FilterSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilter={handleFilter}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        resultsCount={filteredReviews.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchPlaceholder="Search reviews..."
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
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="h-8 text-xs w-28">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {uniqueGrades.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="h-8 text-xs w-28">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {uniquePriorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="h-8 text-xs w-32">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {uniqueCountries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>
      
      <ReviewView
        reviews={filteredReviews}
        viewMode={viewMode}
        onView={handleViewReview}
        onEdit={handleEditReview}
        onAssign={handleAssignReview}
      />

      {/* Assign Drawer */}
      <AssignDrawer
        open={assignDrawerOpen}
        onOpenChange={setAssignDrawerOpen}
        title="Assign Review"
        description={`Assign review for ${selectedReview?.memberFirm}`}
        onSubmit={handleAssignSubmit}
        reviewers={mockReviewers.map(reviewer => ({
          id: reviewer.id,
          name: reviewer.name,
          role: reviewer.role,
          status: reviewer.status
        }))}
      />
    </PageLayout>
  )
}
