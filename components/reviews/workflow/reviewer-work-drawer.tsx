"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { GradeSelect } from "@/components/shared/grade-select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { 
  FileText,
  Upload,
  Send,
  Download,
  Award,
  MessageSquare,
  Lightbulb,
  AlertCircle
} from "lucide-react"
import type { Review } from "@/types/entities"
import { WorkflowStatusBadge } from "@/components/shared/workflow-status-badge"
import { PercentageBadge } from "@/components/shared/percentage-badge"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ReviewerWorkDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  review: Review | null
  onSubmit?: (reviewId: string, data: {
    grade: string
    comments: string
    strengths?: string
    areasForImprovement?: string
    recommendations?: string
    reviewedFiles: File[]
  }) => Promise<void>
}

export function ReviewerWorkDrawer({
  open,
  onOpenChange,
  review,
  onSubmit
}: ReviewerWorkDrawerProps) {
  const { toast } = useToast()
  
  // Form state
  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [comments, setComments] = useState("")
  const [strengths, setStrengths] = useState("")
  const [areasForImprovement, setAreasForImprovement] = useState("")
  const [recommendations, setRecommendations] = useState("")
  const [reviewedFiles, setReviewedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    setReviewedFiles(prev => [...prev, ...fileArray])
  }

  const handleRemoveFile = (index: number) => {
    setReviewedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmitReview = async () => {
    if (!review || !onSubmit) return

    // Validation
    if (!selectedGrade) {
      toast({
        title: "Error",
        description: "Please select a grade rating.",
        variant: "destructive"
      })
      return
    }

    if (!comments.trim()) {
      toast({
        title: "Error",
        description: "Please provide detailed comments.",
        variant: "destructive"
      })
      return
    }

    if (reviewedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one reviewed file.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(review.id, {
        grade: selectedGrade,
        comments,
        strengths,
        areasForImprovement,
        recommendations,
        reviewedFiles
      })
      
      toast({
        title: "Review Submitted",
        description: "Your review has been submitted for verification.",
        variant: "default"
      })
      
      // Reset form
      setSelectedGrade("")
      setComments("")
      setStrengths("")
      setAreasForImprovement("")
      setRecommendations("")
      setReviewedFiles([])
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your progress has been saved.",
      variant: "default"
    })
  }

  if (!review) return null

  const formCompleteness = 
    (selectedGrade ? 25 : 0) +
    (comments.trim() ? 25 : 0) +
    (reviewedFiles.length > 0 ? 25 : 0) +
    ((strengths.trim() || areasForImprovement.trim()) ? 25 : 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b dark:border-neutral-700">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Review Work: {review.memberFirm}
          </SheetTitle>
          <SheetDescription>
            {review.reviewType}-hour {review.reviewMode} review
          </SheetDescription>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <WorkflowStatusBadge status={review.workflowStatus} size="sm" />
            <PercentageBadge value={review.percentage || 0} />
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-4">
          {/* Progress Indicator */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Form Completeness</Label>
                  <span className="text-xs font-bold text-primary">{formCompleteness}%</span>
                </div>
                <Progress value={formCompleteness} className="h-1.5" />
              </div>
            </CardContent>
          </Card>

          {/* Original Documents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">
                  Original Documents ({review.documents?.length || 0})
                </Label>
              </div>
              <Badge variant="outline" className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 dark:border-primary/40">
                Download & Review
              </Badge>
            </div>
            
            {review.documents && review.documents.length > 0 ? (
              <Card className="border-primary/30 dark:border-primary/40 bg-primary/5 dark:bg-primary/10">
                <CardContent className="p-4">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {review.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-md bg-background hover:bg-secondary/80 transition-colors border border-border"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.size}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0 ml-2"
                          onClick={() => console.log('Download:', doc.name)}
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <p className="text-sm text-muted-foreground italic">No original documents available</p>
            )}
          </div>

          <Separator />

          {/* Upload Reviewed Files */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">
                  Upload Reviewed Files <span className="text-destructive">*</span>
                </Label>
              </div>
              <Badge variant="outline" className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 dark:border-primary/40">
                {reviewedFiles.length} file(s) ready
              </Badge>
            </div>
            
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Click to upload reviewed files</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, Word, Excel files accepted
                      </p>
                    </div>
                  </div>
                </label>
              </CardContent>
            </Card>

            {reviewedFiles.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {reviewedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/30 dark:border-primary/40"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex-shrink-0"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Rating Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">
                  Your Rating <span className="text-destructive">*</span>
                </Label>
              </div>
              {review.reviewerRating?.grade && (
                <Badge variant="outline" className="text-xs bg-muted">
                  Previous: {review.reviewerRating.grade}/5
                </Badge>
              )}
            </div>
            
            <GradeSelect
              value={selectedGrade}
              onValueChange={setSelectedGrade}
              placeholder="Select grade (1-5)"
              required={true}
            />
          </div>

          <Separator />

          {/* Comments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="comments" className="text-sm font-medium">
                  Detailed Comments <span className="text-destructive">*</span>
                </Label>
              </div>
              <span className="text-xs text-muted-foreground">
                {comments.length}/50 chars
              </span>
            </div>
            <Textarea
              id="comments"
              placeholder="Provide detailed findings from your review. Include specific observations about quality standards, documentation, processes, and any concerns identified..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Strengths (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="strengths" className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              Key Strengths (Optional)
            </Label>
            <Textarea
              id="strengths"
              placeholder="List the firm's key strengths and positive findings..."
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Areas for Improvement (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="improvements" className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              Areas for Improvement (Optional)
            </Label>
            <Textarea
              id="improvements"
              placeholder="Identify areas that need attention or improvement..."
              value={areasForImprovement}
              onChange={(e) => setAreasForImprovement(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Recommendations (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="recommendations" className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
              Recommendations (Optional)
            </Label>
            <Textarea
              id="recommendations"
              placeholder="Provide actionable recommendations for the firm..."
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          </div>
        </div>

        {/* Fixed Footer with Validation & Actions */}
        <div className="border-t dark:border-neutral-700 bg-muted/30">
          {/* Compact Validation Status */}
          <div className="px-6 py-3 border-b dark:border-neutral-700/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Ready to submit:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {selectedGrade ? (
                    <div className="h-3 w-3 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span className="text-muted-foreground">Grade</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {comments.length >= 50 ? (
                    <div className="h-3 w-3 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span className="text-muted-foreground">Comments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {reviewedFiles.length > 0 ? (
                    <div className="h-3 w-3 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span className="text-muted-foreground">Files</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="flex-1"
                disabled={isSubmitting}
              >
                Save Draft
              </Button>
              <Button
                type="button"
                onClick={handleSubmitReview}
                className="flex-1"
                disabled={isSubmitting || !selectedGrade || comments.length < 50 || reviewedFiles.length === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

