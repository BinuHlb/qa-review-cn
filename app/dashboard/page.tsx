"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { 
  DashboardStatsGrid, 
  QuickActionsCard, 
  RecentActivityCard,
  type DashboardStat,
  type QuickAction,
  type ActivityItem
} from "@/components/common"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ClipboardList, 
  Users, 
  Building2, 
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  UserPlus,
  Activity
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import workflowMockReviews from "@/lib/mock-data-workflow"
import { mockReviewers } from "@/lib/reviewers-mock-data"
import { mockMemberFirms } from "@/lib/member-firms-mock-data"
import { formatRelativeDate } from "@/lib/utils/formatters"

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  // Calculate statistics
  const stats = useMemo(() => {
    const reviews = workflowMockReviews
    const totalReviews = reviews.length
    const pendingAcceptance = reviews.filter(r => 
      r.workflowStatus === 'pending_acceptance' || r.workflowStatus === 'reviewer_accepted'
    ).length
    const inProgress = reviews.filter(r => r.workflowStatus === 'in_progress').length
    const awaitingVerification = reviews.filter(r => r.workflowStatus === 'submitted_for_verification').length
    const completed = reviews.filter(r => r.workflowStatus === 'completed').length
    const overdue = reviews.filter(r => r.isOverdue).length
    
    const totalReviewers = mockReviewers.length
    const activeReviewers = mockReviewers.filter(r => r.status === 'active').length
    
    const totalFirms = mockMemberFirms.length
    const activeFirms = mockMemberFirms.filter(f => f.status === 'active').length
    
    const completionRate = totalReviews > 0 ? Math.round((completed / totalReviews) * 100) : 0
    
    return {
      totalReviews,
      pendingAcceptance,
      inProgress,
      awaitingVerification,
      completed,
      overdue,
      totalReviewers,
      activeReviewers,
      totalFirms,
      activeFirms,
      completionRate
    }
  }, [])

  // Main stats configuration
  const mainStats: DashboardStat[] = useMemo(() => [
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      subtitle: (
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          +12.5% from last {selectedPeriod}
        </span>
      ),
      icon: ClipboardList,
      onClick: () => router.push('/admin/reviews')
    },
    {
      title: "Pending Actions",
      value: stats.pendingAcceptance + stats.awaitingVerification,
      subtitle: `${stats.pendingAcceptance} awaiting acceptance`,
      icon: Clock,
      variant: stats.pendingAcceptance > 0 ? "warning" : "default",
      onClick: () => router.push('/admin/reviews?pending=true')
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      subtitle: "Active reviews",
      icon: Activity,
      onClick: () => router.push('/admin/reviews?status=in_progress')
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      subtitle: (
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          +5.3% from last {selectedPeriod}
        </span>
      ),
      icon: CheckCircle,
      variant: "success",
      onClick: () => router.push('/admin/reviews?status=completed')
    }
  ], [stats, selectedPeriod, router])

  // Secondary stats configuration
  const secondaryStats: DashboardStat[] = useMemo(() => [
    {
      title: "Active Reviewers",
      value: stats.activeReviewers,
      subtitle: `of ${stats.totalReviewers} total`,
      icon: Users,
      onClick: () => router.push('/admin/reviewers')
    },
    {
      title: "Member Firms",
      value: stats.activeFirms,
      subtitle: `of ${stats.totalFirms} active`,
      icon: Building2,
      onClick: () => router.push('/admin/member-firms')
    },
    {
      title: "For Verification",
      value: stats.awaitingVerification,
      subtitle: "Awaiting TD review",
      icon: FileText,
      onClick: () => router.push('/admin/reviews?status=submitted_for_verification')
    },
    {
      title: "Overdue Reviews",
      value: stats.overdue,
      subtitle: "Require attention",
      icon: AlertCircle,
      variant: stats.overdue > 0 ? "destructive" : "default",
      onClick: () => router.push('/admin/reviews?overdue=true')
    }
  ], [stats, router])

  // Quick actions configuration
  const quickActions: QuickAction[] = useMemo(() => [
    {
      title: "Manage QA Reviews",
      description: `${stats.totalReviews} total reviews`,
      icon: ClipboardList,
      onClick: () => router.push('/admin/reviews')
    },
    {
      title: "Manage Reviewers",
      description: `${stats.activeReviewers} active reviewers`,
      icon: UserPlus,
      onClick: () => router.push('/admin/reviewers')
    },
    {
      title: "Member Firms",
      description: `${stats.activeFirms} active firms`,
      icon: Building2,
      onClick: () => router.push('/admin/member-firms')
    },
    {
      title: "Final Reviews",
      description: "CEO approval pending",
      icon: Star,
      onClick: () => router.push('/admin/final-reviews')
    }
  ], [stats, router])

  // Recent activity
  const recentActivity: ActivityItem[] = useMemo(() => {
    return [...workflowMockReviews]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 6)
      .map(review => ({
        id: review.id,
        title: review.memberFirm,
        subtitle: review.workflowStatus?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '',
        badge: `${review.reviewType}h`,
        timestamp: formatRelativeDate(review.lastUpdated),
        avatarText: review.memberFirm.substring(0, 2).toUpperCase(),
        onClick: () => router.push('/admin/reviews')
      }))
  }, [router])

  return (
    <DashboardLayout noPadding>
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Admin'}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your QA review system.
          </p>
        </div>

        {/* Overdue Alert */}
        {stats.overdue > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive mb-1">Attention Required</h3>
                  <p className="text-sm text-muted-foreground">
                    You have <strong className="text-destructive">{stats.overdue} overdue review(s)</strong> that require immediate attention.
                  </p>
                </div>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => router.push('/admin/reviews?overdue=true')}
                >
                  View Overdue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">View:</span>
          <Button
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </Button>
          <Button
            variant={selectedPeriod === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('year')}
          >
            Year
          </Button>
        </div>

        {/* Main Stats */}
        <DashboardStatsGrid stats={mainStats} columns={4} />

        {/* Secondary Stats */}
        <DashboardStatsGrid stats={secondaryStats} columns={4} />

        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Quick Actions */}
          <QuickActionsCard
            title="Quick Actions"
            description="Common administrative tasks"
            actions={quickActions}
          />

          {/* Recent Activity */}
          <RecentActivityCard
            title="Recent Activity"
            description="Latest updates across all reviews"
            items={recentActivity}
            maxItems={6}
            onViewAll={() => router.push('/admin/reviews')}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
