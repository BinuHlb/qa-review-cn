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
  Activity,
  Sparkles
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
      <div className="flex-1 overflow-auto relative">
        
        <div className="relative p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
          {/* Welcome Section with Glassmorphism */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/40 bg-background/40 backdrop-blur-sm p-4 sm:p-6 md:p-8">
            {/* Multi-layer gradient background for smooth aurora effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none animate-gradient-aurora" />
            <div className="absolute inset-0 bg-gradient-to-tl from-primary/8 via-transparent to-primary/6 pointer-events-none animate-gradient-wave" style={{ animationDelay: '2s' }} />
            <div className="absolute -right-20 -top-20 h-40 w-40 sm:h-60 sm:w-60 rounded-full bg-gradient-radial from-primary/20 to-transparent blur-3xl animate-gradient-radial-pulse" />
            <div className="absolute -left-10 -bottom-10 h-32 w-32 sm:h-48 sm:w-48 rounded-full bg-gradient-radial from-primary/15 to-transparent blur-2xl animate-float-blur" />
             <div className="relative space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg flex-shrink-0 animate-gradient-pulse-breathe">
                  <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/40 to-transparent animate-gradient-radial-pulse" />
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground relative z-10" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ">
                    Welcome back, {session?.user?.name?.split(' ')[0] || 'Admin'}! 👋
                  </h1>
                  <p className="text-muted-foreground mt-1 text-xs sm:text-sm md:text-base lg:text-lg">
                    Here&apos;s what&apos;s happening with your QA reviews today.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Period Selector with Glass Effect */}
          <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-lg sm:rounded-xl bg-background/60 backdrop-blur-md border border-border/40 w-full sm:w-fit">
            <Button
              variant={selectedPeriod === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod('week')}
              className={`flex-1 sm:flex-initial text-xs sm:text-sm transition-all duration-300 ${
                selectedPeriod === 'week' 
                  ? 'shadow-sm' 
                  : 'hover:bg-primary/10'
              }`}
            >
              Week
            </Button>
            <Button
              variant={selectedPeriod === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod('month')}
              className={`flex-1 sm:flex-initial text-xs sm:text-sm transition-all duration-300 ${
                selectedPeriod === 'month' 
                  ? 'shadow-sm' 
                  : 'hover:bg-primary/10'
              }`}
            >
              Month
            </Button>
            <Button
              variant={selectedPeriod === 'year' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod('year')}
              className={`flex-1 sm:flex-initial text-xs sm:text-sm transition-all duration-300 ${
                selectedPeriod === 'year' 
                  ? 'shadow-sm' 
                  : 'hover:bg-primary/10'
              }`}
            >
              Year
            </Button>
          </div>

          {/* Stats Grid with Glassmorphism */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Reviews */}
            <Card className="group relative overflow-hidden transition-all duration-300 md:hover:scale-[1.02] cursor-pointer border border-border/40 bg-background/60 backdrop-blur-md hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-wave" />
              <div className="absolute -right-8 -top-8 h-16 sm:h-24 w-16 sm:w-24 rounded-full bg-blue-500/20 blur-2xl animate-blob-float" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Total Reviews
                </CardTitle>
                <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                  <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl sm:text-3xl font-bold">{stats.totalReviews}</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 mt-1 sm:mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span className="truncate">+12.5% from last {selectedPeriod}</span>
                </p>
              </CardContent>
            </Card>

            {/* Pending Actions */}
            <Card className="group relative overflow-hidden transition-all duration-300 md:hover:scale-[1.02] cursor-pointer border border-border/40 bg-background/60 backdrop-blur-md hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-morph" />
              <div className="absolute -right-8 -top-8 h-16 sm:h-24 w-16 sm:w-24 rounded-full bg-amber-500/20 blur-2xl animate-gradient-spin-scale" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Pending Actions
                </CardTitle>
                <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors duration-300">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl sm:text-3xl font-bold">{stats.pendingAcceptance + stats.awaitingVerification}</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 truncate">
                  {stats.pendingAcceptance} awaiting acceptance
                </p>
              </CardContent>
            </Card>

            {/* In Progress */}
            <Card className="group relative overflow-hidden transition-all duration-300 md:hover:scale-[1.02] cursor-pointer border border-border/40 bg-background/60 backdrop-blur-md hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-flow-diagonal" />
              <div className="absolute -right-8 -top-8 h-16 sm:h-24 w-16 sm:w-24 rounded-full bg-purple-500/20 blur-2xl animate-blob-float" style={{ animationDelay: '1s' }} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  In Progress
                </CardTitle>
                <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-300">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl sm:text-3xl font-bold">{stats.inProgress}</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">
                  Active reviews
                </p>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card className="group relative overflow-hidden transition-all duration-300 md:hover:scale-[1.02] cursor-pointer border border-border/40 bg-background/60 backdrop-blur-md hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-pulse-breathe" />
              <div className="absolute -right-8 -top-8 h-16 sm:h-24 w-16 sm:w-24 rounded-full bg-green-500/20 blur-2xl animate-gradient-spin-scale" style={{ animationDelay: '0.5s' }} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl sm:text-3xl font-bold">{stats.completionRate}%</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 mt-1 sm:mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span className="truncate">+5.3% from last {selectedPeriod}</span>
                </p>
              </CardContent>
            </Card>
          </div>

         

          {/* Main Content Grid with Glass Effect */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            {/* Quick Actions */}
            <Card className="relative overflow-hidden border border-border/40 bg-background/50 backdrop-blur-xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent pointer-events-none animate-gradient-wave" />
              <CardHeader className="relative pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 sm:gap-3 relative">
                <Button 
                  variant="outline" 
                  className="group justify-start h-auto py-2.5 sm:py-3 md:py-4 border-border/40 bg-background/30 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 md:hover:scale-[1.01] transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => router.push('/admin/reviews')}
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300 flex-shrink-0">
                    <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 text-left ml-2 sm:ml-3 min-w-0">
                    <div className="font-semibold text-xs sm:text-sm truncate">Manage QA Reviews</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{stats.totalReviews} total reviews</div>
                  </div>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                </Button>

                <Button 
                  variant="outline" 
                  className="group justify-start h-auto py-2.5 sm:py-3 md:py-4 border-border/40 bg-background/30 backdrop-blur-sm hover:bg-green-500/10 hover:border-green-500/50 md:hover:scale-[1.01] transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => router.push('/admin/reviewers')}
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300 flex-shrink-0">
                    <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                  <div className="flex-1 text-left ml-2 sm:ml-3 min-w-0">
                    <div className="font-semibold text-xs sm:text-sm truncate">Manage Reviewers</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{stats.activeReviewers} active reviewers</div>
                  </div>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                </Button>

                <Button 
                  variant="outline" 
                  className="group justify-start h-auto py-2.5 sm:py-3 md:py-4 border-border/40 bg-background/30 backdrop-blur-sm hover:bg-purple-500/10 hover:border-purple-500/50 md:hover:scale-[1.01] transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => router.push('/admin/member-firms')}
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-300 flex-shrink-0">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                  </div>
                  <div className="flex-1 text-left ml-2 sm:ml-3 min-w-0">
                    <div className="font-semibold text-xs sm:text-sm truncate">Member Firms</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{stats.activeFirms} active firms</div>
                  </div>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                </Button>

                <Button 
                  variant="outline" 
                  className="group justify-start h-auto py-2.5 sm:py-3 md:py-4 border-border/40 bg-background/30 backdrop-blur-sm hover:bg-amber-500/10 hover:border-amber-500/50 md:hover:scale-[1.01] transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => router.push('/admin/final-reviews')}
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors duration-300 flex-shrink-0">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                  </div>
                  <div className="flex-1 text-left ml-2 sm:ml-3 min-w-0">
                    <div className="font-semibold text-xs sm:text-sm truncate">Final Reviews</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground truncate">CEO approval pending</div>
                  </div>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="relative overflow-hidden border border-border/40 bg-background/50 backdrop-blur-xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent pointer-events-none animate-gradient-morph" />
              <CardHeader className="relative pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Latest updates across all reviews</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-2">
                  {recentActivity.map((review) => (
                    <div
                      key={review.id}
                      className="group flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-background/60 backdrop-blur-sm border border-transparent hover:border-border/40 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.98]"
                      onClick={() => router.push('/admin/reviews')}
                    >
                      <div className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full mt-1.5 sm:mt-2 flex-shrink-0 shadow-lg ${getStatusColor(review.workflowStatus || '')}`} />
                      <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <p className="text-xs sm:text-sm font-semibold truncate">{review.memberFirm}</p>
                          <Badge variant="outline" className="text-[10px] sm:text-xs bg-primary/5 backdrop-blur-sm flex-shrink-0 px-1 sm:px-2 h-4 sm:h-5">
                            {review.reviewType}h
                          </Badge>
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                          {review.workflowStatus?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                      </div>
                      <span className="text-[10px] sm:text-xs text-muted-foreground flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300 mt-0.5">
                        {getTimeAgo(review.lastUpdated)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Secondary Stats with Glass Effect */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            <Card className="group relative overflow-hidden border border-border/40 bg-background/50 backdrop-blur-lg hover:shadow-xl transition-all duration-300 md:hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-cyan-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-wave" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Active Reviewers
                </CardTitle>
                <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors duration-300">
                  <Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-xl sm:text-2xl font-bold">{stats.activeReviewers}</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  of {stats.totalReviewers} total
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border border-border/40 bg-background/50 backdrop-blur-lg hover:shadow-xl transition-all duration-300 md:hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-indigo-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-flow-diagonal" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Member Firms
                </CardTitle>
                <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors duration-300">
                  <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-xl sm:text-2xl font-bold">{stats.activeFirms}</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  of {stats.totalFirms} active
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border border-destructive/20 bg-background/50 backdrop-blur-lg hover:shadow-xl hover:shadow-destructive/20 transition-all duration-300 md:hover:scale-[1.01] sm:col-span-3 md:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-pulse-breathe" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Overdue Reviews
                </CardTitle>
                <div className="p-1.5 sm:p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors duration-300">
                  <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-xl sm:text-2xl font-bold text-destructive">{stats.overdue}</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Require attention
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Workflow Status Cards with Glassmorphism */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            <Card 
              className="group relative overflow-hidden border border-border/40 bg-background/50 backdrop-blur-lg hover:shadow-xl transition-all duration-300 cursor-pointer md:hover:scale-[1.03] active:scale-95"
              onClick={() => router.push('/admin/reviews?status=pending_acceptance')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-amber-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-wave" />
              <CardHeader className="pb-2 sm:pb-3 relative">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-2">
                  Pending Acceptance
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-2xl sm:text-3xl font-bold">{stats.pendingAcceptance}</div>
                  <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors duration-300">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group relative overflow-hidden border border-border/40 bg-background/50 backdrop-blur-lg hover:shadow-xl transition-all duration-300 cursor-pointer md:hover:scale-[1.03] active:scale-95"
              onClick={() => router.push('/admin/reviews?status=in_progress')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-blue-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-morph" />
              <CardHeader className="pb-2 sm:pb-3 relative">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-2">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-2xl sm:text-3xl font-bold">{stats.inProgress}</div>
                  <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                    <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group relative overflow-hidden border border-border/40 bg-background/50 backdrop-blur-lg hover:shadow-xl transition-all duration-300 cursor-pointer md:hover:scale-[1.03] active:scale-95"
              onClick={() => router.push('/admin/reviews?status=submitted_for_verification')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-purple-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-flow-diagonal" />
              <CardHeader className="pb-2 sm:pb-3 relative">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-2">
                  For Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-2xl sm:text-3xl font-bold">{stats.awaitingVerification}</div>
                  <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-300">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group relative overflow-hidden border border-border/40 bg-background/50 backdrop-blur-lg hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 cursor-pointer md:hover:scale-[1.03] active:scale-95"
              onClick={() => router.push('/admin/reviews?status=completed')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-green-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-pulse-breathe" />
              <CardHeader className="pb-2 sm:pb-3 relative">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-2">
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
                  <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group relative overflow-hidden border border-destructive/30 bg-background/50 backdrop-blur-lg hover:shadow-xl hover:shadow-destructive/20 transition-all duration-300 cursor-pointer md:hover:scale-[1.03] active:scale-95 col-span-2 sm:col-span-3 lg:col-span-1"
              onClick={() => router.push('/admin/reviews?overdue=true')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-morph" />
              <CardHeader className="pb-2 sm:pb-3 relative">
                <CardTitle className="text-xs sm:text-sm font-medium text-destructive flex items-center gap-2 line-clamp-2">
                  Overdue
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-destructive animate-pulse flex-shrink-0" />
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-2xl sm:text-3xl font-bold text-destructive">{stats.overdue}</div>
                  <div className="p-1.5 sm:p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors duration-300">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Notifications with Glassmorphism */}
          {stats.overdue > 0 && (
            <Card className="relative overflow-hidden border border-destructive/40 bg-destructive/5 backdrop-blur-xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-destructive/5 to-transparent pointer-events-none animate-gradient-wave" />
              <div className="absolute -right-6 sm:-right-12 -top-6 sm:-top-12 h-20 sm:h-32 w-20 sm:w-32 rounded-full bg-destructive/10 blur-3xl animate-blob-float" style={{ animationDelay: '2s' }} />
              <CardHeader className="relative pb-2 sm:pb-3">
                <CardTitle className="flex items-center gap-2 text-destructive text-sm sm:text-base">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-destructive/20 animate-pulse">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  Attention Required
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="text-xs sm:text-sm">
                    You have <strong className="text-destructive">{stats.overdue} overdue review(s)</strong> that require immediate attention.
                  </p>
                  <Button 
                    variant="link" 
                    className="h-auto p-0 sm:ml-2 text-destructive font-semibold hover:underline group inline-flex items-center gap-1 text-xs sm:text-sm justify-start sm:justify-center"
                    onClick={() => router.push('/admin/reviews?overdue=true')}
                  >
                    View overdue reviews
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
