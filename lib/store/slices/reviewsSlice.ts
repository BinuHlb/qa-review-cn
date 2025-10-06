import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Review } from '@/lib/schemas/review.schema'

interface ReviewsFilters {
  searchTerm: string
  statusFilter: string
  gradeFilter: string
  priorityFilter: string
  countryFilter: string
}

interface ReviewsState {
  items: Review[]
  filteredItems: Review[]
  isLoading: boolean
  error: string | null
  selectedReview: Review | null
  viewMode: 'list' | 'card'
  filters: ReviewsFilters
  stats: {
    total: number
    completed: number
    inProgress: number
    pending: number
    overdue: number
  }
}

const initialFilters: ReviewsFilters = {
  searchTerm: '',
  statusFilter: 'all',
  gradeFilter: 'all',
  priorityFilter: 'all',
  countryFilter: 'all',
}

const initialState: ReviewsState = {
  items: [],
  filteredItems: [],
  isLoading: false,
  error: null,
  selectedReview: null,
  viewMode: 'list',
  filters: initialFilters,
  stats: {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0,
  },
}

// Helper function to filter reviews
const filterReviews = (reviews: Review[], filters: ReviewsFilters): Review[] => {
  let filtered = reviews

  // Search filter
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase()
    filtered = filtered.filter(
      (review) =>
        review.memberFirm.toLowerCase().includes(searchLower) ||
        review.reviewer?.toLowerCase().includes(searchLower) ||
        review.type.toLowerCase().includes(searchLower) ||
        review.country.toLowerCase().includes(searchLower)
    )
  }

  // Status filter
  if (filters.statusFilter !== 'all') {
    filtered = filtered.filter((review) => review.status === filters.statusFilter)
  }

  // Grade filter
  if (filters.gradeFilter !== 'all') {
    filtered = filtered.filter((review) => review.currentGrade === filters.gradeFilter)
  }

  // Priority filter
  if (filters.priorityFilter !== 'all') {
    filtered = filtered.filter((review) => review.priority === filters.priorityFilter)
  }

  // Country filter
  if (filters.countryFilter !== 'all') {
    filtered = filtered.filter((review) => review.country === filters.countryFilter)
  }

  return filtered
}

// Helper function to calculate stats
const calculateStats = (reviews: Review[]) => {
  return {
    total: reviews.length,
    completed: reviews.filter((r) => r.status === 'Completed').length,
    inProgress: reviews.filter((r) => r.status === 'In Progress').length,
    pending: reviews.filter((r) => r.status === 'Pending').length,
    overdue: reviews.filter((r) => r.status === 'Overdue').length,
  }
}

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // Reviews data management
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.items = action.payload
      state.filteredItems = filterReviews(action.payload, state.filters)
      state.stats = calculateStats(action.payload)
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.items.unshift(action.payload)
      state.filteredItems = filterReviews(state.items, state.filters)
      state.stats = calculateStats(state.items)
    },
    updateReview: (state, action: PayloadAction<{ id: string; updates: Partial<Review> }>) => {
      const index = state.items.findIndex((r) => r.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.updates }
        state.filteredItems = filterReviews(state.items, state.filters)
        state.stats = calculateStats(state.items)
        
        // Update selected review if it's the one being updated
        if (state.selectedReview?.id === action.payload.id) {
          state.selectedReview = state.items[index]
        }
      }
    },
    deleteReview: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((r) => r.id !== action.payload)
      state.filteredItems = filterReviews(state.items, state.filters)
      state.stats = calculateStats(state.items)
      
      // Clear selected review if it's the one being deleted
      if (state.selectedReview?.id === action.payload) {
        state.selectedReview = null
      }
    },

    // Selection management
    setSelectedReview: (state, action: PayloadAction<Review | null>) => {
      state.selectedReview = action.payload
    },

    // View mode
    setViewMode: (state, action: PayloadAction<'list' | 'card'>) => {
      state.viewMode = action.payload
    },

    // Filters
    setFilters: (state, action: PayloadAction<Partial<ReviewsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.filteredItems = filterReviews(state.items, state.filters)
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload
      state.filteredItems = filterReviews(state.items, state.filters)
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.statusFilter = action.payload
      state.filteredItems = filterReviews(state.items, state.filters)
    },
    setGradeFilter: (state, action: PayloadAction<string>) => {
      state.filters.gradeFilter = action.payload
      state.filteredItems = filterReviews(state.items, state.filters)
    },
    setPriorityFilter: (state, action: PayloadAction<string>) => {
      state.filters.priorityFilter = action.payload
      state.filteredItems = filterReviews(state.items, state.filters)
    },
    setCountryFilter: (state, action: PayloadAction<string>) => {
      state.filters.countryFilter = action.payload
      state.filteredItems = filterReviews(state.items, state.filters)
    },
    clearFilters: (state) => {
      state.filters = initialFilters
      state.filteredItems = filterReviews(state.items, initialFilters)
    },

    // Apply filters manually (for backward compatibility)
    applyFilters: (state) => {
      state.filteredItems = filterReviews(state.items, state.filters)
    },
  },
})

export const {
  setLoading,
  setError,
  setReviews,
  addReview,
  updateReview,
  deleteReview,
  setSelectedReview,
  setViewMode,
  setFilters,
  setSearchTerm,
  setStatusFilter,
  setGradeFilter,
  setPriorityFilter,
  setCountryFilter,
  clearFilters,
  applyFilters,
} = reviewsSlice.actions

export default reviewsSlice.reducer
