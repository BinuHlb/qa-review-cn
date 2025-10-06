import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  // Sidebar states
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  
  // Modal/Drawer states
  activeDrawer: string | null
  activeModal: string | null
  
  // Layout states
  isMobile: boolean
  sidebarCollapsed: boolean
  
  // Loading states for different sections
  loading: {
    reviews: boolean
    attachments: boolean
    comments: boolean
    assignments: boolean
  }
  
  // Toast notifications
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    description?: string
    duration?: number
  }>
}

const initialState: UIState = {
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  activeDrawer: null,
  activeModal: null,
  isMobile: false,
  sidebarCollapsed: false,
  loading: {
    reviews: false,
    attachments: false,
    comments: false,
    assignments: false,
  },
  notifications: [],
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar controls
    toggleLeftSidebar: (state) => {
      state.leftSidebarOpen = !state.leftSidebarOpen
    },
    setLeftSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.leftSidebarOpen = action.payload
    },
    toggleRightSidebar: (state) => {
      state.rightSidebarOpen = !state.rightSidebarOpen
    },
    setRightSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.rightSidebarOpen = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },

    // Drawer/Modal controls
    openDrawer: (state, action: PayloadAction<string>) => {
      state.activeDrawer = action.payload
    },
    closeDrawer: (state) => {
      state.activeDrawer = null
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload
    },
    closeModal: (state) => {
      state.activeModal = null
    },

    // Device detection
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload
      // Auto-close sidebars on mobile
      if (action.payload) {
        state.leftSidebarOpen = false
        state.rightSidebarOpen = false
      }
    },

    // Loading states
    setLoading: (state, action: PayloadAction<{ section: keyof UIState['loading']; loading: boolean }>) => {
      state.loading[action.payload.section] = action.payload.loading
    },
    setAllLoading: (state, action: PayloadAction<boolean>) => {
      Object.keys(state.loading).forEach(key => {
        state.loading[key as keyof UIState['loading']] = action.payload
      })
    },

    // Notifications
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },

    // Reset UI state
    resetUI: (state) => {
      state.activeDrawer = null
      state.activeModal = null
      state.notifications = []
    },
  },
})

export const {
  toggleLeftSidebar,
  setLeftSidebarOpen,
  toggleRightSidebar,
  setRightSidebarOpen,
  toggleSidebar,
  setSidebarCollapsed,
  openDrawer,
  closeDrawer,
  openModal,
  closeModal,
  setIsMobile,
  setLoading,
  setAllLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  resetUI,
} = uiSlice.actions

export default uiSlice.reducer
