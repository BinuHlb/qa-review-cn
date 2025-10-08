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
import { Shield, Search, RotateCcw, List, Grid3X3, CheckCircle2, Award, Flag, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { mockReviews, type Review } from "@/lib/mock-data"
import { type Attachment } from "@/components/shared/attachments-section"

export default function DirectorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [reviewerFilter, setReviewerFilter] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [reviewAttachments, setReviewAttachments] = useState<Record<string, Attachment[]>>({})

  // Load submitted reviews (reviews that have been submitted by reviewers)
  useEffect(() => {
    // Filter reviews that are submitted (ready for technical director rating)
    const submittedReviews = mockReviews.filter(review => 
      review.status === 'Submitted' || review.status === 'Completed'
    )
    setReviews(submittedReviews)
  }, [])

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

    // Reviewer filter
    if (reviewerFilter !== "all") {
      filtered = filtered.filter((review) => review.reviewer === reviewerFilter)
    }

    return filtered
  }, [reviews, searchTerm, statusFilter, gradeFilter, priorityFilter, reviewerFilter])

  // Clear selection if filtered reviews change and selected review is no longer in the list
  useEffect(() => {
    if (filteredReviews.length === 0) {
      setSelectedReview(null)
    } else if (selectedReview && !filteredReviews.find(r => r.id === selectedReview.id)) {
      setSelectedReview(null)
    }
  }, [filteredReviews, selectedReview])

  // Memoized unique filter values
  const uniqueReviewers = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.reviewer))).sort(),
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
    Boolean(searchTerm || statusFilter !== "all" || gradeFilter !== "all" || priorityFilter !== "all" || reviewerFilter !== "all"),
    [searchTerm, statusFilter, gradeFilter, priorityFilter, reviewerFilter]
  )

  // Handlers
  const handleViewReview = useCallback((review: Review) => {
    setSelectedReview(prev => prev?.id === review.id ? null : review)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setStatusFilter("all")
    setGradeFilter("all")
    setPriorityFilter("all")
    setReviewerFilter("all")
  }, [])

  // Attachment handlers
  const handleAttachmentUpload = useCallback(async (reviewId: string, files: File[]): Promise<Attachment[]> => {
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
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setReviewAttachments(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || []).filter(att => att.id !== attachmentId)
    }))
  }, [])

  const handleAttachmentDownload = useCallback(async (attachment: Attachment): Promise<void> => {
    console.log('Downloading attachment:', attachment.name)
  }, [])

  const handleTechnicalDirectorRating = useCallback(async (reviewId: string, grade: string, notes: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Technical Director Rating:', { reviewId, grade, notes })
    
    // Update the review with new grade
    setReviews(prev => prev.map(r => 
      r.id === reviewId 
        ? { ...r, currentGrade: grade as Review['currentGrade'], status: 'Completed' as Review['status'] }
        : r
    ))
    
    // Close the detail panel
    setSelectedReview(null)
  }, [])

  // Empty state configuration
  const emptyStateConfig = {
    icon: Shield,
    iconColor: "text-primary",
    iconBgColor: "bg-primary/10",
    title: "Technical Director Reviews",
    description: "Select a submitted review to:",
    steps: [
      {
        number: "1",
        title: "Review Submission",
        description: "Examine reviewer's work, documents, and ratings"
      },
      {
        number: "2", 
        title: "Provide Technical Rating",
        description: "Give your technical assessment and grade"
      },
      {
        number: "3",
        title: "Add Feedback", 
        description: "Provide technical feedback and recommendations"
      }
    ],
    badge: {
      text: `${reviews.length} submitted reviews`,
      variant: "outline" as const
    }
  }

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
                    {filteredReviews.length} of {reviews.length} submitted reviews
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
                      id="search"
                      name="search"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <Select name="status" value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="w-[140px] h-9">
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
                <Select name="grade" value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger id="grade-filter" className="w-[130px] h-9">
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
                <Select name="priority" value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger id="priority-filter" className="w-[130px] h-9">
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

                {/* Reviewer Filter */}
                <Select name="reviewer" value={reviewerFilter} onValueChange={setReviewerFilter}>
                  <SelectTrigger id="reviewer-filter" className="w-[140px] h-9">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reviewers</SelectItem>
                    {uniqueReviewers.map((reviewer) => (
                      <SelectItem key={reviewer} value={reviewer}>
                        {reviewer}
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
                onEdit={undefined}
                onAssign={undefined}
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
                showTechnicalDirectorRating={true}
                onTechnicalDirectorRating={handleTechnicalDirectorRating}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <EmptyState {...emptyStateConfig} />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

