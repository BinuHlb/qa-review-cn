"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, MapPin, User, UserPlus, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { Icon } from "@iconify/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PercentageBadge } from "@/components/shared/percentage-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Review } from "@/types/entities"
import { getGradeColor, getStatusColor, getPriorityColor, getReviewerStatusColor } from "@/lib/mock-data"

interface ReviewItemProps {
  review: Review
  viewMode: "list" | "card"
  isSelected?: boolean
  onView?: (review: Review) => void
  onEdit?: (review: Review) => void
  onAssign?: (review: Review) => void
}

export function ReviewItem({ review, viewMode, isSelected = false, onView, onEdit, onAssign }: ReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
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

  if (viewMode === "list") {
    return (
      <Card 
        className={`shadow-none border-none transition-all duration-300 cursor-pointer ${
          isSelected 
            ? 'bg-primary/10 dark:bg-primary/20 hover:bg-primary/10 dark:hover:bg-primary/20 border-l-4 border-l-primary' 
            : 'bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800'
        }`}
        onClick={() => onView?.(review)}
      >
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* Main Row - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              {/* Main Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="" alt={review.memberFirm} />
                    <AvatarFallback className={`${generateFirmAvatarColor(review.memberFirm)} text-xs font-semibold`}>
                      {generateFirmInitials(review.memberFirm)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate" title={review.memberFirm}>
                        {review.memberFirm}
                      </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(!isExpanded)
                  }}
                  className="text-neutral-500 hover:text-neutral-700 h-5 w-5 p-0 flex-shrink-0"
                >
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate" title={review.type}>
                      {review.type}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Info - Hidden on mobile, visible on larger screens */}
              <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
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
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(review.status)} text-xs px-2 py-0.5`}>
                    {review.status}
                  </Badge>
                  <PercentageBadge value={review.percentage || 0} />
                  <Badge className={`${getGradeColor(review.currentGrade)} text-xs px-2 py-0.5`}>
                    {review.currentGrade}
                  </Badge>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {onAssign && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAssign(review)
                    }}
                    className="text-xs h-7 px-2"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Assign</span>
                  </Button>
                )}

                {(onEdit || onAssign) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 h-7 w-7 p-0"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        console.log('Send to Teams:', review)
                      }}>
                        <Icon icon="logos:microsoft-teams" className="mr-2 h-4 w-4" />
                        Send to Teams
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        console.log('Notifications:', review)
                      }}>
                        <Icon icon="mdi:bell-badge" className="mr-2 h-4 w-4 text-orange-500" />
                        Notifications
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        console.log('Conditions:', review)
                      }}>
                        <Icon icon="mdi:alert-circle" className="mr-2 h-4 w-4 text-red-500" />
                        Conditions
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Mobile Duration and Status - Visible only on mobile */}
            <div className="flex sm:hidden items-center justify-between gap-2">
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
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(review.status)} text-xs px-2 py-0.5`}>
                  {review.status}
                </Badge>
                <PercentageBadge value={review.percentage || 0} />
                <Badge className={`${getGradeColor(review.currentGrade)} text-xs px-2 py-0.5`}>
                  {review.currentGrade}
                </Badge>
              </div>
            </div>

            {/* Expandable Content */}
            <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <User className="h-3 w-3" />
                      <span className="font-medium">Reviewer</span>
                    </div>
                    <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate" title={review.reviewer}>
                      {review.reviewer}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <MapPin className="h-3 w-3" />
                      <span className="font-medium">Country</span>
                    </div>
                    <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate" title={review.country}>
                      {review.country}
                    </div>
                  </div>
                </div>

                {/* Additional Status Badges */}
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className={`${getPriorityColor(review.priority)} text-xs px-2 py-0.5`}>
                    {review.priority}
                  </Badge>
                  {review.previousRating && (
                    <Badge variant="outline" className="bg-muted text-xs px-2 py-0.5">
                      Previous: {review.previousRating}/5
                    </Badge>
                  )}
                </div>

                {/* Status Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-500 font-medium">Reviewer:</span>
                    <Badge variant="outline" className={`ml-1 ${getReviewerStatusColor(review.reviewerStatus)} text-xs px-2 py-0.5`}>
                      {review.reviewerStatus}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-medium">Partner:</span>
                    <Badge variant="outline" className={`ml-1 ${getReviewerStatusColor(review.partnerStatus)} text-xs px-2 py-0.5`}>
                      {review.partnerStatus}
                    </Badge>
                  </div>
                </div>

                {review.description && (
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {review.description}
                  </div>
                )}

              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    )
  }

  // Card view
  return (
    <Card 
      className={`shadow-none border-none transition-all duration-300 cursor-pointer h-full flex flex-col ${
        isSelected 
          ? 'bg-primary/10 dark:bg-primary/20 hover:bg-primary/10 dark:hover:bg-primary/20 border-l-4 border-l-primary' 
          : 'bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800'
      }`}
      onClick={() => onView?.(review)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src="" alt={review.memberFirm} />
              <AvatarFallback className={`${generateFirmAvatarColor(review.memberFirm)} text-sm font-semibold`}>
                {generateFirmInitials(review.memberFirm)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base truncate" title={review.memberFirm}>
                {review.memberFirm}
              </CardTitle>
              <CardDescription className="text-xs truncate" title={review.type}>
                {review.type}
              </CardDescription>
            </div>
          </div>
          {(onEdit || onAssign) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  console.log('Send to Teams:', review)
                }}>
                  <Icon icon="logos:microsoft-teams" className="mr-2 h-4 w-4" />
                  Send to Teams
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  console.log('Notifications:', review)
                }}>
                  <Icon icon="mdi:bell-badge" className="mr-2 h-4 w-4 text-orange-500" />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 flex flex-col">
        {/* Duration Timeline - Always Visible */}
        <div className="flex items-center gap-2 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-md">
          <Clock className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
          <div className="flex items-center gap-1 text-xs">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{dateRange.start}</span>
            <span className="text-neutral-400 dark:text-neutral-500">→</span>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{dateRange.end}</span>
            <span className="text-neutral-500 dark:text-neutral-400">({dateRange.duration})</span>
          </div>
        </div>

        {/* Main Status Badge with Percentage and Rating - Always Visible */}
        <div className="flex flex-wrap gap-2 items-center">
          <Badge className={`${getStatusColor(review.status)} text-xs px-2 py-0.5`}>
            {review.status}
          </Badge>
          <PercentageBadge value={review.percentage || 0} />
          <Badge className={`${getGradeColor(review.currentGrade)} text-xs px-2 py-0.5`}>
            {review.currentGrade}
          </Badge>
        </div>

        {/* Show More and Assign Button in Same Row */}
        <div className="flex justify-between items-center pt-1 mt-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="text-neutral-500 hover:text-neutral-700 h-6 px-2 text-xs"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show More
              </>
            )}
          </Button>
          {onAssign && (
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
              Assign Reviewer
            </Button>
          )}
        </div>

        {/* Expandable Content */}
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <User className="h-3 w-3" />
                    <span className="font-medium">Reviewer</span>
                  </div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate" title={review.reviewer}>
                    {review.reviewer}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <MapPin className="h-3 w-3" />
                    <span className="font-medium">Country</span>
                  </div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate" title={review.country}>
                    {review.country}
                  </div>
                </div>
              </div>

            {/* Additional Status Badges */}
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className={`${getPriorityColor(review.priority)} text-xs px-2 py-0.5`}>
                {review.priority}
              </Badge>
              {review.previousRating && (
                <Badge variant="outline" className="bg-muted text-xs px-2 py-0.5">
                  Previous: {review.previousRating}/5
                </Badge>
              )}
            </div>

            {/* Status Section */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-neutral-500 font-medium">Reviewer:</span>
                <Badge variant="outline" className={`ml-1 ${getReviewerStatusColor(review.reviewerStatus)} text-xs px-2 py-0.5`}>
                  {review.reviewerStatus}
                </Badge>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Partner:</span>
                <Badge variant="outline" className={`ml-1 ${getReviewerStatusColor(review.partnerStatus)} text-xs px-2 py-0.5`}>
                  {review.partnerStatus}
                </Badge>
              </div>
            </div>

            {review.description && (
              <div className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {review.description}
              </div>
            )}

          </div>
        </div>
      </CardContent>
    </Card>
  )
}
