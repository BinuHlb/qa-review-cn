"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { DashboardStatsGrid, type DashboardStat } from "@/components/common"
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
  TrendingUp,
  Clock,
  FileText
} from "lucide-react"
import workflowMockReviews from "@/lib/mock-data-workflow"
import { formatDate } from "@/lib/utils/formatters"
import { DATE_FORMATS } from "@/lib/constants"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function DirectorDashboardPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  
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
    
    const updatedReview = WorkflowService.verifyReview(review, {
      reviewId,
      verification: {
        grade: data.grade as '1' | '2' | '3' | '4' | '5',
        originalReviewerGrade: data.originalGrade as '1' | '2' | '3' | '4' | '5',
        modified: data.modified,
        verificationNotes: data.verificationNotes,
        agreementLevel: data.agreementLevel,
        additionalFindings: data.additionalFindings,
        verifiedBy: session?.user?.name || 'Technical Director',
        verifiedByRole: 'director',
        verifiedAt: new Date().toISOString()
      }
    })
    
    setAllReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
    
    await NotificationService.sendVerificationNotification(
      reviewId,
      review.memberFirm,
      'ceo@qa-review.com'
    )
    
    toast({
      title: "Review Verified",
      description: "Review has been verified and sent to CEO for final approval."
    })
    
    setVerificationDrawerOpen(false)
    setSelectedReviewForVerification(null)
  }
  
  // Filter reviews
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
  const statsData = useMemo(() => {
    const thisMonthVerified = verifiedReviews.filter(r => {
      const verifiedDate = r.technicalDirectorVerification?.verifiedAt
      if (!verifiedDate) return false
      const date = new Date(verifiedDate)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length

    const gradeModifications = verifiedReviews.filter(r => r.technicalDirectorVerification?.modified).length
    const fullAgreement = verifiedReviews.filter(r => r.technicalDirectorVerification?.agreementLevel === 'full').length

    return {
      pendingVerification: pendingVerification.length,
      verified: verifiedReviews.length,
      thisMonth: thisMonthVerified,
      avgTimeToVerify: '2.3 days',
      gradeModifications,
      fullAgreement
    }
  }, [pendingVerification, verifiedReviews])

  // Main stats configuration
  const mainStats: DashboardStat[] = useMemo(() => [
    {
      title: "Pending Verification",
      value: statsData.pendingVerification,
      subtitle: "Submitted by reviewers",
      icon: Shield,
      variant: statsData.pendingVerification > 0 ? "warning" : "default",
      onClick: () => router.push('/director/reviews?status=submitted_for_verification')
    },
    {
      title: "Total Verified",
      value: statsData.verified,
      subtitle: "All time verifications",
      icon: CheckCircle2,
      variant: "success",
      onClick: () => router.push('/director/reviews')
    },
    {
      title: "Verified This Month",
      value: statsData.thisMonth,
      subtitle: "Current month",
      icon: Award,
      onClick: () => router.push('/director/reviews')
    },
    {
      title: "Avg Time to Verify",
      value: statsData.avgTimeToVerify,
      subtitle: "Processing time",
      icon: Clock,
      onClick: () => router.push('/director/reviews')
    }
  ], [statsData, router])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Technical Director Dashboard
          </h1>
          <p className="text-muted-foreground">
            Review and verify submitted quality assessments
          </p>
        </div>

        {/* Stats Overview */}
        <DashboardStatsGrid stats={mainStats} columns={4} />

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
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Verification Statistics</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Grade Modifications</p>
                <p className="font-semibold">
                  {statsData.gradeModifications} of {statsData.verified}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Full Agreement</p>
                <p className="font-semibold">
                  {statsData.fullAgreement} of {statsData.verified}
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
