"use client"

import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FirmDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Firm Dashboard</h1>
            <p className="text-muted-foreground">
              Member firm overview and compliance tracking.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>My Reviews</CardTitle>
              <CardDescription>
                Track your firm&apos;s reviews and compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Firm dashboard interface coming soon...
              </div>
            </CardContent>
          </Card>
        </div>
    </DashboardLayout>
  )
}
