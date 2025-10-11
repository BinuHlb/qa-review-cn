"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  ArrowRight,
  FileText,
  UserPlus,
  Bell,
  Activity
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import workflowMockReviews from "@/lib/mock-data-workflow"
import { mockReviewers } from "@/lib/reviewers-mock-data"
import { mockMemberFirms } from "@/lib/member-firms-mock-data"

export default function Page() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  // Calculate statistics
  const stats = useMemo(() => {
    const reviews = workflowMockReviews
    const totalReviews = reviews.length
    const pendingAcceptance = reviews.filter(r => r.workflowStatus === 'pending_acceptance').length
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

  // Recent activity (last 5 reviews updated)
  const recentActivity = useMemo(() => {
    return [...workflowMockReviews]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5)
  }, [])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending_acceptance': 'bg-amber-500',
      'in_progress': 'bg-blue-500',
      'submitted_for_verification': 'bg-purple-500',
      'verified_pending_final': 'bg-indigo-500',
      'completed': 'bg-green-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <DashboardLayout noPadding>
      <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'Admin'}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s what&apos;s happening with your QA reviews today.
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <Button
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('week')}
              className="transition-all duration-200"
            >
              Week
            </Button>
            <Button
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('month')}
              className="transition-all duration-200"
            >
              Month
            </Button>
            <Button
              variant={selectedPeriod === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('year')}
              className="transition-all duration-200"
            >
              Year
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Reviews */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Reviews
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReviews}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span>+12.5% from last {selectedPeriod}</span>
                </p>
              </CardContent>
            </Card>

            {/* Pending Actions */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-l-4 border-l-amber-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Actions
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingAcceptance + stats.awaitingVerification}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.pendingAcceptance} awaiting acceptance
                </p>
              </CardContent>
            </Card>

            {/* In Progress */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <Activity className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active reviews
                </p>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completionRate}%</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span>+5.3% from last {selectedPeriod}</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Reviewers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeReviewers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  of {stats.totalReviewers} total
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Member Firms
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeFirms}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  of {stats.totalFirms} active
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overdue Reviews
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Require attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-3 hover:bg-primary/5 hover:border-primary transition-all duration-200"
                  onClick={() => router.push('/admin/reviews')}
                >
                  <ClipboardList className="h-5 w-5 mr-3 text-blue-500" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Manage QA Reviews</div>
                    <div className="text-xs text-muted-foreground">{stats.totalReviews} total reviews</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-3 hover:bg-primary/5 hover:border-primary transition-all duration-200"
                  onClick={() => router.push('/admin/reviewers')}
                >
                  <UserPlus className="h-5 w-5 mr-3 text-green-500" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Manage Reviewers</div>
                    <div className="text-xs text-muted-foreground">{stats.activeReviewers} active reviewers</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-3 hover:bg-primary/5 hover:border-primary transition-all duration-200"
                  onClick={() => router.push('/admin/member-firms')}
                >
                  <Building2 className="h-5 w-5 mr-3 text-purple-500" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Member Firms</div>
                    <div className="text-xs text-muted-foreground">{stats.activeFirms} active firms</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-3 hover:bg-primary/5 hover:border-primary transition-all duration-200"
                  onClick={() => router.push('/admin/final-reviews')}
                >
                  <Star className="h-5 w-5 mr-3 text-amber-500" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Final Reviews</div>
                    <div className="text-xs text-muted-foreground">CEO approval pending</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates across all reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((review) => (
                    <div
                      key={review.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                      onClick={() => router.push('/admin/reviews')}
                    >
                      <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${getStatusColor(review.workflowStatus || '')}`} />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{review.memberFirm}</p>
                          <Badge variant="outline" className="text-xs">
                            {review.reviewType}h
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {review.workflowStatus?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {getTimeAgo(review.lastUpdated)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Status Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card 
              className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
              onClick={() => router.push('/admin/reviews?status=pending_acceptance')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Acceptance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.pendingAcceptance}</div>
                  <Clock className="h-8 w-8 text-amber-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
              onClick={() => router.push('/admin/reviews?status=in_progress')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.inProgress}</div>
                  <Activity className="h-8 w-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
              onClick={() => router.push('/admin/reviews?status=submitted_for_verification')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  For Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.awaitingVerification}</div>
                  <FileText className="h-8 w-8 text-purple-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
              onClick={() => router.push('/admin/reviews?status=completed')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                  <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] border-destructive/50"
              onClick={() => router.push('/admin/reviews?overdue=true')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-destructive">
                  Overdue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-destructive">{stats.overdue}</div>
                  <AlertCircle className="h-8 w-8 text-destructive opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Notifications */}
          {stats.overdue > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Attention Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  You have <strong>{stats.overdue} overdue review(s)</strong> that require immediate attention.
                  <Button 
                    variant="link" 
                    className="h-auto p-0 ml-2 text-destructive"
                    onClick={() => router.push('/admin/reviews?overdue=true')}
                  >
                    View overdue reviews →
                  </Button>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
    </DashboardLayout>
  )
}
