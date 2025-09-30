"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReviewerDashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reviewer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your assigned reviews and track performance.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Reviews</CardTitle>
              <CardDescription>
                View and manage your assigned quality assurance reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Reviewer dashboard interface coming soon...
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
