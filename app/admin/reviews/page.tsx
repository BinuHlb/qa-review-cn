"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ListDetailLayout } from "@/components/shared/list-detail-layout"
import { EmptyState } from "@/components/shared/empty-state"
import { ReviewView } from "@/components/reviews/review-view"
import { ReviewActionPanel } from "@/components/reviews/review-action-panel"
import { ReviewAssignDrawer } from "@/components/reviews/review-assign-drawer"
import { AcceptanceDrawer } from "@/components/reviews/workflow/acceptance-drawer"
import { ReviewerWorkDrawer } from "@/components/reviews/workflow/reviewer-work-drawer"
import { VerificationDrawer } from "@/components/reviews/workflow/verification-drawer"
import { ClipboardList, Calendar, Award, Clock, MapPin, Shield, CheckCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataFilterBar } from "@/components/shared/data-filter-bar"

import type { Review } from "@/types/entities"
import workflowMockReviews from "@/lib/mock-data-workflow"
import { mockReviewers } from "@/lib/reviewers-mock-data"
import { type Attachment } from "@/components/shared/attachments-section"
import { REVIEW_TYPE_OPTIONS } from "@/lib/constants"
import { useDataFilters } from "@/hooks/use-data-filters"
import { useSelection } from "@/hooks/use-selection"
import { WorkflowService } from "@/lib/services/workflow-service"
import { NotificationService } from "@/lib/services/notification-service"
import { useToast } from "@/hooks/use-toast"

export default function AdminReviewsPage() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>(workflowMockReviews)
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [reviewAttachments, setReviewAttachments] = useState<Record<string, Attachment[]>>({})
  
  // Workflow drawers state
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false)
  const [acceptanceDrawerOpen, setAcceptanceDrawerOpen] = useState(false)
  const [workDrawerOpen, setWorkDrawerOpen] = useState(false)
  const [verificationDrawerOpen, setVerificationDrawerOpen] = useState(false)
  
  const [reviewToAssign, setReviewToAssign] = useState<Review | null>(null)
  const [reviewForAcceptance, setReviewForAcceptance] = useState<Review | null>(null)
  const [reviewForWork, setReviewForWork] = useState<Review | null>(null)
  const [reviewForVerification, setReviewForVerification] = useState<Review | null>(null)

  // Use custom filters hook
  const {
    filteredData: filteredReviews,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    clearFilters: resetFilters,
    hasActiveFilters: hasFilters
  } = useDataFilters<Review>(reviews, {
    searchFields: ['memberFirm', 'reviewer', 'type', 'country']
  })

  // Initialize filter values
  useEffect(() => {
    if (!filters.year) setFilter('year', 'all')
    if (!filters.grade) setFilter('grade', 'all')
    if (!filters.reviewType) setFilter('reviewType', 'all')
    if (!filters.country) setFilter('country', 'all')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Use selection hook
  const {
    selected: selectedReview,
    select: selectReview,
    clear: clearSelection
  } = useSelection<Review>(
    (review) => review.id,
    { toggleOnReselect: true }
  )

  // Extract single review from selection state
  const currentReview: Review | null = selectedReview && !Array.isArray(selectedReview) ? selectedReview : null

  // Helper to set selected review (for compatibility)
  const setSelectedReview = (review: Review | null | ((prev: Review | null) => Review | null)) => {
    if (typeof review === 'function') {
      // Handle function setter
      const newReview = review(currentReview)
      if (newReview) {
        selectReview(newReview)
      } else {
        clearSelection()
      }
    } else if (review) {
      selectReview(review)
    } else {
      clearSelection()
    }
  }

  // Clear selection if filtered reviews change and selected review is no longer in the list
  useEffect(() => {
    if (filteredReviews.length === 0) {
      clearSelection()
    } else if (currentReview && !filteredReviews.find(r => r.id === currentReview.id)) {
      clearSelection()
    }
  }, [filteredReviews, currentReview, clearSelection])

  // Memoized unique filter values
  const uniqueCountries = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.country))).sort(),
    [reviews]
  )
  
  const uniqueYears = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.year).filter((year): year is string => Boolean(year)))).sort().reverse(),
    [reviews]
  )
  
  const uniqueGrades = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.currentGrade))).sort(),
    [reviews]
  )

  // Filter configuration for DataFilterBar
  const filterConfigs = useMemo(() => [
    {
      key: "year",
      placeholder: "Year",
      icon: Calendar,
      options: [
        { value: "all", label: "All Years" },
        ...uniqueYears.map(year => ({ value: year, label: year }))
      ]
    },
    {
      key: "grade",
      placeholder: "Grade",
      icon: Award,
      options: [
        { value: "all", label: "All Grades" },
        ...uniqueGrades.map(grade => ({ value: grade, label: `Grade ${grade}` }))
      ]
    },
    {
      key: "reviewType",
      placeholder: "Type",
      icon: Clock,
      options: [
        { value: "all", label: "All Types" },
        ...REVIEW_TYPE_OPTIONS.map(type => ({ value: type.hoursValue, label: type.hours }))
      ]
    },
    {
      key: "country",
      placeholder: "Country",
      icon: MapPin,
      options: [
        { value: "all", label: "All Countries" },
        ...uniqueCountries.map(country => ({ value: country, label: country }))
      ]
    }
  ], [uniqueYears, uniqueGrades, uniqueCountries])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value)
  }, [setFilter])

  // Handlers
  const handleViewReview = useCallback((review: Review) => {
    setSelectedReview(prev => prev?.id === review.id ? null : review)
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      reviewType: string
      reviewMode: string
      assignDate: string
      deadlineDate: string
      teamMeetingLink: string
      forceAssignment: boolean
    }
  ) => {
    try {
      console.log("Assigning review:", reviewId, data)
      const selectedReviewer = mockReviewers.find(r => r.id === data.reviewerId)
      if (selectedReviewer) {
        setReviews(prev => prev.map(r => 
          r.id === reviewId 
            ? { 
                ...r, 
                reviewer: selectedReviewer.name, 
                reviewType: data.reviewType as Review['reviewType']
              }
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

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    resetFilters()
  }, [setSearchTerm, resetFilters])

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

  // Workflow action handlers (Admin omnipotent mode - can perform any action)
  const handleOpenAcceptance = useCallback((review: Review) => {
    setReviewForAcceptance(review)
    setAcceptanceDrawerOpen(true)
  }, [])

  const handleAcceptReview = useCallback(async (reviewId: string, notes?: string) => {
    const review = reviews.find(r => r.id === reviewId)
    if (!review) return
    
    const updatedReview = WorkflowService.acceptReview(review, {
      reviewId,
      acceptedBy: 'Admin',
      acceptedByRole: 'reviewer',
      acceptanceNotes: notes
    })
    
    setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
    
    await NotificationService.sendAcceptanceConfirmation(
      reviewId,
      review.memberFirm,
      'Admin',
      'reviewer'
    )
    
    toast({
      title: "Review Accepted",
      description: "Review accepted on behalf of reviewer. Proceeding to review work.",
      variant: "default"
    })
    setAcceptanceDrawerOpen(false)
    setReviewForAcceptance(null)
  }, [reviews, toast])

  const handleRejectReview = useCallback(async (reviewId: string, reason: string) => {
    const review = reviews.find(r => r.id === reviewId)
    if (!review) return
    
    const updatedReview = WorkflowService.rejectReview(review, {
      reviewId,
      rejectedBy: 'Admin',
      rejectedByRole: 'reviewer',
      rejectionReason: reason
    })
    
    setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
    
    await NotificationService.sendRejectionNotification(
      reviewId,
      review.memberFirm,
      'Admin',
      'reviewer',
      reason
    )
    
    toast({
      title: "Review Rejected",
      description: "Review rejected on behalf of reviewer.",
      variant: "destructive"
    })
    setAcceptanceDrawerOpen(false)
    setReviewForAcceptance(null)
  }, [reviews, toast])

  const handleOpenWork = useCallback((review: Review) => {
    setReviewForWork(review)
    setWorkDrawerOpen(true)
  }, [])

  const handleSubmitWorkReview = useCallback(async (reviewId: string, data: {
    grade: string
    comments: string
    strengths?: string
    areasForImprovement?: string
    recommendations?: string
    reviewedFiles: File[]
  }) => {
    const review = reviews.find(r => r.id === reviewId)
    if (!review) return
    
    const updatedReview = WorkflowService.submitReview(review, {
      reviewId,
      rating: {
        grade: data.grade as '1' | '2' | '3' | '4' | '5',
        comments: data.comments,
        strengths: data.strengths,
        areasForImprovement: data.areasForImprovement,
        recommendations: data.recommendations,
        submittedBy: 'Admin',
        submittedByRole: 'admin',
        submittedAt: new Date().toISOString()
      },
      reviewedDocuments: data.reviewedFiles.map((file, idx) => ({
        id: `reviewed-${reviewId}-${Date.now()}-${idx}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedBy: 'Admin',
        uploadedByRole: 'admin',
        uploadedAt: new Date().toISOString(),
        category: 'reviewed' as const
      }))
    })
    
    setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
    
    await NotificationService.sendSubmissionNotification(
      reviewId,
      review.memberFirm,
      'technicaldirector@qa-review.com'
    )
    
    toast({
      title: "Review Submitted",
      description: "Review work submitted on behalf of reviewer for TD verification.",
      variant: "default"
    })
    setWorkDrawerOpen(false)
    setReviewForWork(null)
  }, [reviews, toast])

  const handleOpenVerification = useCallback((review: Review) => {
    setReviewForVerification(review)
    setVerificationDrawerOpen(true)
  }, [])

  const handleVerifyReview = useCallback(async (reviewId: string, data: {
    grade: string
    originalGrade: string
    modified: boolean
    verificationNotes: string
    agreementLevel: 'full' | 'partial' | 'disagree'
    additionalFindings?: string
  }) => {
    const review = reviews.find(r => r.id === reviewId)
    if (!review) return
    
    const updatedReview = WorkflowService.verifyReview(review, {
      reviewId,
      verification: {
        grade: data.grade as '1' | '2' | '3' | '4' | '5',
        originalReviewerGrade: data.originalGrade as '1' | '2' | '3' | '4' | '5',
        modified: data.modified,
        verificationNotes: data.verificationNotes,
        agreementLevel: data.agreementLevel,
        additionalFindings: data.additionalFindings,
        verifiedBy: 'Admin',
        verifiedByRole: 'admin',
        verifiedAt: new Date().toISOString()
      }
    })
    
    setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
    
    await NotificationService.sendVerificationNotification(
      reviewId,
      review.memberFirm,
      'ceo@qa-review.com'
    )
    
    toast({
      title: "Review Verified",
      description: "Review verified on behalf of TD and sent to CEO for final approval.",
      variant: "default"
    })
    setVerificationDrawerOpen(false)
    setReviewForVerification(null)
  }, [reviews, toast])

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
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader 
          search={{
            searchTerm,
            searchPlaceholder: "Search reviews...",
            onSearchChange: setSearchTerm
          }}
        />
        <ListDetailLayout
          listContent={
            <>
              {/* Header with Filters */}
              <div className="flex-shrink-0 mb-6">
                <DataFilterBar
                  showSearch={false}
                  filters={filterConfigs}
                  filterValues={filters}
                  onFilterChange={handleFilterChange}
                  showViewToggle={true}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  hasActiveFilters={hasFilters}
                  onClearFilters={clearFilters}
                  resultCount={filteredReviews.length}
                  totalCount={reviews.length}
                />
              </div>

              {/* Review List */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <ReviewView
                  reviews={filteredReviews}
                  viewMode={viewMode}
                  selectedReview={currentReview}
                  onView={handleViewReview}
                  onEdit={handleEditReview}
                  onAssign={handleAssignReview}
                />
              </div>
            </>
          }
          detailContent={
            currentReview ? (
              <div className="flex flex-col h-full">
                {/* Admin Workflow Actions - Omnipotent Controls */}
                <div className="border-b bg-muted/30 p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin Workflow Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentReview.workflowStatus === 'pending_acceptance' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenAcceptance(currentReview)}
                        className="text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept/Reject
                      </Button>
                    )}
                    {(currentReview.workflowStatus === 'in_progress' || currentReview.workflowStatus === 'accepted') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenWork(currentReview)}
                        className="text-xs"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Perform Work
                      </Button>
                    )}
                    {currentReview.workflowStatus === 'submitted_for_verification' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenVerification(currentReview)}
                        className="text-xs"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Verify (TD)
                      </Button>
                    )}
                    {currentReview.workflowStatus === 'verified_pending_final' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Navigate to CEO final reviews or open finalization drawer
                          window.location.href = `/admin/final-reviews?reviewId=${currentReview.id}`
                        }}
                        className="text-xs"
                      >
                        <Award className="h-3 w-3 mr-1" />
                        Finalize (CEO)
                      </Button>
                    )}
                  </div>
                </div>

                {/* Review Details */}
                <div className="flex-1 overflow-y-auto">
                  <ReviewActionPanel
                    key={currentReview.id}
                    review={currentReview}
                    initialAttachments={reviewAttachments[currentReview.id] || []}
                    onAttachmentUpload={(files) => handleAttachmentUpload(currentReview.id, files)}
                    onAttachmentRemove={(attachmentId) => handleAttachmentRemove(currentReview.id, attachmentId)}
                    onAttachmentDownload={handleAttachmentDownload}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <EmptyState {...emptyStateConfig} />
              </div>
            )
          }
          detailScrollable={false}
        />

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

        {/* Admin Omnipotent Workflow Drawers - Can perform any action on behalf of any user */}
        <AcceptanceDrawer
          open={acceptanceDrawerOpen}
          onOpenChange={setAcceptanceDrawerOpen}
          review={reviewForAcceptance}
          userRole="reviewer"
          onAccept={handleAcceptReview}
          onReject={handleRejectReview}
        />

        <ReviewerWorkDrawer
          open={workDrawerOpen}
          onOpenChange={setWorkDrawerOpen}
          review={reviewForWork}
          onSubmit={handleSubmitWorkReview}
        />

        <VerificationDrawer
          open={verificationDrawerOpen}
          onOpenChange={setVerificationDrawerOpen}
          review={reviewForVerification}
          onVerify={handleVerifyReview}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
