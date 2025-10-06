/**
 * Redux-powered custom hook for managing UI state
 */

import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
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
  addNotification,
  removeNotification,
  clearNotifications,
} from "@/lib/store/slices/uiSlice"

export function useReduxUI() {
  const dispatch = useAppDispatch()
  const ui = useAppSelector((state) => state.ui)

  // Sidebar controls
  const toggleLeftSidebarAction = useCallback(() => {
    dispatch(toggleLeftSidebar())
  }, [dispatch])

  const setLeftSidebarOpenAction = useCallback((open: boolean) => {
    dispatch(setLeftSidebarOpen(open))
  }, [dispatch])

  const toggleRightSidebarAction = useCallback(() => {
    dispatch(toggleRightSidebar())
  }, [dispatch])

  const setRightSidebarOpenAction = useCallback((open: boolean) => {
    dispatch(setRightSidebarOpen(open))
  }, [dispatch])

  const toggleSidebarAction = useCallback(() => {
    dispatch(toggleSidebar())
  }, [dispatch])

  const setSidebarCollapsedAction = useCallback((collapsed: boolean) => {
    dispatch(setSidebarCollapsed(collapsed))
  }, [dispatch])

  // Drawer/Modal controls
  const openDrawerAction = useCallback((drawerId: string) => {
    dispatch(openDrawer(drawerId))
  }, [dispatch])

  const closeDrawerAction = useCallback(() => {
    dispatch(closeDrawer())
  }, [dispatch])

  const openModalAction = useCallback((modalId: string) => {
    dispatch(openModal(modalId))
  }, [dispatch])

  const closeModalAction = useCallback(() => {
    dispatch(closeModal())
  }, [dispatch])

  // Device detection
  const setMobileAction = useCallback((isMobile: boolean) => {
    dispatch(setIsMobile(isMobile))
  }, [dispatch])

  // Loading states
  const setLoadingAction = useCallback((section: keyof typeof ui.loading, loading: boolean) => {
    dispatch(setLoading({ section, loading }))
  }, [dispatch, ui.loading])

  // Notifications
  const addNotificationAction = useCallback((notification: Omit<typeof ui.notifications[0], 'id'>) => {
    dispatch(addNotification(notification))
  }, [dispatch, ui.notifications])

  const removeNotificationAction = useCallback((id: string) => {
    dispatch(removeNotification(id))
  }, [dispatch])

  const clearNotificationsAction = useCallback(() => {
    dispatch(clearNotifications())
  }, [dispatch])

  return {
    // State
    ...ui,
    
    // Sidebar actions
    toggleLeftSidebar: toggleLeftSidebarAction,
    setLeftSidebarOpen: setLeftSidebarOpenAction,
    toggleRightSidebar: toggleRightSidebarAction,
    setRightSidebarOpen: setRightSidebarOpenAction,
    toggleSidebar: toggleSidebarAction,
    setSidebarCollapsed: setSidebarCollapsedAction,
    
    // Drawer/Modal actions
    openDrawer: openDrawerAction,
    closeDrawer: closeDrawerAction,
    openModal: openModalAction,
    closeModal: closeModalAction,
    
    // Device actions
    setIsMobile: setMobileAction,
    
    // Loading actions
    setLoading: setLoadingAction,
    
    // Notification actions
    addNotification: addNotificationAction,
    removeNotification: removeNotificationAction,
    clearNotifications: clearNotificationsAction,
  }
}
