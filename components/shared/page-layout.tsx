"use client"

import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PageLayoutProps {
  title: string
  description: string
  children: ReactNode
  headerActions?: ReactNode
  statsCards?: ReactNode
  maxHeight?: string
}

export function PageLayout({ 
  title, 
  description, 
  children, 
  headerActions,
  statsCards,
  maxHeight = "h-[calc(100vh-6rem)]"
}: PageLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="relative h-full flex flex-col">
          <Card className="shadow-none border-none h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
                {headerActions && (
                  <div className="flex items-center gap-2">
                    {headerActions}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className={`space-y-4 flex-1 overflow-hidden`}>
              {children}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
