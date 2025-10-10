"use client"

import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  Circle,
  User,
  Shield,
  Star,
  type LucideIcon
} from "lucide-react"
import type { Review } from "@/types/entities"

export interface TimelineStage {
  id: string
  title: string
  description: string
  status: 'completed' | 'current' | 'pending'
  user?: string
  date?: string
  grade?: string
  notes?: string
  icon: LucideIcon
}

interface ReviewTimelineProps {
  review: Review
  reviewerGrade?: string
  reviewerNotes?: string
  reviewerDate?: string
  technicalDirectorGrade?: string
  technicalDirectorNotes?: string
  technicalDirectorDate?: string
  finalReviewStatus?: 'approved' | 'rejected' | 'pending'
  finalReviewNotes?: string
  finalReviewDate?: string
}

export function ReviewTimeline({
  review,
  reviewerGrade,
  reviewerNotes,
  reviewerDate,
  technicalDirectorGrade,
  technicalDirectorNotes,
  technicalDirectorDate,
  finalReviewStatus = 'pending',
  finalReviewNotes,
  finalReviewDate
}: ReviewTimelineProps) {
  
  // Determine stage statuses based on review status
  const getStageStatus = (stageId: string): 'completed' | 'current' | 'pending' => {
    if (stageId === 'reviewer') {
      return review.status === 'In Progress' || review.status === 'Pending' 
        ? 'current' 
        : 'completed'
    }
    if (stageId === 'technical-director') {
      return review.status === 'Submitted' 
        ? 'current'
        : review.status === 'Completed'
        ? 'completed'
        : 'pending'
    }
    if (stageId === 'final-review') {
      return review.status === 'Completed'
        ? 'completed'
        : 'pending'
    }
    return 'pending'
  }

  const stages: TimelineStage[] = [
    {
      id: 'reviewer',
      title: 'Reviewer',
      description: review.reviewer || 'Awaiting assignment',
      status: getStageStatus('reviewer'),
      user: review.reviewer,
      date: reviewerDate || review.lastUpdated,
      grade: reviewerGrade || (review.status !== 'Pending' ? review.currentGrade : undefined),
      notes: reviewerNotes,
      icon: User
    },
    {
      id: 'technical-director',
      title: 'Technical Director',
      description: technicalDirectorGrade ? 'Review completed' : 'Awaiting review',
      status: getStageStatus('technical-director'),
      user: 'Technical Director',
      date: technicalDirectorDate,
      grade: technicalDirectorGrade,
      notes: technicalDirectorNotes,
      icon: Shield
    },
    {
      id: 'final-review',
      title: 'Final Review',
      description: finalReviewStatus === 'approved' 
        ? 'Approved' 
        : finalReviewStatus === 'rejected'
        ? 'Rejected'
        : 'Pending approval',
      status: getStageStatus('final-review'),
      user: 'CEO / Administrator',
      date: finalReviewDate,
      notes: finalReviewNotes,
      icon: Star
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <h3 className="font-semibold text-sm text-foreground">Review Timeline</h3>
      </div>

      <div className="space-y-1">
        {stages.map((stage, index) => {
          const Icon = stage.icon
          const isLast = index === stages.length - 1
          const isCompleted = stage.status === 'completed'
          const isCurrent = stage.status === 'current'

          return (
            <div key={stage.id} className="relative">
              {/* Timeline connector line */}
              {!isLast && (
                <div 
                  className={`absolute left-[15px] top-8 bottom-0 w-[2px] ${
                    isCompleted ? 'bg-primary/30' : 'bg-border'
                  }`}
                  style={{ height: 'calc(100% - 8px)' }}
                />
              )}

              {/* Stage row */}
              <div className={`flex items-start gap-3 py-2 px-2 rounded-lg transition-colors ${
                isCurrent ? 'bg-accent/50' : ''
              }`}>
                {/* Icon */}
                <div className="flex-shrink-0 relative z-10">
                  {isCompleted ? (
                    <CheckCircle2 className="h-[30px] w-[30px] text-primary" />
                  ) : isCurrent ? (
                    <div className="h-[30px] w-[30px] rounded-full border-2 border-primary bg-background flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  ) : (
                    <Circle className="h-[30px] w-[30px] text-muted-foreground/30" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-medium text-sm ${
                      isCompleted ? 'text-foreground' : isCurrent ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {stage.title}
                    </h4>
                    {isCurrent && (
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stage.description}
                  </p>

                  {/* Details when completed or current */}
                  {(isCompleted || isCurrent) && (
                    <div className="mt-1.5 space-y-1">
                      {stage.grade && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-medium px-2 py-0">
                            Grade {stage.grade}
                          </Badge>
                          {stage.date && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(stage.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                      )}
                      {stage.notes && (
                        <p className="text-xs text-muted-foreground italic pl-2 border-l-2 border-border">
                          {stage.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

