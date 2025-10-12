"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { GradeSelect } from "./grade-select"
import { ActionPanelFormSection } from "@/components/common/panels/action-panel-layout"
import { Star, Send, ThumbsUp, ThumbsDown } from "lucide-react"
import { getGradeColor } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { GradeValue } from "@/lib/constants"

interface RatingFormProps {
  /** Current/previous grade to display as reference */
  currentGrade?: GradeValue
  /** Initial grade value */
  initialGrade?: string
  /** Initial notes value */
  initialNotes?: string
  /** Initial additional request value */
  initialAdditionalRequest?: string
  /** Form title */
  title?: string
  /** Form icon */
  icon?: React.ReactNode
  /** Form description */
  description?: string
  /** Form variant */
  variant?: "default" | "primary" | "warning"
  /** Show border around form section */
  showBorder?: boolean
  /** Grade label */
  gradeLabel?: string
  /** Notes label */
  notesLabel?: string
  /** Notes placeholder */
  notesPlaceholder?: string
  /** Show additional documents request field */
  showAdditionalDocsRequest?: boolean
  /** Additional documents request label */
  additionalDocsLabel?: string
  /** Additional documents request placeholder */
  additionalDocsPlaceholder?: string
  /** Submit button text */
  submitButtonText?: string
  /** Submit button loading text */
  submitButtonLoadingText?: string
  /** On submit handler */
  onSubmit: (grade: string, notes: string, additionalRequest?: string) => Promise<void>
  /** Show prospect decision buttons instead of grade select */
  isProspect?: boolean
  /** Prospect decision value */
  prospectDecision?: 'pass' | 'fail' | ''
  /** On prospect decision change */
  onProspectDecisionChange?: (decision: 'pass' | 'fail') => void
}

/**
 * Reusable rating form component for action panels
 * Standardizes the grade selection, notes, and submission pattern
 * Used in ReviewActionPanel, FinalReviewScreen, workflow drawers, etc.
 */
export function RatingForm({
  currentGrade,
  initialGrade = "",
  initialNotes = "",
  initialAdditionalRequest = "",
  title = "Submit Rating",
  icon,
  description,
  variant = "default",
  showBorder = false,
  gradeLabel = "Your Grade",
  notesLabel = "Review Notes (Optional)",
  notesPlaceholder = "Add your review comments and findings...",
  showAdditionalDocsRequest = false,
  additionalDocsLabel = "Request Additional Documents (Optional)",
  additionalDocsPlaceholder = "Specify any additional documents needed from the member firm",
  submitButtonText = "Submit Rating",
  submitButtonLoadingText = "Submitting...",
  onSubmit,
  isProspect = false,
  prospectDecision = '',
  onProspectDecisionChange
}: RatingFormProps) {
  const [selectedGrade, setSelectedGrade] = useState(initialGrade)
  const [notes, setNotes] = useState(initialNotes)
  const [additionalRequest, setAdditionalRequest] = useState(initialAdditionalRequest)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (isProspect) {
      if (!prospectDecision) return
      setIsSubmitting(true)
      try {
        await onSubmit(prospectDecision, notes, additionalRequest)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      if (!selectedGrade) return
      setIsSubmitting(true)
      try {
        await onSubmit(selectedGrade, notes, additionalRequest)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const defaultIcon = icon || <Star className="h-5 w-5 text-primary" />

  return (
    <ActionPanelFormSection
      title={title}
      icon={defaultIcon}
      description={description}
      variant={variant}
      showBorder={showBorder}
    >
      {/* Previous Grade Badge */}
      {currentGrade && (
        <Badge variant="outline" className={cn(getGradeColor(currentGrade), "text-xs mb-3")}>
          Previous: {currentGrade}/5
        </Badge>
      )}

      {/* Grade Selection */}
      {isProspect ? (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Final Decision *
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onProspectDecisionChange?.('pass')}
              className={cn(
                "relative flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95",
                prospectDecision === 'pass'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm'
                  : 'border-muted hover:border-green-300 bg-background'
              )}
            >
              <div className="flex flex-col items-center gap-1.5">
                <ThumbsUp className={cn(
                  "h-6 w-6",
                  prospectDecision === 'pass' ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'
                )} />
                <span className={cn(
                  "text-sm font-semibold",
                  prospectDecision === 'pass' ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'
                )}>
                  Pass
                </span>
              </div>
              {prospectDecision === 'pass' && (
                <Star className="absolute -top-1 -right-1 h-3.5 w-3.5 fill-green-600 text-green-600" />
              )}
            </button>
            
            <button
              type="button"
              onClick={() => onProspectDecisionChange?.('fail')}
              className={cn(
                "relative flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95",
                prospectDecision === 'fail'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-sm'
                  : 'border-muted hover:border-red-300 bg-background'
              )}
            >
              <div className="flex flex-col items-center gap-1.5">
                <ThumbsDown className={cn(
                  "h-6 w-6",
                  prospectDecision === 'fail' ? 'text-red-600 dark:text-red-500' : 'text-muted-foreground'
                )} />
                <span className={cn(
                  "text-sm font-semibold",
                  prospectDecision === 'fail' ? 'text-red-700 dark:text-red-400' : 'text-muted-foreground'
                )}>
                  Fail
                </span>
              </div>
              {prospectDecision === 'fail' && (
                <Star className="absolute -top-1 -right-1 h-3.5 w-3.5 fill-red-600 text-red-600" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <GradeSelect
          value={selectedGrade}
          onValueChange={setSelectedGrade}
          label={gradeLabel}
          placeholder="Select grade"
          required={true}
        />
      )}

      {/* Notes/Comments */}
      <div className="space-y-2">
        <Label htmlFor="rating-notes" className="text-xs font-medium text-muted-foreground">
          {notesLabel}
        </Label>
        <Textarea
          id="rating-notes"
          placeholder={notesPlaceholder}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="text-sm resize-none"
        />
      </div>

      {/* Additional Documents Request (Optional) */}
      {showAdditionalDocsRequest && (
        <div className="space-y-2">
          <Label htmlFor="additional-docs" className="text-xs font-medium text-muted-foreground">
            {additionalDocsLabel}
          </Label>
          <Textarea
            id="additional-docs"
            placeholder={additionalDocsPlaceholder}
            value={additionalRequest}
            onChange={(e) => setAdditionalRequest(e.target.value)}
            rows={2}
            className="text-sm resize-none"
          />
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || (isProspect ? !prospectDecision : !selectedGrade)}
        className="w-full"
      >
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? submitButtonLoadingText : submitButtonText}
      </Button>
    </ActionPanelFormSection>
  )
}

