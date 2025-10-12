"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { TaskCard, TaskItem, EmptyTaskState } from "@/components/common/task-card"
import { WorkflowStatusBadge } from "@/components/common/workflow-status-badge"
import { VerificationDrawer } from "@/components/features/reviews/workflow/verification-drawer"
import { WorkflowService } from "@/lib/services/workflow-service"
import { NotificationService } from "@/lib/services/notification-service"
import { useToast } from "@/hooks/use-toast"
import type { Review } from "@/types/entities"
import { 
  Shield, 
  CheckCircle2,
  Award,
  TrendingUp
} from "lucide-react"
import workflowMockReviews from "@/lib/mock-data-workflow"
import { formatDate } from "@/lib/utils/formatters"
import { DATE_FORMATS } from "@/lib/constants"

export default function DirectorDashboardPage() {
  const { toast } = useToast()
  
  // State
  const [verificationDrawerOpen, setVerificationDrawerOpen] = useState(false)
  const [selectedReviewForVerification, setSelectedReviewForVerification] = useState<Review | null>(null)
  const [allReviews, setAllReviews] = useState(workflowMockReviews)
  
  // Handlers
  const handleOpenVerification = (review: Review) => {
    setSelectedReviewForVerification(review)
    setVerificationDrawerOpen(true)
  }
  
  const handleVerifyReview = async (reviewId: string, data: {
    grade: string
    originalGrade: string
    modified: boolean
    verificationNotes: string
    agreementLevel: 'full' | 'partial' | 'disagree'
    additionalFindings?: string
  }) => {
    const review = allReviews.find(r => r.id === reviewId)
    if (!review) return
    
    // Use WorkflowService to update review
    const updatedReview = WorkflowService.verifyReview(review, {
      reviewId,
      verification: {
        grade: data.grade as '1' | '2' | '3' | '4' | '5',
        originalReviewerGrade: data.originalGrade as '1' | '2' | '3' | '4' | '5',
        modified: data.modified,
        verificationNotes: data.verificationNotes,
        agreementLevel: data.agreementLevel,
        additionalFindings: data.additionalFindings,
        verifiedBy: 'Dr. James Patterson',
        verifiedByRole: 'director',
        verifiedAt: new Date().toISOString()
      }
    })
    
    // Update local state
    setAllReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
    
    // Send notification to CEO
    await NotificationService.sendVerificationNotification(
      reviewId,
      review.memberFirm,
      'ceo@qa-review.com'
    )
  }
  
  // Filter reviews needing TD action
  const pendingVerification = useMemo(() => 
    allReviews.filter(r => r.workflowStatus === 'submitted_for_verification'),
    [allReviews]
  )
  
  const verifiedReviews = useMemo(() => 
    allReviews.filter(r => 
      r.workflowStatus === 'verified_pending_final' ||
      (r.workflowStatus === 'completed' && r.technicalDirectorVerification)
    ),
    [allReviews]
  )
  
  // Stats
  const stats = {
    pendingVerification: pendingVerification.length,
    verified: verifiedReviews.length,
    thisMonth: verifiedReviews.filter(r => {
      const verifiedDate = r.technicalDirectorVerification?.verifiedAt
      if (!verifiedDate) return false
      const date = new Date(verifiedDate)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length,
    avgTimeToVerify: '2.3 days' // Mock stat
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Technical Director Dashboard</h1>
            <p className="text-muted-foreground">
              Review and verify submitted quality assessments
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-violet-600">{stats.pendingVerification}</div>
                <p className="text-xs text-muted-foreground">Pending Verification</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
                <p className="text-xs text-muted-foreground">Total Verified</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.thisMonth}</div>
                <p className="text-xs text-muted-foreground">Verified This Month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.avgTimeToVerify}</div>
                <p className="text-xs text-muted-foreground">Avg Time to Verify</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Verification - PRIORITY */}
          <TaskCard
            title="Reviews Pending Verification"
            description="Reviews submitted by reviewers waiting for your approval"
            count={pendingVerification.length}
            variant={pendingVerification.length > 0 ? "urgent" : "default"}
            icon={<Shield className="h-5 w-5 text-violet-600" />}
          >
            {pendingVerification.length > 0 ? (
              <div className="space-y-2">
                {pendingVerification.map((review) => (
                  <TaskItem
                    key={review.id}
                    title={review.memberFirm}
                    subtitle={`Reviewer: ${review.reviewer} • Grade: ${review.reviewerRating?.grade}/5 • Submitted: ${formatDate(review.reviewerRating?.submittedAt || review.lastUpdated, DATE_FORMATS.DISPLAY)}`}
                    badge={
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-violet-600">
                          Grade {review.reviewerRating?.grade}
                        </span>
                        <WorkflowStatusBadge status={review.workflowStatus} size="sm" />
                      </div>
                    }
                    onClick={() => handleOpenVerification(review)}
                  />
                ))}
              </div>
            ) : (
              <EmptyTaskState
                message="No reviews pending verification. All caught up!"
                icon={<CheckCircle2 className="h-8 w-8" />}
              />
            )}
          </TaskCard>

          {/* Recently Verified */}
          {verifiedReviews.length > 0 && (
            <TaskCard
              title="Recently Verified Reviews"
              description="Reviews you've verified and sent to CEO"
              count={verifiedReviews.length}
              variant="success"
              icon={<Award className="h-5 w-5 text-green-600" />}
            >
              <div className="space-y-2">
                {verifiedReviews.slice(0, 5).map((review) => (
                  <TaskItem
                    key={review.id}
                    title={review.memberFirm}
                    subtitle={`Your Grade: ${review.technicalDirectorVerification?.grade}/5 ${review.technicalDirectorVerification?.modified ? '(Modified from ' + review.technicalDirectorVerification.originalReviewerGrade + ')' : '(Confirmed)'} • ${formatDate(review.technicalDirectorVerification?.verifiedAt || review.lastUpdated, DATE_FORMATS.DISPLAY)}`}
                    badge={<WorkflowStatusBadge status={review.workflowStatus} size="sm" />}
                  />
                ))}
                {verifiedReviews.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    +{verifiedReviews.length - 5} more verified reviews
                  </p>
                )}
              </div>
            </TaskCard>
          )}

          {/* Performance Stats */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Verification Statistics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Grade Modifications</p>
                  <p className="font-semibold">
                    {verifiedReviews.filter(r => r.technicalDirectorVerification?.modified).length} of {verifiedReviews.length}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Full Agreement</p>
                  <p className="font-semibold">
                    {verifiedReviews.filter(r => r.technicalDirectorVerification?.agreementLevel === 'full').length} of {verifiedReviews.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Verification Drawer */}
      <VerificationDrawer
        open={verificationDrawerOpen}
        onOpenChange={setVerificationDrawerOpen}
        review={selectedReviewForVerification}
        onVerify={handleVerifyReview}
      />
    </DashboardLayout>
  )
}
