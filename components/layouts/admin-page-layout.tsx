"use client"

import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

interface AdminPageLayoutProps {
  title: string
  description: string
  headerActions?: ReactNode
  children: ReactNode
  className?: string
}

export function AdminPageLayout({
  title,
  description,
  headerActions,
  children,
  className = ""
}: AdminPageLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className={`p-6 ${className}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            {headerActions && (
              <div className="flex items-center gap-2">
                {headerActions}
              </div>
            )}
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
