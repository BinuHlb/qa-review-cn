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
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Plus,
  Download,
  Star,
  Award,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { mockReviews } from "@/lib/mock-data"

export default function AdminDashboardPage() {
  // Calculate stats from mock data
  const stats = {
    total: mockReviews.length,
    completed: mockReviews.filter(r => r.status === 'Completed').length,
    inProgress: mockReviews.filter(r => r.status === 'In Progress').length,
    pending: mockReviews.filter(r => r.status === 'Pending').length,
    overdue: mockReviews.filter(r => r.status === 'Overdue').length,
    readyForFinal: mockReviews.filter(r => r.status === 'Completed').length,
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage QA reviews, reviewers, and member firms.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
                  Ready for final review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground">
                  Being reviewed
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
                <CardTitle className="text-sm font-medium">Final Reviews</CardTitle>
                <Star className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.readyForFinal}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting grading
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Review Management</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/admin/reviews">
                    <Button size="sm" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Manage Reviews
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    New Review
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Final Reviews</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/admin/final-reviews">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      <Star className="h-4 w-4 mr-2" />
                      Review & Grade
                    </Button>
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {stats.readyForFinal} reviews ready for final grading
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviewers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/admin/reviewers">
                    <Button size="sm" variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Reviewers
                    </Button>
                  </Link>
                  <Link href="/admin/reviewers/add">
                    <Button size="sm" variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Reviewer
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Firms</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/admin/member-firms">
                    <Button size="sm" variant="outline" className="w-full">
                      <Award className="h-4 w-4 mr-2" />
                      Manage Firms
                    </Button>
                  </Link>
                  <Link href="/admin/member-firms/add">
                    <Button size="sm" variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Firm
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

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
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600">
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
