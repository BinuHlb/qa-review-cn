"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CEODashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
            <p className="text-muted-foreground">
              Strategic overview and executive insights.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Strategic Overview</CardTitle>
              <CardDescription>
                High-level performance metrics and strategic insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Executive dashboard interface coming soon...
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
