import { type Review } from "@/lib/mock-data"

/**
 * Filter reviews based on search term and filter criteria
 */
export function filterReviews(
  reviews: Review[],
  filters: {
    searchTerm: string
    statusFilter: string
    gradeFilter: string
    priorityFilter: string
    countryFilter: string
  }
): Review[] {
  let filtered = reviews

  // Search filter
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase()
    filtered = filtered.filter(
      (review) =>
        review.memberFirm.toLowerCase().includes(searchLower) ||
        review.reviewer.toLowerCase().includes(searchLower) ||
        review.type.toLowerCase().includes(searchLower) ||
        review.country.toLowerCase().includes(searchLower)
    )
  }

  // Status filter
  if (filters.statusFilter !== "all") {
    filtered = filtered.filter((review) => review.status === filters.statusFilter)
  }

  // Grade filter
  if (filters.gradeFilter !== "all") {
    filtered = filtered.filter((review) => review.currentGrade === filters.gradeFilter)
  }

  // Priority filter
  if (filters.priorityFilter !== "all") {
    filtered = filtered.filter((review) => review.priority === filters.priorityFilter)
  }

  // Country filter
  if (filters.countryFilter !== "all") {
    filtered = filtered.filter((review) => review.country === filters.countryFilter)
  }

  return filtered
}

/**
 * Extract unique values from reviews for filter dropdowns
 */
export function getUniqueFilterValues(reviews: Review[]) {
  return {
    countries: Array.from(new Set(reviews.map((review) => review.country))).sort(),
    statuses: Array.from(new Set(reviews.map((review) => review.status))).sort(),
    grades: Array.from(new Set(reviews.map((review) => review.currentGrade))).sort(),
    priorities: Array.from(new Set(reviews.map((review) => review.priority))).sort(),
  }
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: {
  searchTerm: string
  statusFilter: string
  gradeFilter: string
  priorityFilter: string
  countryFilter: string
}): boolean {
  return Boolean(
    filters.searchTerm ||
    filters.statusFilter !== "all" ||
    filters.gradeFilter !== "all" ||
    filters.priorityFilter !== "all" ||
    filters.countryFilter !== "all"
  )
}

