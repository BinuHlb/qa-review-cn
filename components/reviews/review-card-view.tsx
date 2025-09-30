"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Edit, MoreHorizontal, Calendar, MapPin, User, Building, UserPlus, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type Review, getGradeColor, getStatusColor, getPriorityColor, getReviewerStatusColor } from "@/lib/mock-data"

interface ReviewCardViewProps {
  reviews: Review[]
  onView?: (review: Review) => void
  onEdit?: (review: Review) => void
  onAssign?: (review: Review) => void
}

export function ReviewCardView({ reviews, onView, onEdit, onAssign }: ReviewCardViewProps) {
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
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-cyan-500'
    ]
    
    let hash = 0
    for (let i = 0; i < firmName.length; i++) {
      hash = firmName.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => {
        const dateRange = formatDateRange(review.startDate, review.endDate)
        
        return (
          <Card key={review.id} className="shadow-none border-none bg-neutral-50 hover:bg-neutral-100 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src="" alt={review.memberFirm} />
                    <AvatarFallback className={`${generateFirmAvatarColor(review.memberFirm)} text-white text-sm font-semibold`}>
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
                    <DropdownMenuItem onClick={() => onEdit?.(review)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Review
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAssign?.(review)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Reviewer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Duration Timeline */}
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md">
                <Clock className="h-3 w-3 text-neutral-500" />
                <div className="flex items-center gap-1 text-xs">
                  <span className="font-medium text-neutral-700">{dateRange.start}</span>
                  <span className="text-neutral-400">→</span>
                  <span className="font-medium text-neutral-700">{dateRange.end}</span>
                  <span className="text-neutral-500">({dateRange.duration})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <User className="h-3 w-3" />
                    <span className="font-medium">Reviewer</span>
                  </div>
                  <div className="text-xs font-medium text-neutral-900 truncate" title={review.reviewer}>
                    {review.reviewer}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin className="h-3 w-3" />
                    <span className="font-medium">Country</span>
                  </div>
                  <div className="text-xs font-medium text-neutral-900 truncate" title={review.country}>
                    {review.country}
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-1">
                <Badge className={`${getGradeColor(review.currentGrade)} text-xs px-2 py-0.5`}>
                  {review.currentGrade}
                </Badge>
                <Badge className={`${getStatusColor(review.status)} text-xs px-2 py-0.5`}>
                  {review.status}
                </Badge>
                <Badge variant="outline" className={`${getPriorityColor(review.priority)} text-xs px-2 py-0.5`}>
                  {review.priority}
                </Badge>
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
                <div className="text-xs text-neutral-600 line-clamp-2">
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
                  Assign
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView?.(review)}
                  className="text-neutral-600 hover:text-neutral-900 h-7 w-7 p-0"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(review)}
                  className="text-neutral-600 hover:text-neutral-900 h-7 w-7 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
