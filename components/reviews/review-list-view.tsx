"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Edit, MoreHorizontal, MapPin, User, UserPlus, Clock, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type Review, getGradeColor, getStatusColor, getReviewerStatusColor } from "@/lib/mock-data"

interface ReviewListViewProps {
  reviews: Review[]
  onView?: (review: Review) => void
  onEdit?: (review: Review) => void
  onAssign?: (review: Review) => void
}

export function ReviewListView({ reviews, onEdit, onAssign }: ReviewListViewProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  const handleViewDetails = (review: Review) => {
    setSelectedReview(review)
  }

  const handleCloseDialog = () => {
    setSelectedReview(null)
  }

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

  return (
    <>
      <div className="space-y-1">
        {reviews.map((review) => {
          const dateRange = formatDateRange(review.startDate, review.endDate)
          
          return (
            <Card key={review.id} className="shadow-none border-none bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-2 min-w-0">
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
                        <h3 className="font-semibold text-sm text-neutral-900 truncate" title={review.memberFirm}>
                          {review.memberFirm}
                        </h3>
                        <p className="text-xs text-neutral-600 truncate" title={review.type}>
                          {review.type}
                        </p>
                      </div>
                    </div>
                    
                    {/* Duration Timeline */}
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md flex-shrink-0">
                      <Clock className="h-3 w-3 text-neutral-500" />
                      <div className="flex items-center gap-1 text-xs whitespace-nowrap">
                        <span className="font-medium text-neutral-700">{dateRange.start}</span>
                        <span className="text-neutral-400">→</span>
                        <span className="font-medium text-neutral-700">{dateRange.end}</span>
                        <span className="text-neutral-500">({dateRange.duration})</span>
                      </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Badge className={`${getStatusColor(review.status)} text-xs px-2 py-0.5`}>
                        {review.status}
                      </Badge>
                      <Badge className={`${getGradeColor(review.currentGrade)} text-xs px-2 py-0.5`}>
                        {review.currentGrade}
                      </Badge>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAssign?.(review)}
                      className="text-xs h-7 px-2"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Assign Reviewer
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(review)}
                      className="text-neutral-600 hover:text-neutral-900 h-7 w-7 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-neutral-600 hover:text-neutral-900 h-7 w-7 p-0"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleViewDetails(review)}>
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
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-neutral-800">
              Review Details
            </DialogTitle>
            <DialogDescription className="text-neutral-600">
              Complete information for this QA review
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600">Member Firm</label>
                  <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="" alt={selectedReview.memberFirm} />
                      <AvatarFallback className={`${generateFirmAvatarColor(selectedReview.memberFirm)} text-xs font-semibold`}>
                        {generateFirmInitials(selectedReview.memberFirm)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-neutral-800">{selectedReview.memberFirm}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600">Review Type</label>
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <span className="text-neutral-800">{selectedReview.type}</span>
                  </div>
                </div>
              </div>

              {/* Reviewer Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600">Reviewer</label>
                  <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                    <User className="h-4 w-4 text-neutral-500" />
                    <span className="text-neutral-800">{selectedReview.reviewer}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600">Country</label>
                  <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-neutral-500" />
                    <span className="text-neutral-800">{selectedReview.country}</span>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600">Reviewer Status</label>
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <Badge variant="outline" className={`${getReviewerStatusColor(selectedReview.reviewerStatus)}`}>
                      {selectedReview.reviewerStatus}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600">Partner Status</label>
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <Badge variant="outline" className={`${getReviewerStatusColor(selectedReview.partnerStatus)}`}>
                      {selectedReview.partnerStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600">Start Date</label>
                  <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-neutral-500" />
                    <span className="text-neutral-800">{new Date(selectedReview.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600">End Date</label>
                  <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-neutral-500" />
                    <span className="text-neutral-800">{new Date(selectedReview.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Grade and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600">Current Grade</label>
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <Badge className={`${getGradeColor(selectedReview.currentGrade)}`}>
                      {selectedReview.currentGrade}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600">Overall Status</label>
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <Badge className={`${getStatusColor(selectedReview.status)}`}>
                      {selectedReview.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Close
                </Button>
                <Button onClick={() => onEdit?.(selectedReview)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
