"use client"

import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ReduxReviewsSidebar } from "@/components/features/reviews/redux-reviews-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
// Redux imports removed for now - using original props-based approach

interface DualSidebarLayoutProps {
  title: string
  description: string
  headerActions?: ReactNode
  children: ReactNode
  className?: string
  rightSidebarProps?: {
    stats?: {
      total: number
      completed: number
      inProgress: number
      pending: number
      overdue: number
    }
    onExport?: () => void
    onImport?: () => void
    onSettings?: () => void
    filters?: Record<string, unknown> // For backward compatibility
  }
}

export function DualSidebarLayout({
  children,
  className = "",
  rightSidebarProps = {}
}: DualSidebarLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className={`p-6 ${className}`}>
          {children}
        </div>
      </SidebarInset>
      <ReduxReviewsSidebar 
        {...rightSidebarProps} 
      />
    </SidebarProvider>
  )
}
