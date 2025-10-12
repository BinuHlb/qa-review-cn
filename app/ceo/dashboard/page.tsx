"use client"

import { useMemo } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { DashboardStatsGrid, type DashboardStat } from "@/components/common"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TaskCard, TaskItem, EmptyTaskState } from "@/components/common/task-card"
import { WorkflowStatusBadge } from "@/components/common/workflow-status-badge"
import { 
  Award,
  CheckCircle2,
  TrendingUp,
  Star,
  ArrowRight,
  Clock,
  FileText
} from "lucide-react"
import { useRouter } from "next/navigation"
import workflowMockReviews from "@/lib/mock-data-workflow"
import { formatDate } from "@/lib/utils/formatters"
import { DATE_FORMATS } from "@/lib/constants"
import { useSession } from "next-auth/react"

export default function CEODashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  // Filter reviews needing CEO action
  const pendingFinal = useMemo(() => 
    workflowMockReviews.filter(r => r.workflowStatus === 'verified_pending_final'),
    []
  )
  
  const completedReviews = useMemo(() => 
    workflowMockReviews.filter(r => r.workflowStatus === 'completed'),
    []
  )
  
  // Calculate stats
  const statsData = useMemo(() => {
    const total = workflowMockReviews.length
    const thisQuarter = completedReviews.filter(r => {
      const finalizedDate = r.ceoFinalReview?.finalizedAt
      if (!finalizedDate) return false
      const date = new Date(finalizedDate)
      const now = new Date()
      const currentQuarter = Math.floor(now.getMonth() / 3)
      const reviewQuarter = Math.floor(date.getMonth() / 3)
      return reviewQuarter === currentQuarter && date.getFullYear() === now.getFullYear()
    }).length
    const excellentGrades = completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '1').length
    const completionRate = total > 0 ? Math.round((completedReviews.length / total) * 100) : 0
    const excellenceRate = completedReviews.length > 0 ? Math.round((excellentGrades / completedReviews.length) * 100) : 0

    return {
      total,
      pendingFinal: pendingFinal.length,
      completed: completedReviews.length,
      thisQuarter,
      excellentGrades,
      completionRate,
      excellenceRate
    }
  }, [pendingFinal, completedReviews])

  // Grade distribution
  const gradeDistribution = useMemo(() => ({
    grade1: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '1').length,
    grade2: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '2').length,
    grade3: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '3').length,
    grade4: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '4').length,
    grade5: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '5').length
  }), [completedReviews])

  // Main stats configuration
  const mainStats: DashboardStat[] = useMemo(() => [
    {
      title: "Pending Final Approval",
      value: statsData.pendingFinal,
      subtitle: "Verified by TD",
      icon: Star,
      variant: statsData.pendingFinal > 0 ? "warning" : "default",
      onClick: () => router.push('/ceo/final-reviews')
    },
    {
      title: "Completed Reviews",
      value: statsData.completed,
      subtitle: "All time",
      icon: CheckCircle2,
      variant: "success",
      onClick: () => router.push('/ceo/final-reviews?status=completed')
    },
    {
      title: "Finalized This Quarter",
      value: statsData.thisQuarter,
      subtitle: "Current quarter",
      icon: Award,
      onClick: () => router.push('/ceo/final-reviews')
    },
    {
      title: "Excellence Awards",
      value: statsData.excellentGrades,
      subtitle: "Grade 1 reviews",
      icon: Award,
      onClick: () => router.push('/ceo/final-reviews?grade=1')
    }
  ], [statsData, router])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-muted-foreground">
            Final approval and strategic oversight of QA reviews
          </p>
        </div>

        {/* Stats Overview */}
        <DashboardStatsGrid stats={mainStats} columns={4} />

        {/* Pending Final Approvals - EXECUTIVE PRIORITY */}
        <TaskCard
          title="Pending Final Approval"
          description="Reviews verified by Technical Director awaiting your decision"
          count={pendingFinal.length}
          variant={pendingFinal.length > 0 ? "urgent" : "default"}
          icon={<Star className="h-5 w-5 text-indigo-600" />}
        >
          {pendingFinal.length > 0 ? (
            <div className="space-y-2">
              {pendingFinal.map((review) => (
                <TaskItem
                  key={review.id}
                  title={review.memberFirm}
                  subtitle={`Reviewer: ${review.reviewerRating?.grade}/5 → TD: ${review.technicalDirectorVerification?.grade}/5 ${review.technicalDirectorVerification?.modified ? '(Modified)' : '(Confirmed)'} • ${formatDate(review.technicalDirectorVerification?.verifiedAt || review.lastUpdated, DATE_FORMATS.DISPLAY)}`}
                  badge={
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-indigo-600">
                        TD Grade {review.technicalDirectorVerification?.grade}
                      </span>
                      <WorkflowStatusBadge status={review.workflowStatus} size="sm" />
                    </div>
                  }
                />
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={() => router.push('/ceo/final-reviews')}
              >
                Go to Final Reviews
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <EmptyTaskState
              message="No reviews pending final approval"
              icon={<CheckCircle2 className="h-8 w-8" />}
            />
          )}
        </TaskCard>

        {/* Grade Distribution */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Final Grade Distribution</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Grade 1 (Excellent)</span>
                <span className="font-semibold text-green-600">{gradeDistribution.grade1}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Grade 2 (Good)</span>
                <span className="font-semibold text-blue-600">{gradeDistribution.grade2}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Grade 3 (Satisfactory)</span>
                <span className="font-semibold text-amber-600">{gradeDistribution.grade3}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Grade 4 (Needs Improvement)</span>
                <span className="font-semibold text-orange-600">{gradeDistribution.grade4}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Grade 5 (Poor)</span>
                <span className="font-semibold text-red-600">{gradeDistribution.grade5}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recently Completed */}
        {completedReviews.length > 0 && (
          <TaskCard
            title="Recently Completed Reviews"
            description="Reviews you've finalized this quarter"
            count={statsData.thisQuarter}
            variant="success"
            icon={<Award className="h-5 w-5 text-green-600" />}
          >
            <div className="space-y-2">
              {completedReviews.slice(0, 5).map((review) => (
                <TaskItem
                  key={review.id}
                  title={review.memberFirm}
                  subtitle={`Final Grade: ${review.ceoFinalReview?.finalGrade}/5 • ${formatDate(review.ceoFinalReview?.finalizedAt || review.lastUpdated, DATE_FORMATS.DISPLAY)}`}
                  badge={<WorkflowStatusBadge status={review.workflowStatus} size="sm" />}
                />
              ))}
              {completedReviews.length > 5 && (
                <p className="text-xs text-center text-muted-foreground pt-2">
                  +{completedReviews.length - 5} more completed reviews
                </p>
              )}
            </div>
          </TaskCard>
        )}

        {/* Performance Overview */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Executive Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {statsData.completionRate}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Excellence Rate</p>
                <p className="text-2xl font-bold text-amber-600">
                  {statsData.excellenceRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
