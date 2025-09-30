"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminMemberFirmsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Member Firms</h1>
            <p className="text-muted-foreground">
              Manage member firms and their compliance status.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Member Firms</CardTitle>
              <CardDescription>
                View and manage all member firms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Member firm management interface coming soon...
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
