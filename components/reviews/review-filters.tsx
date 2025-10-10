"use client"

import { useState } from "react"
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
import { Search, Filter, X, List, Grid3X3 } from "lucide-react"
import type { Review } from "@/types/entities"

interface ReviewFiltersProps {
  reviews: Review[]
  onFilteredReviews: (reviews: Review[]) => void
  viewMode: "list" | "card"
  onViewModeChange: (mode: "list" | "card") => void
}

export function ReviewFilters({ reviews, onFilteredReviews, viewMode, onViewModeChange }: ReviewFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")

  const handleFilter = () => {
    let filtered = reviews

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.memberFirm.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.country.toLowerCase().includes(searchTerm.toLowerCase())
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

    onFilteredReviews(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setGradeFilter("all")
    setPriorityFilter("all")
    setCountryFilter("all")
    onFilteredReviews(reviews)
  }

  const hasActiveFilters = searchTerm || statusFilter !== "all" || gradeFilter !== "all" || priorityFilter !== "all" || countryFilter !== "all"

  // Get unique values for filters
  const uniqueCountries = Array.from(new Set(reviews.map((review) => review.country))).sort()
  const uniqueStatuses = Array.from(new Set(reviews.map((review) => review.status))).sort()
  const uniqueGrades = Array.from(new Set(reviews.map((review) => review.currentGrade))).sort()
  const uniquePriorities = Array.from(new Set(reviews.map((review) => review.priority))).sort()

  return (
    <div className="space-y-4 sticky top-0 z-10 bg-background py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {/* View Toggle with Motion */}
          <div className="flex rounded-md border bg-background">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="rounded-r-none transition-all duration-200 ease-in-out hover:scale-105"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("card")}
              className="rounded-l-none transition-all duration-200 ease-in-out hover:scale-105"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={handleFilter} size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline" size="sm">
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
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

        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger>
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

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {uniquePriorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger>
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
              {reviews.length} results
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
