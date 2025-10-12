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
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  UserPlus,
  Activity,
  BarChart3,
  Calendar,
  Zap
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import workflowMockReviews from "@/lib/mock-data-workflow"
import { mockReviewers } from "@/lib/reviewers-mock-data"
import { mockMemberFirms } from "@/lib/member-firms-mock-data"
import { formatRelativeDate } from "@/lib/utils/formatters"

export default function AdminDashboardPage() {
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
    const awaitingFinal = reviews.filter(r => r.workflowStatus === 'verified_pending_final').length
    const completed = reviews.filter(r => r.workflowStatus === 'completed').length
    const overdue = reviews.filter(r => r.isOverdue).length
    
    const totalReviewers = mockReviewers.length
    const activeReviewers = mockReviewers.filter(r => r.status === 'active').length
    
    const totalFirms = mockMemberFirms.length
    const activeFirms = mockMemberFirms.filter(f => f.status === 'active').length
    
    const completionRate = totalReviews > 0 ? Math.round((completed / totalReviews) * 100) : 0
    const avgReviewTime = 12 // days (mock)
    
    return {
      totalReviews,
      pendingAcceptance,
      inProgress,
      awaitingVerification,
      awaitingFinal,
      completed,
      overdue,
      totalReviewers,
      activeReviewers,
      totalFirms,
      activeFirms,
      completionRate,
      avgReviewTime
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
      value: stats.pendingAcceptance + stats.awaitingVerification + stats.awaitingFinal,
      subtitle: "Require attention",
      icon: Clock,
      variant: (stats.pendingAcceptance + stats.awaitingVerification) > 5 ? "warning" : "default",
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
      title: "Avg Review Time",
      value: `${stats.avgReviewTime}d`,
      subtitle: (
        <span className="flex items-center gap-1">
          <TrendingDown className="h-3 w-3 text-green-500" />
          -2 days
        </span>
      ),
      icon: Calendar,
      onClick: () => router.push('/admin/reviews')
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

  // Workflow pipeline stats
  const workflowStats: DashboardStat[] = useMemo(() => [
    {
      title: "Pending Acceptance",
      value: stats.pendingAcceptance,
      icon: Clock,
      onClick: () => router.push('/admin/reviews?status=pending_acceptance')
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Activity,
      onClick: () => router.push('/admin/reviews?status=in_progress')
    },
    {
      title: "For Verification",
      value: stats.awaitingVerification,
      icon: FileText,
      onClick: () => router.push('/admin/reviews?status=submitted_for_verification')
    },
    {
      title: "Awaiting Final",
      value: stats.awaitingFinal,
      icon: Star,
      onClick: () => router.push('/admin/final-reviews')
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      variant: "success",
      onClick: () => router.push('/admin/reviews?status=completed')
    }
  ], [stats, router])

  // Quick actions with all tools
  const allQuickActions: QuickAction[] = useMemo(() => [
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
      description: `${stats.awaitingFinal} awaiting approval`,
      icon: Star,
      onClick: () => router.push('/admin/final-reviews')
    },
    {
      title: "Analytics & Reports",
      description: "View detailed insights",
      icon: BarChart3,
      onClick: () => router.push('/admin/settings')
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

        {/* Urgent Actions Alert */}
        {stats.overdue > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Zap className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive mb-1">Urgent Actions Required</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.overdue} overdue reviews and {stats.pendingAcceptance} pending acceptance require your attention.
                  </p>
                </div>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => router.push('/admin/reviews?overdue=true')}
                >
                  View Now
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
            actions={allQuickActions}
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

        {/* Workflow Pipeline */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Workflow Pipeline</h3>
              </div>
              <DashboardStatsGrid stats={workflowStats} columns={5} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
