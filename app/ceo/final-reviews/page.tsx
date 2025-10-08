"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ReviewView } from "@/components/reviews/review-view"
import { FinalReviewScreen } from "@/components/reviews/final-review-screen"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText,
  TrendingUp,
  Award,
  Target,
  Search,
  Filter,
  RotateCcw,
  List,
  Grid3X3,
  CheckCircle2,
  Flag,
  MapPin
} from "lucide-react"
import { mockReviews } from "@/lib/mock-data"
import { type Review } from "@/lib/schemas/review.schema"
import { useFinalReview } from "@/hooks/use-final-review"

export default function CEOFinalReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const { confirmFinalReview, rejectReview } = useFinalReview()

  // Load reviews
  useEffect(() => {
    // Filter reviews that are ready for CEO final review (admin confirmed)
    const readyForCEOReview = mockReviews.filter(review => 
      review.status === 'Submitted'
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
    const completed = reviews.filter(r => r.status === 'Submitted').length
    const inProgress = reviews.filter(r => r.status === 'In Progress').length
    const pending = reviews.filter(r => r.status === 'Pending').length
    const overdue = reviews.filter(r => r.status === 'Overdue').length
    const highPriority = reviews.filter(r => r.priority === 'High').length
    const excellentGrades = reviews.filter(r => r.currentGrade === '1').length

    return { total, completed, inProgress, pending, overdue, highPriority, excellentGrades }
  }, [reviews])

  // Memoized filtered reviews based on all filter criteria
  const filteredReviews = useMemo(() => {
    let filtered = reviews

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (review) =>
          review.memberFirm.toLowerCase().includes(searchLower) ||
          review.reviewer.toLowerCase().includes(searchLower) ||
          review.type.toLowerCase().includes(searchLower) ||
          review.country.toLowerCase().includes(searchLower)
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((review) => review.status === statusFilter)
    }

    // Grade filter
    if (gradeFilter !== "all") {
      filtered = filtered.filter((review) => review.currentGrade === gradeFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((review) => review.priority === priorityFilter)
    }

    // Country filter
    if (countryFilter !== "all") {
      filtered = filtered.filter((review) => review.country === countryFilter)
    }

    return filtered
  }, [reviews, searchTerm, statusFilter, gradeFilter, priorityFilter, countryFilter])

  // Memoized unique filter values
  const uniqueCountries = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.country))).sort(),
    [reviews]
  )
  
  const uniqueStatuses = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.status))).sort(),
    [reviews]
  )
  
  const uniqueGrades = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.currentGrade))).sort(),
    [reviews]
  )
  
  const uniquePriorities = useMemo(() => 
    Array.from(new Set(reviews.map((review) => review.priority))).sort(),
    [reviews]
  )

  const hasActiveFilters = useMemo(() => 
    Boolean(searchTerm || statusFilter !== "all" || gradeFilter !== "all" || priorityFilter !== "all" || countryFilter !== "all"),
    [searchTerm, statusFilter, gradeFilter, priorityFilter, countryFilter]
  )

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setStatusFilter("all")
    setGradeFilter("all")
    setPriorityFilter("all")
    setCountryFilter("all")
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex h-[calc(100vh-85px)]">
          {/* Left Sidebar - Final Review Screen */}
          <div className="w-96 border-r bg-background overflow-y-auto">
            {selectedReview ? (
              <FinalReviewScreen
                review={selectedReview}
                onConfirm={handleConfirmFinalReview}
                onReject={handleRejectReview}
                onBack={handleBack}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center space-y-6">
                  <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="text-purple-600" size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">CEO Final Review</h3>
                    <p className="text-sm text-gray-600">
                      Select a completed review to perform executive review and approval
                    </p>
                  </div>
                  <div className="space-y-4 text-left">
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

          {/* Main Content - Review List with Filters */}
          <div className="flex-1 flex flex-col overflow-hidden p-6">
            {/* Statistics Cards */}
            <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
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
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <p className="text-xs text-muted-foreground">
                      Awaiting review
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-600" />
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
                    <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.highPriority}</div>
                    <p className="text-xs text-muted-foreground">
                      Require attention
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Grade 1 Reviews</CardTitle>
                    <Award className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{stats.excellentGrades}</div>
                    <p className="text-xs text-muted-foreground">
                      Excellent quality
                    </p>
                  </CardContent>
                </Card>
            </div>

            {/* Header with Filters */}
            <div className="flex-shrink-0 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">CEO Final Reviews</h1>
                  <p className="text-sm text-gray-600">
                    {filteredReviews.length} of {reviews.length} reviews ready for CEO approval
                  </p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`h-8 px-3 ${viewMode === "list" ? "bg-background shadow-sm" : ""}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("card")}
                    className={`h-8 px-3 ${viewMode === "card" ? "bg-background shadow-sm" : ""}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-9">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Grade Filter */}
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="w-[130px] h-9">
                    <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {uniqueGrades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Priority Filter */}
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[130px] h-9">
                    <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    {uniquePriorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Country Filter */}
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger className="w-[140px] h-9">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {uniqueCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-9 px-3"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Review List */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ReviewView
                reviews={filteredReviews}
                viewMode={viewMode}
                selectedReview={selectedReview}
                onView={handleViewReview}
                onEdit={undefined}
                onAssign={undefined}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}