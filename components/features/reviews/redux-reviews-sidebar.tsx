"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  Settings, 
  Download, 
  Upload, 
  Plus,
  BarChart3,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  List,
  Grid3X3,
  RotateCcw,
  Building2,
  ClipboardList,
  Star,
  UserPlus,
  Globe
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useReduxReviews } from "@/hooks/use-redux-reviews"

// Define quick filters based on current page
function getQuickFiltersForPage(pathname: string) {
  if (pathname.includes('/admin/reviews') || pathname.includes('/admin/final-reviews')) {
    return [
      { icon: AlertCircle, label: "High Priority", filterType: 'priority', value: 'High' },
      { icon: Clock, label: "Overdue", filterType: 'status', value: 'Overdue' },
      { icon: CheckCircle, label: "In Progress", filterType: 'status', value: 'In Progress' },
      { icon: Star, label: "Completed", filterType: 'status', value: 'Completed' },
    ]
  }
  
  if (pathname.includes('/admin/reviewers')) {
    return [
      { icon: CheckCircle, label: "Active Reviewers", filterType: 'status', value: 'Active' },
      { icon: Clock, label: "Pending Reviewers", filterType: 'status', value: 'Pending' },
      { icon: Users, label: "Senior Reviewers", filterType: 'grade', value: 'Senior' },
    ]
  }
  
  if (pathname.includes('/admin/member-firms')) {
    return [
      { icon: CheckCircle, label: "Active Firms", filterType: 'status', value: 'Active' },
      { icon: AlertCircle, label: "High Risk", filterType: 'priority', value: 'High' },
      { icon: Building2, label: "Large Firms", filterType: 'grade', value: 'Large' },
    ]
  }
  
  return []
}

// Define quick actions based on current page
function getQuickActionsForPage(pathname: string) {
  if (pathname.includes('/admin/reviews')) {
    return [
      { icon: ClipboardList, label: "All Reviews", href: "/admin/reviews" },
      { icon: Star, label: "Final Reviews", href: "/admin/final-reviews" },
      { icon: Download, label: "Export Reviews", action: "export" },
      { icon: Upload, label: "Import Reviews", action: "import" },
    ]
  }
  
  if (pathname.includes('/admin/final-reviews')) {
    return [
      { icon: Star, label: "Final Reviews", href: "/admin/final-reviews" },
      { icon: ClipboardList, label: "All Reviews", href: "/admin/reviews" },
      { icon: Download, label: "Export Final Reviews", action: "export" },
    ]
  }
  
  if (pathname.includes('/admin/reviewers')) {
    return [
      { icon: Users, label: "All Reviewers", href: "/admin/reviewers" },
      { icon: UserPlus, label: "Add Reviewer", href: "/admin/reviewers/add" },
      { icon: Download, label: "Export Reviewers", action: "export" },
      { icon: Upload, label: "Import Reviewers", action: "import" },
    ]
  }
  
  if (pathname.includes('/admin/member-firms')) {
    return [
      { icon: Building2, label: "All Firms", href: "/admin/member-firms" },
      { icon: Plus, label: "Add Firm", href: "/admin/member-firms/add" },
      { icon: Download, label: "Export Firms", action: "export" },
      { icon: Upload, label: "Import Firms", action: "import" },
    ]
  }
  
  // Default actions for other admin pages
  if (pathname.includes('/admin/')) {
    return [
      { icon: ClipboardList, label: "Reviews", href: "/admin/reviews" },
      { icon: Users, label: "Reviewers", href: "/admin/reviewers" },
      { icon: Building2, label: "Member Firms", href: "/admin/member-firms" },
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ]
  }
  
  return []
}

interface ReduxReviewsSidebarProps {
  stats?: {
    total: number
    completed: number
    inProgress: number
    pending: number
    overdue: number
  }
  onExport?: () => void
  onImport?: () => void
  onSettings?: () => void
  className?: string
  filters?: Record<string, unknown> // For backward compatibility
}

export function ReduxReviewsSidebar({ 
  stats: propsStats,
  onExport,
  onImport,
  onSettings,
  className = "",
  filters: _propsFilters,
  ...props 
}: ReduxReviewsSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const quickActions = getQuickActionsForPage(pathname)
  const quickFilters = getQuickFiltersForPage(pathname)
  
  const {
    stats: reduxStats,
    filters,
    filteredReviews,
    viewMode,
    handleSearchChange,
    handleStatusChange,
    handleGradeChange,
    handlePriorityChange,
    handleCountryChange,
    handleClearFilters,
    handleViewModeChange,
  } = useReduxReviews()

  // Use props stats if provided (backward compatibility), otherwise use Redux stats
  const stats = propsStats || reduxStats

  const hasActiveFilters = 
    filters.searchTerm || 
    filters.statusFilter !== 'all' || 
    filters.gradeFilter !== 'all' || 
    filters.priorityFilter !== 'all' || 
    filters.countryFilter !== 'all'

  // Get unique values for filters from filtered reviews
  const uniqueCountries = Array.from(new Set(filteredReviews.map((review) => review.country))).sort()
  const uniqueStatuses = Array.from(new Set(filteredReviews.map((review) => review.status))).sort()
  const uniqueGrades = Array.from(new Set(filteredReviews.map((review) => review.currentGrade))).sort()
  const uniquePriorities = Array.from(new Set(filteredReviews.map((review) => review.priority))).sort()

  const handleQuickFilter = (filterType: string, value: string) => {
    switch (filterType) {
      case 'status':
        handleStatusChange(value)
        break
      case 'grade':
        handleGradeChange(value)
        break
      case 'priority':
        handlePriorityChange(value)
        break
      default:
        break
    }
  }

  return (
    <Sidebar side="right" className={className} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BarChart3 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Quick Actions</span>
                  <span className="truncate text-xs">Review Tools</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((action, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      {action.href ? (
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link href={action.href}>
                            <action.icon className="mr-2 h-4 w-4" />
                            {action.label}
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start" 
                          onClick={action.action === 'export' ? onExport : action.action === 'import' ? onImport : onSettings}
                        >
                          <action.icon className="mr-2 h-4 w-4" />
                          {action.label}
                        </Button>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Statistics */}
        {stats && (
          <SidebarGroup>
            <SidebarGroupLabel>Statistics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Total */}
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-auto py-2 px-3">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-sidebar-accent/20">
                          <FileText className="h-3 w-3 text-sidebar-accent-foreground" />
                        </div>
                        <span className="text-xs font-medium">Total</span>
                      </div>
                      <Badge variant="secondary" className="text-xs h-5 px-2">{stats.total}</Badge>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {/* Completed */}
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-auto py-2 px-3">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/20">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs font-medium">Completed</span>
                      </div>
                      <Badge variant="outline" className="text-xs h-5 px-2 text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-900/20">{stats.completed}</Badge>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* In Progress */}
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-auto py-2 px-3">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/20">
                          <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium">In Progress</span>
                      </div>
                      <Badge variant="outline" className="text-xs h-5 px-2 text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-900/20">{stats.inProgress}</Badge>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Pending */}
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-auto py-2 px-3">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-yellow-100 dark:bg-yellow-900/20">
                          <AlertCircle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="text-xs font-medium">Pending</span>
                      </div>
                      <Badge variant="outline" className="text-xs h-5 px-2 text-yellow-600 border-yellow-200 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-900/20">{stats.pending}</Badge>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Overdue (if available) */}
                {stats.overdue !== undefined && stats.overdue > 0 && (
                  <SidebarMenuItem>
                    <SidebarMenuButton className="h-auto py-2 px-3">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/20">
                            <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <span className="text-xs font-medium">Overdue</span>
                        </div>
                        <Badge variant="outline" className="text-xs h-5 px-2 text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-900/20">{stats.overdue}</Badge>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Filters */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Filters</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs h-4 px-1.5">
                {filteredReviews.length}
              </Badge>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Search */}
              <SidebarMenuItem>
                <div className="px-2 py-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-sidebar-foreground/50" />
                    <Input
                      placeholder="Search..."
                      value={filters.searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-8 h-8 text-xs bg-sidebar-accent/20 border-sidebar-border focus:bg-background"
                    />
                  </div>
                </div>
              </SidebarMenuItem>

              {/* Status Filter */}
              <SidebarMenuItem>
                <div className="px-2 py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center justify-center w-4 h-4 rounded-sm bg-blue-100 dark:bg-blue-900/30">
                      <CheckCircle className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-sidebar-foreground/70">Status</span>
                  </div>
                  <Select value={filters.statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger className="h-7 text-xs bg-sidebar-accent/20 border-sidebar-border">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                      {uniqueStatuses.map((status) => (
                        <SelectItem key={status} value={status} className="text-xs">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarMenuItem>

              {/* Grade Filter */}
              <SidebarMenuItem>
                <div className="px-2 py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center justify-center w-4 h-4 rounded-sm bg-green-100 dark:bg-green-900/30">
                      <Star className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xs font-medium text-sidebar-foreground/70">Grade</span>
                  </div>
                  <Select value={filters.gradeFilter} onValueChange={handleGradeChange}>
                    <SelectTrigger className="h-7 text-xs bg-sidebar-accent/20 border-sidebar-border">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs">All Grades</SelectItem>
                      {uniqueGrades.map((grade) => (
                        <SelectItem key={grade} value={grade} className="text-xs">
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarMenuItem>

              {/* Priority Filter */}
              <SidebarMenuItem>
                <div className="px-2 py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center justify-center w-4 h-4 rounded-sm bg-orange-100 dark:bg-orange-900/30">
                      <AlertCircle className="h-2.5 w-2.5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-xs font-medium text-sidebar-foreground/70">Priority</span>
                  </div>
                  <Select value={filters.priorityFilter} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="h-7 text-xs bg-sidebar-accent/20 border-sidebar-border">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs">All Priorities</SelectItem>
                      {uniquePriorities.map((priority) => (
                        <SelectItem key={priority} value={priority} className="text-xs">
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarMenuItem>

              {/* Country Filter */}
              <SidebarMenuItem>
                <div className="px-2 py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center justify-center w-4 h-4 rounded-sm bg-purple-100 dark:bg-purple-900/30">
                      <Globe className="h-2.5 w-2.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-xs font-medium text-sidebar-foreground/70">Region</span>
                  </div>
                  <Select value={filters.countryFilter} onValueChange={handleCountryChange}>
                    <SelectTrigger className="h-7 text-xs bg-sidebar-accent/20 border-sidebar-border">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs">All Regions</SelectItem>
                      {uniqueCountries.map((country) => (
                        <SelectItem key={country} value={country} className="text-xs">
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarMenuItem>

              {/* View Mode */}
              <SidebarMenuItem>
                <div className="px-2 py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center justify-center w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-900/30">
                      <Grid3X3 className="h-2.5 w-2.5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <span className="text-xs font-medium text-sidebar-foreground/70">View</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleViewModeChange("list")}
                      className="flex-1 h-7 text-xs px-2"
                    >
                      <List className="h-3 w-3 mr-1" />
                      List
                    </Button>
                    <Button
                      variant={viewMode === "card" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleViewModeChange("card")}
                      className="flex-1 h-7 text-xs px-2"
                    >
                      <Grid3X3 className="h-3 w-3 mr-1" />
                      Cards
                    </Button>
                  </div>
                </div>
              </SidebarMenuItem>

              {/* Filter Actions */}
              <SidebarMenuItem>
                <div className="px-2 py-2">
                  <div className="flex gap-1">
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="w-full h-7 px-2 text-xs"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Filters */}
        {quickFilters.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Filters</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickFilters.map((filter, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => handleQuickFilter(filter.filterType, filter.value)}
                      >
                        <filter.icon className="mr-2 h-4 w-4" />
                        {filter.label}
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/admin/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </a>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
