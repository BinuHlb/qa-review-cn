"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { PageLayout } from "@/components/shared/page-layout"
import { ReviewView } from "@/components/reviews/review-view"
import { FinalReviewScreen } from "@/components/reviews/final-review-screen"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText,
  TrendingUp,
  Award,
  Target
} from "lucide-react"
import { mockReviews } from "@/lib/mock-data"
import { type Review } from "@/lib/schemas/review.schema"
import { useFinalReview } from "@/hooks/use-final-review"

export default function CEOFinalReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const { confirmFinalReview, rejectReview } = useFinalReview()

  // Load reviews
  useEffect(() => {
    // Filter reviews that are ready for CEO final review (admin confirmed)
    const readyForCEOReview = mockReviews.filter(review => 
      review.status === 'Completed'
    )
    setReviews(readyForCEOReview)
  }, [])

  // Event handlers
  const handleViewReview = useCallback((review: Review) => {
    setSelectedReview(prev => prev?.id === review.id ? null : review)
  }, [])

  const handleConfirmFinalReview = useCallback(async (
    reviewId: string, 
    finalGrade: string, 
    adminNotes: string
  ) => {
    try {
      const updatedReview = await confirmFinalReview(reviewId, finalGrade, adminNotes)
      setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
      setSelectedReview(null)
    } catch {
      // Error handling is done in the hook
    }
  }, [confirmFinalReview])

  const handleRejectReview = useCallback(async (
    reviewId: string, 
    rejectionReason: string
  ) => {
    try {
      const updatedReview = await rejectReview(reviewId, rejectionReason)
      setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
      setSelectedReview(null)
    } catch {
      // Error handling is done in the hook
    }
  }, [rejectReview])

  const handleBack = useCallback(() => {
    setSelectedReview(null)
  }, [])

  const handleExportReviews = useCallback(() => {
    // Export reviews logic
    console.log("Export reviews")
  }, [])

  // Statistics
  const stats = useMemo(() => {
    const total = reviews.length
    const completed = reviews.filter(r => r.status === 'Completed').length
    const inProgress = reviews.filter(r => r.status === 'In Progress').length
    const pending = reviews.filter(r => r.status === 'Pending').length
    const overdue = reviews.filter(r => r.status === 'Overdue').length
    const highPriority = reviews.filter(r => r.priority === 'High').length
    const excellentGrades = reviews.filter(r => r.currentGrade.startsWith('A')).length

    return { total, completed, inProgress, pending, overdue, highPriority, excellentGrades }
  }, [reviews])

  // Header actions
  const headerActions = useMemo(() => (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExportReviews}>
        Export Reviews
      </Button>
      <Button variant="outline" size="sm" onClick={() => console.log("Generate report")}>
        Generate Report
      </Button>
    </div>
  ), [handleExportReviews])

  return (
    <PageLayout
      title="CEO Final Reviews"
      description="Executive review and approval of completed QA reviews"
      headerActions={headerActions}
    >
      <div className="h-[calc(100vh-200px)]">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Ready for CEO review
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
                Awaiting approval
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
                A grade reviews
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
        </div>

        {/* Split View Layout */}
        <div className="grid gap-6 h-full grid-cols-1 lg:grid-cols-3">
          {/* Left Side - Review List */}
          <div className="flex flex-col h-full overflow-hidden lg:col-span-2">
            {/* Header */}
            <div className="flex-shrink-0 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Completed Reviews</h2>
                  <p className="text-sm text-gray-600">
                    {reviews.length} reviews ready for CEO approval
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </Button>
                  <Button
                    variant={viewMode === "card" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("card")}
                  >
                    Cards
                  </Button>
                </div>
              </div>
            </div>

            {/* Review List */}
            <div className="flex-1 overflow-y-auto">
              <ReviewView
                reviews={reviews}
                viewMode={viewMode}
                selectedReview={selectedReview}
                onView={handleViewReview}
                onEdit={undefined}
                onAssign={undefined}
              />
            </div>
          </div>

          {/* Right Side - Final Review Screen or Empty State */}
          <div className="lg:col-span-1 pl-2 border-l h-full flex flex-col">
            {selectedReview ? (
              <div className="h-full flex flex-col">
                <FinalReviewScreen
                  review={selectedReview}
                  onConfirm={handleConfirmFinalReview}
                  onReject={handleRejectReview}
                  onBack={handleBack}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4 px-6 max-w-md">
                  <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="h-10 w-10 text-purple-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">CEO Final Approval</h3>
                    <p className="text-sm text-gray-600">
                      Executive review and final approval process:
                    </p>
                  </div>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-purple-600">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Executive Review</p>
                        <p className="text-xs text-gray-600">Review admin recommendations and final grade</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-purple-600">2</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Final Decision</p>
                        <p className="text-xs text-gray-600">Approve or modify the final grade</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-purple-600">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Official Approval</p>
                        <p className="text-xs text-gray-600">Finalize the review with executive authority</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {reviews.length} reviews ready for CEO approval
                    </Badge>
                    <div className="text-xs text-gray-500">
                      High priority reviews are highlighted in red
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}