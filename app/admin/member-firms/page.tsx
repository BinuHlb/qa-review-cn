"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { 
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MemberFirmItem } from "@/components/member-firms/member-firm-item"
import { MemberFirmReviewDialog } from "@/components/member-firms/member-firm-review-dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  mockMemberFirms, 
  type MemberFirm
} from "@/lib/member-firms-mock-data"
import { Building2, Search, RotateCcw, List, Grid3X3, MapPin, Target, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function AdminMemberFirmsPage() {
  const [memberFirms] = useState<MemberFirm[]>(mockMemberFirms)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedFirmForReview, setSelectedFirmForReview] = useState<MemberFirm | null>(null)
  const { toast } = useToast()

  // Memoized filtered member firms
  const filteredMemberFirms = useMemo(() => {
    let filtered = memberFirms

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (firm) =>
          firm.name.toLowerCase().includes(searchLower) ||
          firm.location.toLowerCase().includes(searchLower) ||
          firm.country.toLowerCase().includes(searchLower) ||
          firm.specializations.some(spec => 
            spec.toLowerCase().includes(searchLower)
          )
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((firm) => firm.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((firm) => firm.type === typeFilter)
    }

    // Region filter
    if (regionFilter !== "all") {
      filtered = filtered.filter((firm) => firm.region === regionFilter)
    }

    // Risk level filter
    if (riskLevelFilter !== "all") {
      filtered = filtered.filter((firm) => firm.riskLevel === riskLevelFilter)
    }

    return filtered
  }, [memberFirms, searchTerm, statusFilter, typeFilter, regionFilter, riskLevelFilter])

  // Get unique values for filters
  const uniqueStatuses = useMemo(() => 
    Array.from(new Set(memberFirms.map((firm) => firm.status))).sort(),
    [memberFirms]
  )
  const uniqueTypes = useMemo(() => 
    Array.from(new Set(memberFirms.map((firm) => firm.type))).sort(),
    [memberFirms]
  )
  const uniqueRegions = useMemo(() => 
    Array.from(new Set(memberFirms.map((firm) => firm.region))).sort(),
    [memberFirms]
  )
  const uniqueRiskLevels = useMemo(() => 
    Array.from(new Set(memberFirms.map((firm) => firm.riskLevel))).sort(),
    [memberFirms]
  )

  const hasActiveFilters = useMemo(() => 
    Boolean(searchTerm || statusFilter !== "all" || typeFilter !== "all" || regionFilter !== "all" || riskLevelFilter !== "all"),
    [searchTerm, statusFilter, typeFilter, regionFilter, riskLevelFilter]
  )

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setStatusFilter("all")
    setTypeFilter("all")
    setRegionFilter("all")
    setRiskLevelFilter("all")
  }, [])

  const handleAddMemberFirm = () => {
    console.log("Add new member firm")
    // TODO: Implement add member firm functionality
  }

  const handleViewMemberFirm = (memberFirm: MemberFirm) => {
    console.log("View member firm:", memberFirm)
    // TODO: Implement view member firm functionality
  }

  const handleEditMemberFirm = (memberFirm: MemberFirm) => {
    console.log("Edit member firm:", memberFirm)
    // TODO: Implement edit member firm functionality
  }

  const handleDeleteMemberFirm = (memberFirm: MemberFirm) => {
    console.log("Delete member firm:", memberFirm)
    // TODO: Implement delete member firm functionality
  }

  const handleReviewMemberFirm = (memberFirm: MemberFirm) => {
    setSelectedFirmForReview(memberFirm)
    setReviewDialogOpen(true)
  }

  const handleAcceptReview = async (firmId: string, notes: string) => {
    console.log("Accept review for firm:", firmId, "Notes:", notes)
    // TODO: Implement accept review API call
    toast({
      title: "Review Accepted",
      description: `Successfully accepted the review for ${selectedFirmForReview?.name}`,
    })
  }

  const handleRejectReview = async (firmId: string, notes: string) => {
    console.log("Reject review for firm:", firmId, "Notes:", notes)
    // TODO: Implement reject review API call
    toast({
      title: "Review Rejected",
      description: `Review rejected for ${selectedFirmForReview?.name}`,
      variant: "destructive"
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex h-[calc(100vh-85px)]">
          {/* Main Content - Member Firms List with Filters */}
          <div className="flex-1 flex flex-col overflow-hidden p-6">
            {/* Header with Filters */}
            <div className="flex-shrink-0 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {filteredMemberFirms.length} of {memberFirms.length} member firms
                  </p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`h-8 px-3 ${viewMode === "list" ? "bg-background shadow-sm" : ""}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("card")}
                    className={`h-8 px-3 ${viewMode === "card" ? "bg-background shadow-sm" : ""}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search member firms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] h-9">
                    <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status} className="capitalize">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Type Filter */}
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px] h-9">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'current_member' ? 'Current Member' : 'Prospect'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Region Filter */}
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-[140px] h-9">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {uniqueRegions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Risk Level Filter */}
                <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                  <SelectTrigger className="w-[130px] h-9">
                    <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    {uniqueRiskLevels.map((risk) => (
                      <SelectItem key={risk} value={risk} className="capitalize">
                        {risk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-9 px-3"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Member Firms List */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className={viewMode === "card" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
                {filteredMemberFirms.map((firm) => (
                  <MemberFirmItem
                    key={firm.id}
                    memberFirm={firm}
                    viewMode={viewMode}
                    onView={handleViewMemberFirm}
                    onEdit={handleEditMemberFirm}
                    onDelete={handleDeleteMemberFirm}
                    onReview={handleReviewMemberFirm}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Review Dialog */}
        <MemberFirmReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          memberFirm={selectedFirmForReview}
          onAccept={handleAcceptReview}
          onReject={handleRejectReview}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}