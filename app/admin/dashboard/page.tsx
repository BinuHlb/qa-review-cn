"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
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
import { cn } from "@/lib/utils"

export default function AdminDashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  // Calculate statistics
  const stats = useMemo(() => {
    const reviews = workflowMockReviews
    const totalReviews = reviews.length
    const pendingAcceptance = reviews.filter(r => r.workflowStatus === 'pending_acceptance' || r.workflowStatus === 'reviewer_accepted').length
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
    
    // Calculate average review time (mock)
    const avgReviewTime = 12 // days
    
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

  // Recent activity (last 6 reviews updated)
  const recentActivity = useMemo(() => {
    return [...workflowMockReviews]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 6)
  }, [])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending_acceptance': 'bg-amber-500',
      'reviewer_accepted': 'bg-amber-400',
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

  const urgentActions = useMemo(() => {
    return [
      { 
        count: stats.overdue, 
        label: 'Overdue Reviews', 
        action: 'Review Now',
        color: 'destructive',
        href: '/admin/reviews?overdue=true'
      },
      { 
        count: stats.pendingAcceptance, 
        label: 'Pending Acceptance', 
        action: 'View',
        color: 'amber',
        href: '/admin/reviews?status=pending_acceptance'
      },
      { 
        count: stats.awaitingFinal, 
        label: 'Awaiting Final Approval', 
        action: 'Approve',
        color: 'indigo',
        href: '/admin/final-reviews'
      }
    ].filter(item => item.count > 0)
  }, [stats])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        
        <div className="flex-1 overflow-auto p-6 space-y-6 animate-in fade-in-50 duration-500">
          {/* Welcome Section with Animation */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight animate-in slide-in-from-left-5 duration-300">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'Admin'}! 👋
            </h1>
            <p className="text-muted-foreground animate-in slide-in-from-left-5 duration-300 delay-75">
              Here&apos;s an overview of your QA review system.
            </p>
          </div>

          {/* Urgent Actions Banner */}
          {urgentActions.length > 0 && (
            <Card className="border-amber-200 dark:border-amber-900 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 animate-in slide-in-from-top-5 duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                  <Zap className="h-5 w-5 animate-pulse" />
                  Urgent Actions Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  {urgentActions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-background/80 backdrop-blur rounded-lg border hover:border-primary transition-all duration-200 hover:scale-[1.02]"
                    >
                      <div>
                        <div className="text-2xl font-bold">{action.count}</div>
                        <div className="text-xs text-muted-foreground">{action.label}</div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={action.color === 'destructive' ? 'destructive' : 'default'}
                        onClick={() => router.push(action.href)}
                      >
                        {action.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Period Selector */}
          <div className="flex items-center gap-2 animate-in slide-in-from-left-5 duration-300 delay-150">
            <span className="text-sm text-muted-foreground">View:</span>
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

          {/* Main Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in slide-in-from-bottom-5 duration-500">
            {/* Total Reviews */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-l-4 border-l-blue-500 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Reviews
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
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
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-l-4 border-l-amber-500 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Actions
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform duration-200" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingAcceptance + stats.awaitingVerification + stats.awaitingFinal}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Require your attention
                </p>
              </CardContent>
            </Card>

            {/* In Progress */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-l-4 border-l-purple-500 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <Activity className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform duration-200" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active reviews
                </p>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-l-4 border-l-green-500 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform duration-200" />
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
          <div className="grid gap-4 md:grid-cols-4 animate-in slide-in-from-bottom-5 duration-500 delay-100">
            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
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

            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
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

            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Review Time
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgReviewTime}d</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span>-2 days</span>
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
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
          <div className="grid gap-4 md:grid-cols-2 animate-in fade-in-50 duration-700 delay-200">
            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all duration-200 hover:translate-x-1"
                  onClick={() => router.push('/admin/reviews')}
                >
                  <ClipboardList className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Manage QA Reviews</div>
                    <div className="text-xs text-muted-foreground">{stats.totalReviews} total reviews</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all duration-200 hover:translate-x-1"
                  onClick={() => router.push('/admin/reviewers')}
                >
                  <UserPlus className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Manage Reviewers</div>
                    <div className="text-xs text-muted-foreground">{stats.activeReviewers} active reviewers</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all duration-200 hover:translate-x-1"
                  onClick={() => router.push('/admin/member-firms')}
                >
                  <Building2 className="h-5 w-5 mr-3 text-purple-500 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Member Firms</div>
                    <div className="text-xs text-muted-foreground">{stats.activeFirms} active firms</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all duration-200 hover:translate-x-1"
                  onClick={() => router.push('/admin/final-reviews')}
                >
                  <Star className="h-5 w-5 mr-3 text-amber-500 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Final Reviews</div>
                    <div className="text-xs text-muted-foreground">{stats.awaitingFinal} awaiting approval</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all duration-200 hover:translate-x-1"
                  onClick={() => router.push('/admin/settings')}
                >
                  <BarChart3 className="h-5 w-5 mr-3 text-cyan-500 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Analytics & Reports</div>
                    <div className="text-xs text-muted-foreground">View detailed insights</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates across all reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((review, index) => (
                    <div
                      key={review.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
                        "hover:bg-muted/80 hover:translate-x-1",
                        "animate-in slide-in-from-right-5 fade-in-50"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => router.push('/admin/reviews')}
                    >
                      <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${getStatusColor(review.workflowStatus || '')} animate-pulse`} />
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {review.memberFirm.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{review.memberFirm}</p>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {review.reviewType}h
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">
                          {review.workflowStatus?.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {getTimeAgo(review.lastUpdated)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-4"
                  onClick={() => router.push('/admin/reviews')}
                >
                  View All Activity
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Status Cards */}
          <Card className="shadow-sm animate-in slide-in-from-bottom-5 duration-500 delay-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Workflow Pipeline
              </CardTitle>
              <CardDescription>Review status breakdown by workflow stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-5">
                <button 
                  className="group p-4 rounded-lg border-2 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 hover:shadow-md transition-all duration-200 hover:scale-[1.05] text-left"
                  onClick={() => router.push('/admin/reviews?status=pending_acceptance')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-5 w-5 text-amber-600 group-hover:scale-110 transition-transform" />
                    <ArrowRight className="h-4 w-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.pendingAcceptance}</div>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Pending Acceptance</p>
                </button>

                <button 
                  className="group p-4 rounded-lg border-2 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 hover:shadow-md transition-all duration-200 hover:scale-[1.05] text-left"
                  onClick={() => router.push('/admin/reviews?status=in_progress')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <ArrowRight className="h-4 w-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.inProgress}</div>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">In Progress</p>
                </button>

                <button 
                  className="group p-4 rounded-lg border-2 border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20 hover:shadow-md transition-all duration-200 hover:scale-[1.05] text-left"
                  onClick={() => router.push('/admin/reviews?status=submitted_for_verification')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                    <ArrowRight className="h-4 w-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.awaitingVerification}</div>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">For Verification</p>
                </button>

                <button 
                  className="group p-4 rounded-lg border-2 border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 hover:shadow-md transition-all duration-200 hover:scale-[1.05] text-left"
                  onClick={() => router.push('/admin/final-reviews')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Star className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <ArrowRight className="h-4 w-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{stats.awaitingFinal}</div>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">Awaiting Final</p>
                </button>

                <button 
                  className="group p-4 rounded-lg border-2 border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20 hover:shadow-md transition-all duration-200 hover:scale-[1.05] text-left"
                  onClick={() => router.push('/admin/reviews?status=completed')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                    <ArrowRight className="h-4 w-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.completed}</div>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">Completed</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
