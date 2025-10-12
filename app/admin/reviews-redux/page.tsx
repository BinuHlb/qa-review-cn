"use client"

import { DualSidebarLayout } from "@/components/layouts/dual-sidebar-layout"
import { ReviewView } from "@/components/features/reviews/review-view"
import { ReduxReviewFilters } from "@/components/features/reviews/redux-review-filters"
import { useReduxReviews } from "@/hooks/use-redux-reviews"
import { useEffect } from "react"

export default function AdminReviewsReduxPage() {
  const {
    filteredReviews,
    selectedReview,
    viewMode,
    isLoading,
    error,
    selectReview,
    handleViewModeChange,
  } = useReduxReviews()

  // Load initial data (this would typically be done in a layout or parent component)
  useEffect(() => {
    // The useReduxReviews hook automatically fetches data on mount
    // This is just to demonstrate the Redux integration
  }, [])

  const handleExport = () => {
    console.log("Exporting reviews...")
    // Export logic here
  }

  const handleImport = () => {
    console.log("Importing reviews...")
    // Import logic here
  }

  const handleSettings = () => {
    console.log("Opening settings...")
    // Settings logic here
  }

  return (
    <DualSidebarLayout
      title="Reviews Management"
      description="Manage and review all QA assessments"
      rightSidebarProps={{
        onExport: handleExport,
        onImport: handleImport,
        onSettings: handleSettings,
      }}
    >
      <div className="space-y-6">
        {/* Redux-powered filters */}
        <ReduxReviewFilters />
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}
        
        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading reviews...</div>
          </div>
        ) : (
          <ReviewView
            reviews={filteredReviews}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            selectedReview={selectedReview}
            onSelectReview={selectReview}
          />
        )}
      </div>
    </DualSidebarLayout>
  )
}
