"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Download,
  BarChart3,
  Target,
  Award,
  Star,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { mockReviews } from "@/lib/mock-data"

export default function CEODashboardPage() {
  // Calculate stats from mock data
  const stats = {
    total: mockReviews.length,
    completed: mockReviews.filter(r => r.status === 'Completed').length,
    inProgress: mockReviews.filter(r => r.status === 'In Progress').length,
    pending: mockReviews.filter(r => r.status === 'Pending').length,
    overdue: mockReviews.filter(r => r.status === 'Overdue').length,
    readyForCEO: mockReviews.filter(r => r.status === 'Submitted').length,
    highPriority: mockReviews.filter(r => r.priority === 'High').length,
    excellentGrades: mockReviews.filter(r => r.currentGrade === '1').length,
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
            <p className="text-muted-foreground">
              Strategic overview and executive insights for QA review management.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  Ready for CEO approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground">
                  Being reviewed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <Target className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
                <p className="text-xs text-muted-foreground">
                  Urgent reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Excellent</CardTitle>
                <Award className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.excellentGrades}</div>
                <p className="text-xs text-muted-foreground">
                  Grade 1 reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  Not started
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <TrendingUp className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                <p className="text-xs text-muted-foreground">
                  Past due date
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CEO Reviews</CardTitle>
                <Star className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.readyForCEO}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Executive Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Final Approvals</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/ceo/final-reviews">
                    <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                      <Award className="h-4 w-4 mr-2" />
                      CEO Approval
                    </Button>
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {stats.readyForCEO} reviews ready for final approval
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Strategic Reports</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Export</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((stats.completed / stats.total) * 100)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Completion Rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* High Priority Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>High Priority Reviews</CardTitle>
              <CardDescription>
                Urgent reviews requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReviews.filter(r => r.priority === 'High').slice(0, 5).map((review) => (
                  <div key={review.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-red-600">
                          {review.memberFirm.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.memberFirm}</p>
                        <p className="text-xs text-gray-500">{review.type} • {review.reviewer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">High Priority</Badge>
                      <Badge variant="outline">
                        {review.currentGrade}
                      </Badge>
                    </div>
                  </div>
                ))}
                {stats.highPriority === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No high priority reviews at this time
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and actions in the QA review system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {review.memberFirm.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.memberFirm}</p>
                        <p className="text-xs text-gray-500">{review.type} • {review.reviewer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={review.status === 'Completed' ? 'default' : 'secondary'}>
                        {review.status}
                      </Badge>
                      <Badge variant="outline">
                        {review.currentGrade}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
