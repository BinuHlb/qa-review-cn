"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmptyState } from "@/components/shared/empty-state"
import { ReviewView } from "@/components/reviews/review-view"
import { ReviewActionPanel } from "@/components/reviews/review-action-panel"
import { ReviewAssignDrawer } from "@/components/reviews/review-assign-drawer"
import { ClipboardList, Search, Filter, RotateCcw, List, Grid3X3, CheckCircle2, Award, Flag, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { mockReviews, type Review } from "@/lib/mock-data"
import { mockReviewers } from "@/lib/reviewers-mock-data"
import { type Attachment } from "@/components/shared/attachments-section"

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [reviewAttachments, setReviewAttachments] = useState<Record<string, Attachment[]>>({})
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false)
  const [reviewToAssign, setReviewToAssign] = useState<Review | null>(null)

  // Memoized filtered reviews based on all filter criteria
  const filteredReviews = useMemo(() => {
    let filtered = reviews

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (review) =>
          review.memberFirm.toLowerCase().includes(searchLower) ||
          review.reviewer.toLowerCase().includes(searchLower) ||
          review.type.toLowerCase().includes(searchLower) ||
          review.country.toLowerCase().includes(searchLower)
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

    return filtered
  }, [reviews, searchTerm, statusFilter, gradeFilter, priorityFilter, countryFilter])

  // Clear selection if filtered reviews change and selected review is no longer in the list
  useEffect(() => {
    if (filteredReviews.length === 0) {
      setSelectedReview(null)
    } else if (selectedReview && !filteredReviews.find(r => r.id === selectedReview.id)) {
      setSelectedReview(null)
    }
  }, [filteredReviews, selectedReview])

  // Memoized unique filter values
  const uniqueCountries = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.country))).sort(),
    [reviews]
  )
  
  const uniqueStatuses = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.status))).sort(),
    [reviews]
  )
  
  const uniqueGrades = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.currentGrade))).sort(),
    [reviews]
  )
  
  const uniquePriorities = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.priority))).sort(),
    [reviews]
  )

  const hasActiveFilters = useMemo(() => 
    Boolean(searchTerm || statusFilter !== "all" || gradeFilter !== "all" || priorityFilter !== "all" || countryFilter !== "all"),
    [searchTerm, statusFilter, gradeFilter, priorityFilter, countryFilter]
  )

  // Handlers
  const handleViewReview = useCallback((review: Review) => {
    setSelectedReview(prev => prev?.id === review.id ? null : review)
  }, [])

  const handleEditReview = useCallback((review: Review) => {
    // TODO: Implement edit review functionality
    if (process.env.NODE_ENV === 'development') {
      console.log("Edit review:", review)
    }
  }, [])

  const handleAssignReview = useCallback((review: Review) => {
    setReviewToAssign(review)
    setAssignDrawerOpen(true)
  }, [])

  const handleAssignReviewSubmit = useCallback(async (
    reviewId: string,
    data: {
      reviewerId: string
      priority: string
      type: string
      dueDate: string
      notes: string
      forceAssignment?: boolean
    }
  ) => {
    try {
      console.log("Assigning review:", reviewId, data)
      const selectedReviewer = mockReviewers.find(r => r.id === data.reviewerId)
      if (selectedReviewer) {
        setReviews(prev => prev.map(r => 
          r.id === reviewId 
            ? { ...r, reviewer: selectedReviewer.name, priority: data.priority as Review['priority'] }
            : r
        ))
      }
      setAssignDrawerOpen(false)
      setReviewToAssign(null)
    } catch (error) {
      console.error("Failed to assign review:", error)
      throw error
    }
  }, [])

  const handleAssignReviewer = useCallback((reviewerId: string) => {
    // TODO: Implement reviewer assignment to selected review
    if (process.env.NODE_ENV === 'development') {
      console.log("Assign reviewer:", reviewerId, "to review:", selectedReview?.id)
    }
  }, [selectedReview])

  const handleSubmitReview = useCallback(() => {
    // TODO: Implement submit review functionality
    if (process.env.NODE_ENV === 'development') {
      console.log("Submit review:", selectedReview)
    }
  }, [selectedReview])

  const handleCreateReview = useCallback(() => {
    // TODO: Implement create review functionality
    if (process.env.NODE_ENV === 'development') {
      console.log("Create new review")
    }
  }, [])

  const handleExportReviews = useCallback(() => {
    // TODO: Implement export functionality
    if (process.env.NODE_ENV === 'development') {
      console.log("Export reviews")
    }
  }, [])

  const handleImportReviews = useCallback(() => {
    // TODO: Implement import functionality
    if (process.env.NODE_ENV === 'development') {
      console.log("Import reviews")
    }
  }, [])

  const handleFilter = useCallback(() => {
    // Filter logic is now handled by the filteredReviews useMemo
    // This function is kept for compatibility with FilterSection component
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setStatusFilter("all")
    setGradeFilter("all")
    setPriorityFilter("all")
    setCountryFilter("all")
  }, [])

  // Attachment handlers
  const handleAttachmentUpload = useCallback(async (reviewId: string, files: File[]): Promise<Attachment[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newAttachments: Attachment[] = files.map((file, index) => ({
      id: `attachment-${reviewId}-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy: "Current User",
      uploadedAt: new Date().toISOString(),
      type: file.type
    }))
    
    setReviewAttachments(prev => ({
      ...prev,
      [reviewId]: [...(prev[reviewId] || []), ...newAttachments]
    }))
    
    return newAttachments
  }, [])

  const handleAttachmentRemove = useCallback(async (reviewId: string, attachmentId: string): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setReviewAttachments(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || []).filter(att => att.id !== attachmentId)
    }))
  }, [])

  const handleAttachmentDownload = useCallback(async (attachment: Attachment): Promise<void> => {
    // Simulate download
    console.log('Downloading attachment:', attachment.name)
    // In a real app, this would trigger the actual download
  }, [])

  // Empty state configuration
  const emptyStateConfig = {
    icon: ClipboardList,
    iconColor: "text-primary",
    iconBgColor: "bg-primary/10",
    title: "Review Management",
    description: "Select a review from the list to:",
    steps: [
      {
        number: "1",
        title: "View Details",
        description: "Examine attachments, comments, and review information"
      },
      {
        number: "2", 
        title: "Assign Reviewer",
        description: "Assign or reassign the review to a qualified reviewer"
      },
      {
        number: "3",
        title: "Track Progress", 
        description: "Monitor status and ensure timely completion"
      }
    ],
    badge: {
      text: `${reviews.length} total reviews`,
      variant: "outline" as const
    }
  }

  // Statistics for right sidebar
  const sidebarStats = useMemo(() => ({
    total: reviews.length,
    completed: reviews.filter(r => r.status === 'Completed').length,
    inProgress: reviews.filter(r => r.status === 'In Progress').length,
    pending: reviews.filter(r => r.status === 'Pending').length,
    overdue: reviews.filter(r => r.status === 'Overdue').length
  }), [reviews])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex h-[calc(100vh-85px)]">
          {/* Main Content - Review List with Filters */}
          <div className="flex-1 flex flex-col overflow-hidden p-6">
            {/* Header with Filters */}
            <div className="flex-shrink-0 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {filteredReviews.length} of {reviews.length} reviews
                  </p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`h-8 px-3 ${viewMode === "list" ? "bg-background shadow-sm" : ""}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("card")}
                    className={`h-8 px-3 ${viewMode === "card" ? "bg-background shadow-sm" : ""}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-9">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Grade Filter */}
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="w-[130px] h-9">
                    <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {uniqueGrades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Priority Filter */}
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[130px] h-9">
                    <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    {uniquePriorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Country Filter */}
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger className="w-[140px] h-9">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
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

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-9 px-3"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Review List */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ReviewView
                reviews={filteredReviews}
                viewMode={viewMode}
                selectedReview={selectedReview}
                onView={handleViewReview}
                onEdit={handleEditReview}
                onAssign={handleAssignReview}
              />
            </div>
          </div>

          {/* Right Panel - Review Details */}
          <div className="w-96 border-l bg-background overflow-y-auto">
            {selectedReview ? (
              <ReviewActionPanel
                key={selectedReview.id}
                review={selectedReview}
                initialAttachments={reviewAttachments[selectedReview.id] || []}
                onAttachmentUpload={(files) => handleAttachmentUpload(selectedReview.id, files)}
                onAttachmentRemove={(attachmentId) => handleAttachmentRemove(selectedReview.id, attachmentId)}
                onAttachmentDownload={handleAttachmentDownload}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <EmptyState {...emptyStateConfig} />
              </div>
            )}
          </div>
        </div>

        {/* Assign Reviewer Drawer */}
        <ReviewAssignDrawer
          open={assignDrawerOpen}
          onOpenChange={setAssignDrawerOpen}
          review={reviewToAssign}
          reviewers={mockReviewers.map(reviewer => ({
            id: reviewer.id,
            name: reviewer.name,
            role: reviewer.role,
            status: reviewer.status,
            email: reviewer.email,
            specialization: reviewer.specialization
          }))}
          onAssign={handleAssignReviewSubmit}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
