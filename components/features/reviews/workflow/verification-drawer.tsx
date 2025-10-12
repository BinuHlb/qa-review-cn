"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet"
import { 
  Shield,
  Award,
  MessageSquare,
  FileText,
  Send,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import type { Review } from "@/types/entities"
import { WorkflowStatusBadge } from "@/components/common/workflow-status-badge"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/formatters"
import { DATE_FORMATS } from "@/lib/constants"

interface VerificationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  review: Review | null
  onVerify?: (reviewId: string, data: {
    grade: string
    originalGrade: string
    modified: boolean
    verificationNotes: string
    agreementLevel: 'full' | 'partial' | 'disagree'
    additionalFindings?: string
  }) => Promise<void>
}

const gradeOptions = [
  { value: '1', label: 'Grade 1', description: 'Excellent' },
  { value: '2', label: 'Grade 2', description: 'Good' },
  { value: '3', label: 'Grade 3', description: 'Satisfactory' },
  { value: '4', label: 'Grade 4', description: 'Needs Improvement' },
  { value: '5', label: 'Grade 5', description: 'Poor' }
]

export function VerificationDrawer({
  open,
  onOpenChange,
  review,
  onVerify
}: VerificationDrawerProps) {
  const { toast } = useToast()
  
  // Form state
  const [verifiedGrade, setVerifiedGrade] = useState<string>("")
  const [agreementLevel, setAgreementLevel] = useState<'full' | 'partial' | 'disagree'>('full')
  const [verificationNotes, setVerificationNotes] = useState("")
  const [additionalFindings, setAdditionalFindings] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize with reviewer's grade when drawer opens
  const reviewerGrade = review?.reviewerRating?.grade || '3'
  const initialGrade = verifiedGrade || reviewerGrade

  const handleVerifyReview = async () => {
    if (!review || !onVerify) return

    // Validation
    if (!verifiedGrade) {
      toast({
        title: "Error",
        description: "Please select a grade.",
        variant: "destructive"
      })
      return
    }

    if (!verificationNotes.trim()) {
      toast({
        title: "Error",
        description: "Please provide verification notes.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onVerify(review.id, {
        grade: verifiedGrade,
        originalGrade: reviewerGrade,
        modified: verifiedGrade !== reviewerGrade,
        verificationNotes,
        agreementLevel,
        additionalFindings
      })
      
      toast({
        title: "Review Verified",
        description: "Review has been sent to CEO for final approval.",
        variant: "default"
      })
      
      // Reset form
      setVerifiedGrade("")
      setVerificationNotes("")
      setAdditionalFindings("")
      setAgreementLevel('full')
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify review. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!review || !review.reviewerRating) return null

  const isModified = verifiedGrade && verifiedGrade !== reviewerGrade

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-violet-600" />
            Verify Review: {review.memberFirm}
          </SheetTitle>
          <SheetDescription>
            Review the assessment and provide your verification
          </SheetDescription>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <WorkflowStatusBadge status={review.workflowStatus} size="sm" />
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
          {/* Reviewer's Assessment */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Reviewer&apos;s Assessment</h3>
              </div>

              {/* Reviewer Grade */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                <div>
                  <p className="text-xs text-muted-foreground">Reviewer&apos;s Grade</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {review.reviewerRating.grade}/5
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {gradeOptions.find(g => g.value === review.reviewerRating?.grade)?.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">By</p>
                  <p className="font-medium text-sm">{review.reviewer}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(review.reviewerRating.submittedAt, DATE_FORMATS.DISPLAY)}
                  </p>
                </div>
              </div>

              {/* Reviewer Comments */}
              <div>
                <Label className="text-xs text-muted-foreground">Comments</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">{review.reviewerRating.comments}</p>
              </div>

              {review.reviewerRating.strengths && (
                <div>
                  <Label className="text-xs text-muted-foreground">Strengths</Label>
                  <p className="text-sm mt-1">{review.reviewerRating.strengths}</p>
                </div>
              )}

              {review.reviewerRating.areasForImprovement && (
                <div>
                  <Label className="text-xs text-muted-foreground">Areas for Improvement</Label>
                  <p className="text-sm mt-1">{review.reviewerRating.areasForImprovement}</p>
                </div>
              )}

              {review.reviewerRating.recommendations && (
                <div>
                  <Label className="text-xs text-muted-foreground">Recommendations</Label>
                  <p className="text-sm mt-1">{review.reviewerRating.recommendations}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                <FileText className="h-3 w-3" />
                <span>Time spent: {review.reviewerRating.timeSpentHours} hours</span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Your Verification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Your Verification</Label>
            </div>

            {/* Quick Action: Agree or Modify */}
            <div className="space-y-3">
              <Label className="text-sm">Do you agree with the reviewer&apos;s grade of {reviewerGrade}/5?</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={verifiedGrade === reviewerGrade ? "default" : "outline"}
                  onClick={() => {
                    setVerifiedGrade(reviewerGrade)
                    setAgreementLevel('full')
                  }}
                  className="h-auto py-4"
                >
                  <div className="text-center">
                    <CheckCircle className="h-5 w-5 mx-auto mb-1" />
                    <p className="font-semibold">Yes, Confirm Grade {reviewerGrade}</p>
                    <p className="text-xs opacity-80">Full agreement</p>
                  </div>
                </Button>
                <Button
                  variant={verifiedGrade && verifiedGrade !== reviewerGrade ? "default" : "outline"}
                  onClick={() => {
                    setVerifiedGrade("")
                    setAgreementLevel('partial')
                  }}
                  className="h-auto py-4"
                >
                  <div className="text-center">
                    <AlertTriangle className="h-5 w-5 mx-auto mb-1" />
                    <p className="font-semibold">No, Modify Grade</p>
                    <p className="text-xs opacity-80">Select different grade</p>
                  </div>
                </Button>
              </div>
            </div>

            {/* Grade Selection (if modifying) */}
            {verifiedGrade && verifiedGrade !== reviewerGrade && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="modified-grade" className="text-sm font-medium">
                    Your Verified Grade <span className="text-destructive">*</span>
                  </Label>
                  {review.technicalDirectorVerification?.grade && (
                    <Badge variant="outline" className="text-xs bg-violet-50 text-violet-700">
                      Previous TD: {review.technicalDirectorVerification.grade}/5
                    </Badge>
                  )}
                </div>
                <Select value={verifiedGrade} onValueChange={setVerifiedGrade}>
                  <SelectTrigger id="modified-grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} - {option.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isModified && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                    Modified from Reviewer Grade {reviewerGrade} to {verifiedGrade}
                  </Badge>
                )}
              </div>
            )}

            {/* Agreement Level */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Agreement Level</Label>
              <RadioGroup value={agreementLevel} onValueChange={(v) => setAgreementLevel(v as 'full' | 'partial' | 'disagree')}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <label htmlFor="full" className="text-sm cursor-pointer">
                      Full Agreement - Completely agree with assessment
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partial" id="partial" />
                    <label htmlFor="partial" className="text-sm cursor-pointer">
                      Partial Agreement - Agree overall but with some differences
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="disagree" id="disagree" />
                    <label htmlFor="disagree" className="text-sm cursor-pointer">
                      Disagree - Significant differences in assessment
                    </label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Verification Notes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="verification-notes" className="text-sm font-medium">
                  Verification Notes <span className="text-destructive">*</span>
                </Label>
              </div>
              <Textarea
                id="verification-notes"
                placeholder={
                  verifiedGrade === reviewerGrade
                    ? "Explain why you agree with the reviewer&apos;s assessment..."
                    : "Explain your reasoning for modifying the grade..."
                }
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 30 characters required ({verificationNotes.length}/30)
              </p>
            </div>

            {/* Additional Findings (Optional) */}
            <div className="space-y-3">
              <Label htmlFor="additional-findings" className="text-sm font-medium">
                Additional Findings (Optional)
              </Label>
              <Textarea
                id="additional-findings"
                placeholder="Add any additional observations or findings not covered by the reviewer..."
                value={additionalFindings}
                onChange={(e) => setAdditionalFindings(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          {/* Summary Card */}
          <Card className="border-violet-200 bg-violet-50/30">
            <CardContent className="pt-4">
              <p className="text-sm font-medium mb-3">Verification Summary:</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reviewer Grade:</span>
                  <span className="font-semibold">{reviewerGrade}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Verified Grade:</span>
                  <span className="font-semibold text-violet-600">
                    {verifiedGrade || '(Select above)'}/5
                    {isModified && <span className="text-amber-600 ml-1">(Modified)</span>}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agreement:</span>
                  <Badge variant="outline" className="capitalize">
                    {agreementLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-muted/30">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleVerifyReview}
              className="flex-1"
              disabled={isSubmitting || !verifiedGrade || verificationNotes.length < 30}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Verifying...' : 'Verify & Send to CEO'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

