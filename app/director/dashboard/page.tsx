"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DirectorDashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Technical Director Dashboard</h1>
            <p className="text-muted-foreground">
              Technical oversight and review management.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Review Management</CardTitle>
              <CardDescription>
                Manage technical reviews and team performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Technical director dashboard interface coming soon...
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
