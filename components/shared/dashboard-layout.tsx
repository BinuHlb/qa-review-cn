"use client"

import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
  /** Optional className for the content container */
  className?: string
  /** If true, removes default padding from content area */
  noPadding?: boolean
}

/**
 * Universal Dashboard Layout
 * 
 * Wraps all dashboard pages with consistent sidebar and header structure.
 * Used across all user roles: Admin, CEO, Director, Firm, Reviewer
 * 
 * @example
 * ```tsx
 * export default function MyDashboard() {
 *   return (
 *     <DashboardLayout>
 *       <div>Your page content here</div>
 *     </DashboardLayout>
 *   )
 * }
 * ```
 */
export function DashboardLayout({ 
  children, 
  className,
  noPadding = false 
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className={cn(
          !noPadding && "p-6 space-y-6",
          className
        )}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

