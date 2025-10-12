"use client"

import { useMemo } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { DashboardStatsGrid, type DashboardStat } from "@/components/common"
import { Card, CardContent } from "@/components/ui/card"
import { TaskCard, TaskItem, EmptyTaskState } from "@/components/common/task-card"
import { WorkflowStatusBadge } from "@/components/common/workflow-status-badge"
import { 
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Award,
  TrendingUp
} from "lucide-react"
import workflowMockReviews from "@/lib/mock-data-workflow"
import { formatDate } from "@/lib/utils/formatters"
import { DATE_FORMATS } from "@/lib/constants"
import { useSession } from "next-auth/react"

export default function FirmDashboardPage() {
  const { data: session } = useSession()
  
  // Get current firm info from session (in real app)
  const currentFirmName = session?.user?.name || 'Smith & Associates'
  
  // Filter reviews for current firm
  const myReviews = useMemo(() => 
    workflowMockReviews.filter(r => r.memberFirm === currentFirmName),
    [currentFirmName]
  )
  
  // Categorize reviews
  const pendingReviews = useMemo(() => 
    myReviews.filter(r => 
      r.workflowStatus === 'pending_acceptance' || 
      r.workflowStatus === 'reviewer_accepted'
    ),
    [myReviews]
  )
  
  const activeReviews = useMemo(() => 
    myReviews.filter(r => 
      r.workflowStatus === 'in_progress' || 
      r.workflowStatus === 'accepted'
    ),
    [myReviews]
  )
  
  const underReview = useMemo(() => 
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
      subtitle: "All time",
      icon: FileText,
      onClick: () => {}
    },
    {
      title: "Pending Action",
      value: pendingReviews.length,
      subtitle: "Require response",
      icon: AlertCircle,
      variant: pendingReviews.length > 0 ? "warning" : "default",
      onClick: () => {}
    },
    {
      title: "Under Review",
      value: activeReviews.length + underReview.length,
      subtitle: "In progress",
      icon: Clock,
      onClick: () => {}
    },
    {
      title: "Completed",
      value: completedReviews.length,
      subtitle: "Finalized",
      icon: CheckCircle2,
      variant: "success",
      onClick: () => {}
    }
  ], [myReviews.length, pendingReviews.length, activeReviews.length, underReview.length, completedReviews.length])
  
  // Grade distribution for completed reviews
  const gradeDistribution = useMemo(() => ({
    grade1: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '1').length,
    grade2: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '2').length,
    grade3: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '3').length,
    grade4: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '4').length,
    grade5: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '5').length,
    avgGrade: completedReviews.length > 0 
      ? (completedReviews.reduce((sum, r) => sum + parseInt(r.ceoFinalReview?.finalGrade || r.currentGrade || '3'), 0) / completedReviews.length).toFixed(1)
      : '0'
  }), [completedReviews])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Firm Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome to {currentFirmName}. Track your compliance and review status.
          </p>
        </div>

        {/* Stats Overview */}
        <DashboardStatsGrid stats={mainStats} columns={4} />

        {/* Pending Acceptance */}
        {pendingReviews.length > 0 && (
          <TaskCard
            title="Pending Acceptance"
            description="Review assignments awaiting your confirmation"
            count={pendingReviews.length}
            variant="urgent"
            icon={<AlertCircle className="h-5 w-5 text-amber-600" />}
          >
            <div className="space-y-2">
              {pendingReviews.map((review) => (
                <TaskItem
                  key={review.id}
                  title={`QA Review - ${review.reviewType}-hour ${review.reviewMode}`}
                  subtitle={`Reviewer: ${review.reviewer} • Due: ${formatDate(review.dueDate || review.endDate, DATE_FORMATS.DISPLAY)}`}
                  badge={<WorkflowStatusBadge status={review.workflowStatus} size="sm" />}
                />
              ))}
            </div>
          </TaskCard>
        )}

        {/* Active Reviews */}
        {activeReviews.length > 0 && (
          <TaskCard
            title="Reviews In Progress"
            description="Currently being conducted by reviewers"
            count={activeReviews.length}
            variant="info"
            icon={<FileText className="h-5 w-5 text-blue-600" />}
          >
            <div className="space-y-2">
              {activeReviews.map((review) => (
                <TaskItem
                  key={review.id}
                  title={`${review.reviewType}-hour review`}
                  subtitle={`Reviewer: ${review.reviewer} • Started: ${formatDate(review.assignedAt || review.startDate, DATE_FORMATS.DISPLAY)}`}
                  badge={
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {review.percentage || 0}% complete
                      </span>
                      <WorkflowStatusBadge status={review.workflowStatus} size="sm" />
                    </div>
                  }
                />
              ))}
            </div>
          </TaskCard>
        )}

        {/* Under Final Review */}
        {underReview.length > 0 && (
          <TaskCard
            title="Under Final Review"
            description="Reviews being verified by management"
            count={underReview.length}
            variant="default"
            icon={<Clock className="h-5 w-5 text-muted-foreground" />}
          >
            <div className="space-y-2">
              {underReview.map((review) => (
                <TaskItem
                  key={review.id}
                  title={`${review.reviewType}-hour review`}
                  subtitle={`Submitted: ${formatDate(review.reviewerRating?.submittedAt || review.lastUpdated, DATE_FORMATS.DISPLAY)}`}
                  badge={<WorkflowStatusBadge status={review.workflowStatus} size="sm" />}
                />
              ))}
            </div>
          </TaskCard>
        )}

        {/* Performance Summary */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Your Performance Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Grade</span>
                <span className="text-xl font-bold text-primary">{gradeDistribution.avgGrade}/5</span>
              </div>
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
            </div>
          </CardContent>
        </Card>

        {/* Completed Reviews */}
        {completedReviews.length > 0 && (
          <TaskCard
            title="Completed Reviews"
            description="Successfully finalized reviews"
            count={completedReviews.length}
            variant="success"
            icon={<Award className="h-5 w-5 text-green-600" />}
          >
            <div className="space-y-2">
              {completedReviews.slice(0, 5).map((review) => (
                <TaskItem
                  key={review.id}
                  title={`${review.reviewType}-hour review`}
                  subtitle={`Final Grade: ${review.ceoFinalReview?.finalGrade || review.currentGrade}/5 • Completed: ${formatDate(review.ceoFinalReview?.finalizedAt || review.lastUpdated, DATE_FORMATS.DISPLAY)}`}
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

        {/* Compliance Stats */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Compliance Overview</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {myReviews.length > 0 ? Math.round((completedReviews.length / myReviews.length) * 100) : 0}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Average Grade</p>
                <p className="text-2xl font-bold text-primary">
                  {gradeDistribution.avgGrade}/5
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
