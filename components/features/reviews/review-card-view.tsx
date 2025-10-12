"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, MoreHorizontal, MapPin, User, UserPlus, Clock } from "lucide-react"
import { Icon } from "@iconify/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PercentageBadge } from "@/components/common/percentage-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Review } from "@/types/entities"
import { 
  getGradeColor, 
  getStatusColor, 
  getPriorityColor, 
  getReviewerStatusColor,
  generateInitials,
  generateAvatarColor,
  formatDateRange
} from "@/lib/utils/review-utils"

interface ReviewCardViewProps {
  reviews: Review[]
  onView?: (review: Review) => void
  onEdit?: (review: Review) => void
  onAssign?: (review: Review) => void
}

export function ReviewCardView({ reviews, onView, onEdit, onAssign }: ReviewCardViewProps) {


  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => {
        const dateRange = formatDateRange(review.startDate, review.endDate)
        
        return (
          <Card key={review.id} className="shadow-none border-none bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src="" alt={review.memberFirm} />
                    <AvatarFallback className={`${generateAvatarColor(review.memberFirm)} text-sm font-semibold`}>
                      {generateInitials(review.memberFirm)}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onView?.(review)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log('Send to Teams:', review)}>
                      <Icon icon="logos:microsoft-teams" className="mr-2 h-4 w-4" />
                      Send to Teams
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log('Notifications:', review)}>
                      <Icon icon="mdi:bell-badge" className="mr-2 h-4 w-4 text-orange-500" />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
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

              {/* Status Badge with Percentage and Rating */}
              <div className="flex flex-wrap gap-2 items-center">
                <Badge className={`${getStatusColor(review.status)} text-xs px-2 py-0.5`}>
                  {review.status}
                </Badge>
                <PercentageBadge value={review.percentage || 0} />
                <Badge className={`${getGradeColor(review.currentGrade)} text-xs px-2 py-0.5`}>
                  {review.currentGrade}
                </Badge>
                <Badge variant="outline" className={`${getPriorityColor(review.priority)} text-xs px-2 py-0.5`}>
                  {review.priority}
                </Badge>
              </div>

              {/* Status Section */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 font-medium">Reviewer:</span>
                  <Badge variant="outline" className={`ml-1 ${getReviewerStatusColor(review.reviewerStatus)} text-xs px-2 py-0.5`}>
                    {review.reviewerStatus}
                  </Badge>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 font-medium">Partner:</span>
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

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAssign?.(review)}
                  className="text-xs h-7 px-2 flex-1"
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Assign Reviewer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView?.(review)}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 h-7 w-7 p-0"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
