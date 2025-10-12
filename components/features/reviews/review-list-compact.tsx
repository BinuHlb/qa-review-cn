"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, User } from "lucide-react"
import type { Review } from "@/types/entities"
import { getGradeColor, getStatusColor } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface ReviewListCompactProps {
  reviews: Review[]
  selectedReview: Review | null
  onSelectReview: (review: Review) => void
}

export function ReviewListCompact({ reviews, selectedReview, onSelectReview }: ReviewListCompactProps) {
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

  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400">
        <div className="text-center space-y-2">
          <Building2 className="h-12 w-12 mx-auto opacity-20" />
          <p className="text-sm">No reviews found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {reviews.map((review) => (
        <Card
          key={review.id}
          className={cn(
            "cursor-pointer transition-all duration-200 shadow-none border hover:shadow-md",
            selectedReview?.id === review.id
              ? "border-primary bg-primary/10 shadow-md"
              : "border-neutral-200 bg-white hover:bg-neutral-50"
          )}
          onClick={() => onSelectReview(review)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Firm Info */}
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className={`${generateFirmAvatarColor(review.memberFirm)} text-sm font-semibold`}>
                    {generateFirmInitials(review.memberFirm)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate mb-0.5" title={review.memberFirm}>
                        {review.memberFirm}
                      </h3>
                      <p className="text-xs text-neutral-500 truncate" title={review.type}>
                        {review.type}
                      </p>
                    </div>
                    <Badge className={`${getGradeColor(review.currentGrade)} text-xs px-2 py-0.5 flex-shrink-0`}>
                      {review.currentGrade}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick View Info */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 bg-green-50 rounded">
                    <User className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-400">Reviewer</p>
                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate" title={review.reviewer}>
                      {review.reviewer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Badge className={`${getStatusColor(review.status)} text-xs px-2 py-0.5`}>
                    {review.status}
                  </Badge>
                </div>
              </div>

              {/* Review ID */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-400 font-mono">{review.id}</span>
                <span className="text-xs text-neutral-400">
                  {new Date(review.lastUpdated).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

