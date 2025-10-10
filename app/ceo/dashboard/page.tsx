"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { TaskCard, TaskItem, EmptyTaskState } from "@/components/shared/task-card"
import { WorkflowStatusBadge } from "@/components/shared/workflow-status-badge"
import { Button } from "@/components/ui/button"
import { 
  Award,
  CheckCircle2,
  TrendingUp,
  Star,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import workflowMockReviews from "@/lib/mock-data-workflow"
import { formatDate } from "@/lib/utils/formatters"
import { DATE_FORMATS } from "@/lib/constants"

export default function CEODashboardPage() {
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
  const stats = {
    total: workflowMockReviews.length,
    pendingFinal: pendingFinal.length,
    completed: completedReviews.length,
    thisQuarter: completedReviews.filter(r => {
      const finalizedDate = r.ceoFinalReview?.finalizedAt
      if (!finalizedDate) return false
      const date = new Date(finalizedDate)
      const now = new Date()
      const currentQuarter = Math.floor(now.getMonth() / 3)
      const reviewQuarter = Math.floor(date.getMonth() / 3)
      return reviewQuarter === currentQuarter && date.getFullYear() === now.getFullYear()
    }).length,
    excellentGrades: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '1').length
  }

  // Grade distribution
  const gradeDistribution = {
    grade1: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '1').length,
    grade2: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '2').length,
    grade3: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '3').length,
    grade4: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '4').length,
    grade5: completedReviews.filter(r => r.ceoFinalReview?.finalGrade === '5').length
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="space-y-6 p-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
            <p className="text-muted-foreground">
              Final approval and strategic oversight of QA reviews
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-indigo-600">{stats.pendingFinal}</div>
                <p className="text-xs text-muted-foreground">Pending Final Approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">Completed Reviews</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.thisQuarter}</div>
                <p className="text-xs text-muted-foreground">Finalized This Quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">{stats.excellentGrades}</div>
                <p className="text-xs text-muted-foreground">Excellence Awards (Grade 1)</p>
              </CardContent>
            </Card>
          </div>

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
                <Link href="/ceo/final-reviews">
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Go to Final Reviews
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <EmptyTaskState
                message="No reviews pending final approval"
                icon={<CheckCircle2 className="h-8 w-8" />}
              />
            )}
          </TaskCard>

          {/* Grade Distribution */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-5 w-5 text-yellow-600" />
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
                  <span className="font-semibold text-yellow-600">{gradeDistribution.grade3}</span>
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
              description="Reviews you've finalized"
              count={stats.thisQuarter}
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
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Executive Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((stats.completed / stats.total) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Excellence Rate</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.completed > 0 ? Math.round((stats.excellentGrades / stats.completed) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
