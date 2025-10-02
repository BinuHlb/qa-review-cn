"use client"

import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ReviewsSidebar } from "@/components/reviews-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

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
    filters?: {
      searchTerm: string
      statusFilter: string
      gradeFilter: string
      priorityFilter: string
      countryFilter: string
      onSearchChange: (value: string) => void
      onStatusChange: (value: string) => void
      onGradeChange: (value: string) => void
      onPriorityChange: (value: string) => void
      onCountryChange: (value: string) => void
      onFilter: () => void
      onClearFilters: () => void
      hasActiveFilters: boolean
      resultsCount: number
      viewMode: "list" | "card"
      onViewModeChange: (mode: "list" | "card") => void
      statusOptions: string[]
      gradeOptions: string[]
      priorityOptions: string[]
      countryOptions: string[]
    }
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
      <ReviewsSidebar {...rightSidebarProps} />
    </SidebarProvider>
  )
}
