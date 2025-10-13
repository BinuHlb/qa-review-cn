"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X, List, Grid3X3 } from "lucide-react"
import { useReduxReviews } from "@/hooks/use-redux-reviews"

export function ReduxReviewFilters() {
  const {
    filteredReviews,
    viewMode,
    filters,
    handleSearchChange,
    handleStatusChange,
    handleGradeChange,
    handleCountryChange,
    handleClearFilters,
    handleViewModeChange,
  } = useReduxReviews()

  const hasActiveFilters = 
    filters.searchTerm || 
    filters.statusFilter !== 'all' || 
    filters.gradeFilter !== 'all' || 
    filters.countryFilter !== 'all'

  // Get unique values for filters from filtered reviews
  const uniqueCountries = Array.from(new Set(filteredReviews.map((review) => review.country))).sort()
  const uniqueStatuses = Array.from(new Set(filteredReviews.map((review) => review.status))).sort()
  const uniqueGrades = Array.from(new Set(filteredReviews.map((review) => review.currentGrade))).sort()

  return (
    <div className="space-y-4 sticky top-0 z-10 bg-background py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 bg-muted/50"
          />
        </div>
        <div className="flex gap-2">
          {/* View Toggle with Motion */}
          <div className="flex rounded-md border bg-background">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("list")}
              className="rounded-r-none transition-all duration-200 ease-in-out hover:scale-105"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("card")}
              className="rounded-l-none transition-all duration-200 ease-in-out hover:scale-105"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          
          {hasActiveFilters && (
            <Button onClick={handleClearFilters} variant="outline" size="sm">
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Select value={filters.statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="bg-muted/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.gradeFilter} onValueChange={handleGradeChange}>
          <SelectTrigger className="bg-muted/50">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {uniqueGrades.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.countryFilter} onValueChange={handleCountryChange}>
          <SelectTrigger className="bg-muted/50">
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

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {filteredReviews.length} results
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
