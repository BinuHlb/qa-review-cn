"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { DashboardStatsGrid, type DashboardStat } from "@/components/common"
import { TaskCard, TaskItem, EmptyTaskState } from "@/components/common/task-card"
import { WorkflowStatusBadge } from "@/components/common/workflow-status-badge"
import { PercentageBadge } from "@/components/common/percentage-badge"
import { AcceptanceDrawer } from "@/components/features/reviews/workflow/acceptance-drawer"
import { ReviewerWorkDrawer } from "@/components/features/reviews/workflow/reviewer-work-drawer"
import { WorkflowService } from "@/lib/services/workflow-service"
import { NotificationService } from "@/lib/services/notification-service"
import { useToast } from "@/hooks/use-toast"
import type { Review } from "@/types/entities"
import { 
  AlertCircle, 
  FileText, 
  CheckCircle2,
  Clock,
  Award,
  Activity
} from "lucide-react"
import workflowMockReviews from "@/lib/mock-data-workflow"
import { formatDate } from "@/lib/utils/formatters"
import { DATE_FORMATS } from "@/lib/constants"
import { useSession } from "next-auth/react"

export default function ReviewerDashboardPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  
  // Get current reviewer info from session (in real app)
  const currentReviewerId = 'REV-101'
  const currentReviewerName = session?.user?.name || 'Michael Chen'
  
  // State for drawers
  const [acceptanceDrawerOpen, setAcceptanceDrawerOpen] = useState(false)
  const [selectedReviewForAcceptance, setSelectedReviewForAcceptance] = useState<Review | null>(null)
  const [workDrawerOpen, setWorkDrawerOpen] = useState(false)
  const [selectedReviewForWork, setSelectedReviewForWork] = useState<Review | null>(null)
  const [allReviews, setAllReviews] = useState(workflowMockReviews)
  
  // Filter reviews for current reviewer
  const myReviews = useMemo(() => 
    allReviews.filter(r => 
      r.reviewer === currentReviewerName || r.reviewerId === currentReviewerId
    ),
    [allReviews, currentReviewerName, currentReviewerId]
  )
  
  // Categorize reviews by workflow status
  const pendingAcceptance = useMemo(() => 
    myReviews.filter(r => 
      r.workflowStatus === 'pending_acceptance' || 
      r.workflowStatus === 'firm_accepted'
    ),
    [myReviews]
  )
  
  const activeReviews = useMemo(() => 
    myReviews.filter(r => r.workflowStatus === 'in_progress' || r.workflowStatus === 'accepted'),
    [myReviews]
  )
  
  const submittedReviews = useMemo(() => 
    myReviews.filter(r => 
      r.workflowStatus === 'submitted_for_verification' ||
      r.workflowStatus === 'verified_pending_final'
    ),
    [myReviews]
  )
  
  const completedReviews = useMemo(() => 
    myReviews.filter(r => r.workflowStatus === 'completed'),
    [myReviews]
  )
  
  // Stats configuration
  const mainStats: DashboardStat[] = useMemo(() => [
    {
      title: "Total Reviews",
      value: myReviews.length,
      subtitle: "Assigned to you",
      icon: FileText,
      onClick: () => {}
    },
    {
      title: "Pending Acceptance",
      value: pendingAcceptance.length,
      subtitle: "Require your response",
      icon: AlertCircle,
      variant: pendingAcceptance.length > 0 ? "warning" : "default",
      onClick: () => {}
    },
    {
      title: "In Progress",
      value: activeReviews.length,
      subtitle: "Currently working",
      icon: Activity,
      onClick: () => {}
    },
    {
      title: "Completed",
      value: completedReviews.length,
      subtitle: "Successfully finalized",
      icon: CheckCircle2,
      variant: "success",
      onClick: () => {}
    }
  ], [myReviews.length, pendingAcceptance.length, activeReviews.length, completedReviews.length])
  
  // Handlers for acceptance
  const handleOpenAcceptance = (review: Review) => {
    setSelectedReviewForAcceptance(review)
    setAcceptanceDrawerOpen(true)
  }
  
  const handleOpenWork = (review: Review) => {
    setSelectedReviewForWork(review)
    setWorkDrawerOpen(true)
  }
  
  const handleAcceptReview = async (reviewId: string, notes?: string) => {
    const review = allReviews.find(r => r.id === reviewId)
    if (!review) return
    
    const updatedReview = WorkflowService.acceptReview(review, {
      reviewId,
      acceptedBy: currentReviewerName,
      acceptedByRole: 'reviewer',
      acceptanceNotes: notes
    })
    
    setAllReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
    
    await NotificationService.sendAcceptanceConfirmation(
      reviewId,
      review.memberFirm,
      currentReviewerName,
      'reviewer'
    )
    
    toast({
      title: "Review Accepted",
      description: "You've accepted this review assignment."
    })
    
    setAcceptanceDrawerOpen(false)
    setSelectedReviewForAcceptance(null)
  }
  
  const handleRejectReview = async (reviewId: string, reason: string) => {
    const review = allReviews.find(r => r.id === reviewId)
    if (!review) return
    
    const updatedReview = WorkflowService.rejectReview(review, {
      reviewId,
      rejectedBy: currentReviewerName,
      rejectedByRole: 'reviewer',
      rejectionReason: reason
    })
    
    setAllReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
    
    await NotificationService.sendRejectionNotification(
      reviewId,
      review.memberFirm,
      currentReviewerName,
      'reviewer',
      reason
    )
    
    toast({
      title: "Review Rejected",
      description: "You've rejected this review assignment.",
      variant: "destructive"
    })
    
    setAcceptanceDrawerOpen(false)
    setSelectedReviewForAcceptance(null)
  }
  
  const handleSubmitReview = async (reviewId: string, data: {
    grade: string
    comments: string
    strengths?: string
    areasForImprovement?: string
    recommendations?: string
    reviewedFiles: File[]
  }) => {
    const review = allReviews.find(r => r.id === reviewId)
    if (!review) return
    
    const updatedReview = WorkflowService.submitReview(review, {
      reviewId,
      rating: {
        grade: data.grade as '1' | '2' | '3' | '4' | '5',
        comments: data.comments,
        strengths: data.strengths,
        areasForImprovement: data.areasForImprovement,
        recommendations: data.recommendations,
        submittedBy: currentReviewerName,
        submittedByRole: 'reviewer',
        submittedAt: new Date().toISOString(),
        timeSpentHours: parseFloat(review.reviewType || '18')
      },
      reviewedDocuments: data.reviewedFiles
    })
    
    setAllReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
    
    await NotificationService.sendSubmissionNotification(
      reviewId,
      review.memberFirm,
      'technical-director@qa-review.com'
    )
    
    toast({
      title: "Review Submitted",
      description: "Your review has been submitted for verification."
    })
    
    setWorkDrawerOpen(false)
    setSelectedReviewForWork(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Reviewer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {currentReviewerName}! Manage your assigned reviews and track your progress.
          </p>
        </div>

        {/* Stats Overview */}
        <DashboardStatsGrid stats={mainStats} columns={4} />

        {/* Pending Acceptances - URGENT */}
        {pendingAcceptance.length > 0 && (
          <TaskCard
            title="Action Required: Pending Acceptances"
            description="Please review and accept or reject these assignments"
            count={pendingAcceptance.length}
            variant="urgent"
            icon={<AlertCircle className="h-5 w-5 text-red-600" />}
          >
            <div className="space-y-2">
              {pendingAcceptance.map((review) => (
                <TaskItem
                  key={review.id}
                  title={review.memberFirm}
                  subtitle={`${review.reviewType}-hour ${review.reviewMode} review • Due: ${formatDate(review.dueDate || review.endDate, DATE_FORMATS.DISPLAY)}`}
                  badge={<WorkflowStatusBadge status={review.workflowStatus} size="sm" />}
                  onClick={() => handleOpenAcceptance(review)}
                />
              ))}
            </div>
          </TaskCard>
        )}

        {/* Active Reviews */}
        <TaskCard
          title="My Active Reviews"
          description="Reviews you're currently working on"
          count={activeReviews.length}
          variant="info"
          icon={<FileText className="h-5 w-5 text-blue-600" />}
        >
          {activeReviews.length > 0 ? (
            <div className="space-y-2">
              {activeReviews.map((review) => (
                <TaskItem
                  key={review.id}
                  title={review.memberFirm}
                  subtitle={`${review.reviewType}-hour review • Started: ${formatDate(review.assignedAt || review.startDate, DATE_FORMATS.DISPLAY)}`}
                  badge={
                    <div className="flex items-center gap-2">
                      <PercentageBadge value={review.percentage || 0} showIcon={false} />
                      <WorkflowStatusBadge status={review.workflowStatus} size="sm" />
                    </div>
                  }
                  onClick={() => handleOpenWork(review)}
                />
              ))}
            </div>
          ) : (
            <EmptyTaskState
              message="No active reviews. All caught up!"
              icon={<CheckCircle2 className="h-8 w-8" />}
            />
          )}
        </TaskCard>

        {/* Submitted Reviews */}
        {submittedReviews.length > 0 && (
          <TaskCard
            title="Submitted for Verification"
            description="Reviews waiting for Technical Director approval"
            count={submittedReviews.length}
            variant="default"
            icon={<Clock className="h-5 w-5 text-muted-foreground" />}
          >
            <div className="space-y-2">
              {submittedReviews.map((review) => (
                <TaskItem
                  key={review.id}
                  title={review.memberFirm}
                  subtitle={`Submitted: ${formatDate(review.reviewerRating?.submittedAt || review.lastUpdated, DATE_FORMATS.DISPLAY)}`}
                  badge={
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Grade: {review.reviewerRating?.grade}/5
                      </span>
                      <WorkflowStatusBadge status={review.workflowStatus} size="sm" />
                    </div>
                  }
                />
              ))}
            </div>
          </TaskCard>
        )}

        {/* Completed Reviews */}
        {completedReviews.length > 0 && (
          <TaskCard
            title="Completed Reviews"
            description="Successfully completed and finalized"
            count={completedReviews.length}
            variant="success"
            icon={<Award className="h-5 w-5 text-green-600" />}
          >
            <div className="space-y-2">
              {completedReviews.slice(0, 3).map((review) => (
                <TaskItem
                  key={review.id}
                  title={review.memberFirm}
                  subtitle={`Final Grade: ${review.ceoFinalReview?.finalGrade || review.currentGrade}/5 • Completed: ${formatDate(review.ceoFinalReview?.finalizedAt || review.lastUpdated, DATE_FORMATS.DISPLAY)}`}
                  badge={<WorkflowStatusBadge status={review.workflowStatus} size="sm" />}
                />
              ))}
              {completedReviews.length > 3 && (
                <p className="text-xs text-center text-muted-foreground pt-2">
                  +{completedReviews.length - 3} more completed reviews
                </p>
              )}
            </div>
          </TaskCard>
        )}
      </div>

      {/* Acceptance Drawer */}
      <AcceptanceDrawer
        open={acceptanceDrawerOpen}
        onOpenChange={setAcceptanceDrawerOpen}
        review={selectedReviewForAcceptance}
        userRole="reviewer"
        onAccept={handleAcceptReview}
        onReject={handleRejectReview}
      />

      {/* Reviewer Work Drawer */}
      <ReviewerWorkDrawer
        open={workDrawerOpen}
        onOpenChange={setWorkDrawerOpen}
        review={selectedReviewForWork}
        onSubmit={handleSubmitReview}
      />
    </DashboardLayout>
  )
}
