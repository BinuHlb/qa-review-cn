"use client"

import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface FormLayoutProps {
  title: string
  description: string
  backUrl: string
  backLabel: string
  children: ReactNode
  onSubmit?: (e: React.FormEvent) => void
  submitLabel?: string
  cancelLabel?: string
  submitIcon?: ReactNode
  isLoading?: boolean
}

export function FormLayout({ 
  title, 
  description, 
  backUrl, 
  backLabel,
  children, 
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  submitIcon,
  isLoading = false
}: FormLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="relative overflow-y-auto">
          <Card className="shadow-none border-none">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Link href={backUrl}>
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {backLabel}
                  </Button>
                </Link>
                <div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={onSubmit} className="space-y-6">
                {children}
                
                {/* Form Actions */}
                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={isLoading}>
                    {submitIcon}
                    {submitLabel}
                  </Button>
                  <Link href={backUrl}>
                    <Button type="button" variant="outline" disabled={isLoading}>
                      {cancelLabel}
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
