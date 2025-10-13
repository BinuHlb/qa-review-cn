"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, User, UserPlus, Clock } from "lucide-react"
import { StatsGrid, DetailContainer } from "@/components/common/panels/detail-sections"
import { Icon } from "@iconify/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PercentageBadge } from "@/components/common/percentage-badge"
import { DataItemCard, type DropdownAction } from "@/components/common/data-item-card"
import type { Review } from "@/types/entities"
import { getGradeColor, getStatusColor, getReviewerStatusColor } from "@/lib/mock-data"

interface ReviewItemProps {
  review: Review
  viewMode: "list" | "card"
  isSelected?: boolean
  onView?: (review: Review) => void
  onEdit?: (review: Review) => void
  onAssign?: (review: Review) => void
}

export function ReviewItem({ review, viewMode, isSelected = false, onView, onEdit, onAssign }: ReviewItemProps) {
  // Helper functions
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const duration = calculateDuration(startDate, endDate)
    
    return {
      start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      duration: `${duration} days`
    }
  }

  const generateFirmInitials = (firmName: string) => {
    return firmName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  const generateFirmAvatarColor = (firmName: string) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600', 
      'bg-purple-100 text-purple-600',
      'bg-orange-100 text-orange-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600',
      'bg-teal-100 text-teal-600',
      'bg-red-100 text-red-600',
      'bg-yellow-100 text-yellow-600',
      'bg-cyan-100 text-cyan-600'
    ]
    
    let hash = 0
    for (let i = 0; i < firmName.length; i++) {
      hash = firmName.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  const dateRange = formatDateRange(review.startDate, review.endDate)

  // Avatar component
  const avatar = (
    <Avatar className="h-8 w-8 flex-shrink-0">
      <AvatarImage src="" alt={review.memberFirm} />
      <AvatarFallback className={`${generateFirmAvatarColor(review.memberFirm)} text-xs font-semibold`}>
        {generateFirmInitials(review.memberFirm)}
      </AvatarFallback>
    </Avatar>
  )

  // Badges component
  const badges = (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge className={`${getStatusColor(review.status)} text-xs px-2 py-0.5`}>
        {review.status}
      </Badge>
      <PercentageBadge value={review.percentage || 0} />
      <Badge className={`${getGradeColor(review.currentGrade)} text-xs px-2 py-0.5`}>
        {review.currentGrade}
      </Badge>
    </div>
  )

  // Secondary info for list view (desktop)
  const secondaryInfo = (
    <>
      {/* Duration Timeline */}
      <div className="flex items-center gap-2 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-md">
        <Clock className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
        <div className="flex items-center gap-1 text-xs whitespace-nowrap">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">{dateRange.start}</span>
          <span className="text-neutral-400 dark:text-neutral-500">→</span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">{dateRange.end}</span>
          <span className="text-neutral-500 dark:text-neutral-400">({dateRange.duration})</span>
        </div>
      </div>
      
      {/* Status Badge with Percentage and Rating */}
      {badges}
    </>
  )

  // Mobile info for list view
  const mobileInfo = (
    <>
      {/* Duration Timeline */}
      <div className="flex items-center gap-2 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-md">
        <Clock className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
        <div className="flex items-center gap-1 text-xs whitespace-nowrap">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">{dateRange.start}</span>
          <span className="text-neutral-400 dark:text-neutral-500">→</span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">{dateRange.end}</span>
          <span className="text-neutral-500 dark:text-neutral-400">({dateRange.duration})</span>
        </div>
      </div>
      
      {/* Status Badge with Percentage and Rating */}
      {badges}
    </>
  )

  // Always visible content for card view
  const alwaysVisibleContent = (
    <>
      {/* Duration Timeline */}
      <div className="flex items-center gap-2 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-md">
        <Clock className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
        <div className="flex items-center gap-1 text-xs">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">{dateRange.start}</span>
          <span className="text-neutral-400 dark:text-neutral-500">→</span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">{dateRange.end}</span>
          <span className="text-neutral-500 dark:text-neutral-400">({dateRange.duration})</span>
        </div>
      </div>
      {badges}
    </>
  )

  // Expandable content
  const expandableContent = (
    <DetailContainer>
      <StatsGrid 
        stats={[
          { icon: User, label: "Reviewer", value: review.reviewer },
          { icon: MapPin, label: "Country", value: review.country }
        ]}
      />

      <div className="space-y-2">
        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Additional Details</div>
        <div className="flex flex-wrap gap-1">
          {review.previousRating && (
            <Badge variant="outline" className="bg-muted text-xs px-2 py-0.5">
              Previous: {review.previousRating}/5
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Status</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">Reviewer:</span>
            <Badge variant="outline" className={`${getReviewerStatusColor(review.reviewerStatus)} text-xs px-2 py-0.5`}>
              {review.reviewerStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">Partner:</span>
            <Badge variant="outline" className={`${getReviewerStatusColor(review.partnerStatus)} text-xs px-2 py-0.5`}>
              {review.partnerStatus}
            </Badge>
          </div>
        </div>
      </div>

      {review.description && (
        <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md">
          <div className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
            {review.description}
          </div>
        </div>
      )}
    </DetailContainer>
  )

  // Dropdown actions
  const dropdownActions: DropdownAction[] = [
    {
      icon: <Icon icon="logos:microsoft-teams" className="mr-2 h-4 w-4" />,
      label: "Send to Teams",
      onClick: () => console.log('Send to Teams:', review)
    },
    {
      icon: <Icon icon="mdi:bell-badge" className="mr-2 h-4 w-4 text-orange-500" />,
      label: "Notifications",
      onClick: () => console.log('Notifications:', review)
    },
    {
      icon: <Icon icon="mdi:alert-circle" className="mr-2 h-4 w-4 text-red-500" />,
      label: "Conditions",
      onClick: () => console.log('Conditions:', review)
    }
  ]

  // Quick actions - only for card view
  const quickActions = viewMode === "card" && onAssign ? (
    <Button
      variant="outline"
      size="sm"
      onClick={(e) => {
        e.stopPropagation()
        onAssign(review)
      }}
      className="text-xs h-7 px-3"
    >
      <UserPlus className="h-3 w-3 mr-1" />
      Assign
    </Button>
  ) : undefined

  // Primary action - only for list view
  const primaryAction = viewMode === "list" && onAssign ? {
    icon: <UserPlus className="h-3 w-3" />,
    label: "Assign",
    onClick: () => onAssign(review)
  } : undefined

  return (
    <DataItemCard
      viewMode={viewMode}
      avatar={avatar}
      title={review.memberFirm}
      subtitle={review.type}
      secondaryInfo={secondaryInfo}
      mobileInfo={mobileInfo}
      expandableContent={expandableContent}
      alwaysVisibleContent={alwaysVisibleContent}
      primaryAction={primaryAction}
      quickActions={quickActions}
      dropdownActions={dropdownActions}
      isSelected={isSelected}
      onClick={() => onView?.(review)}
    />
  )
}
