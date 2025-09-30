"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { List, Grid3X3, Plus, Download, Upload } from "lucide-react"
import { ReviewView } from "@/components/reviews/review-view"
import { ReviewFilters } from "@/components/reviews/review-filters"
import { mockReviews, type Review } from "@/lib/mock-data"

export default function AdminReviewsPage() {
  const [reviews] = useState<Review[]>(mockReviews)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews)
  const [viewMode, setViewMode] = useState<"list" | "card">("list")

  const handleViewReview = (review: Review) => {
    console.log("View review:", review)
    // TODO: Implement view review functionality
  }

  const handleEditReview = (review: Review) => {
    console.log("Edit review:", review)
    // TODO: Implement edit review functionality
  }

  const handleAssignReview = (review: Review) => {
    console.log("Assign review:", review)
    // TODO: Implement assign review functionality
  }

  const handleCreateReview = () => {
    console.log("Create new review")
    // TODO: Implement create review functionality
  }

  const handleExportReviews = () => {
    console.log("Export reviews")
    // TODO: Implement export functionality
  }

  const handleImportReviews = () => {
    console.log("Import reviews")
    // TODO: Implement import functionality
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="relative overflow-y-auto">
          <Card className="shadow-none border-none">
            <CardContent className="space-y-4 h-[calc(100vh-6rem)] overflow-y-auto">
              <ReviewFilters
                reviews={reviews}
                onFilteredReviews={setFilteredReviews}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              
              <ReviewView
                reviews={filteredReviews}
                viewMode={viewMode}
                onView={handleViewReview}
                onEdit={handleEditReview}
                onAssign={handleAssignReview}
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
