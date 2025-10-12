// Custom hooks barrel export
// This file provides convenient single-import access to all custom hooks

// Data filtering and state management
export { useDataFilters } from "./use-data-filters"
export { useSelection } from "./use-selection"

// Page-level state management (New scalable pattern)
export { usePageSearch } from "./use-page-search"
export { usePageFilters } from "./use-page-filters"
export { usePageState } from "./use-page-state"
export { useListDetailPage } from "./use-list-detail-page"

// Type exports
export type { PageSearchConfig, UsePageSearchReturn } from "./use-page-search"
export type { UsePageFiltersConfig, UsePageFiltersReturn } from "./use-page-filters"
export type { UsePageStateConfig, UsePageStateReturn } from "./use-page-state"
export type { UseListDetailPageConfig, UseListDetailPageReturn } from "./use-list-detail-page"

// UI-specific hooks
export { useIsMobile } from "./use-mobile"
export { useToast } from "./use-toast"

// Redux hooks
export { useReduxReviews } from "./use-redux-reviews"
export { useReduxUI } from "./use-redux-ui"

// Feature-specific hooks
export { useAttachments } from "./use-attachments"
export { useComments } from "./use-comments"
export { useReviews } from "./use-reviews"
export { useFinalReview } from "./use-final-review"

