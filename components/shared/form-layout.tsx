"use client"

import { ReactNode, useMemo } from "react"
import { DualSidebarLayout } from "@/components/shared/dual-sidebar-layout"
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
  // Mock statistics for right sidebar
  const sidebarStats = useMemo(() => ({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0
  }), [])

  return (
    <DualSidebarLayout
      title=""
      description=""
      rightSidebarProps={{
        stats: sidebarStats,
        onExport: () => console.log("Export form data"),
        onImport: () => console.log("Import form data"),
        onSettings: () => console.log("Form settings"),
        filters: {
          searchTerm: "",
          statusFilter: "all",
          gradeFilter: "all",
          priorityFilter: "all",
          countryFilter: "all",
          onSearchChange: () => {},
          onStatusChange: () => {},
          onGradeChange: () => {},
          onPriorityChange: () => {},
          onCountryChange: () => {},
          onFilter: () => {},
          onClearFilters: () => {},
          hasActiveFilters: false,
          resultsCount: 0,
          viewMode: "list" as const,
          onViewModeChange: () => {},
          statusOptions: [],
          gradeOptions: [],
          priorityOptions: [],
          countryOptions: []
        }
      }}
      className="!p-0"
    >
      <div className="h-[calc(100vh-120px)] p-6">
        <Card className="shadow-none border-none h-full">
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
          <CardContent className="space-y-6 overflow-y-auto flex-1">
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
    </DualSidebarLayout>
  )
}
