"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
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
import type { Attachment } from "@/types/entities"
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

const gradeOptions = [
  { value: '1', label: 'Grade 1 - Excellent', description: 'Exceeds all quality standards', color: 'text-green-700' },
  { value: '2', label: 'Grade 2 - Good', description: 'Meets quality standards well', color: 'text-blue-700' },
  { value: '3', label: 'Grade 3 - Satisfactory', description: 'Meets minimum standards', color: 'text-yellow-700' },
  { value: '4', label: 'Grade 4 - Needs Improvement', description: 'Below minimum standards', color: 'text-orange-700' },
  { value: '5', label: 'Grade 5 - Poor', description: 'Significantly below standards', color: 'text-red-700' }
]

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
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Review Work: {review.memberFirm}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2 flex-wrap">
            {review.reviewType}-hour {review.reviewMode} review
            <WorkflowStatusBadge status={review.workflowStatus} size="sm" />
            <PercentageBadge value={review.percentage || 0} />
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Progress Indicator */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Form Completeness</Label>
                  <span className="text-sm font-bold text-primary">{formCompleteness}%</span>
                </div>
                <Progress value={formCompleteness} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Complete all required fields before submitting
                </p>
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
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Download & Review
              </Badge>
            </div>
            
            {review.documents && review.documents.length > 0 ? (
              <Card>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {review.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.size}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0"
                          onClick={() => console.log('Download:', doc.name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <p className="text-sm text-muted-foreground">No original documents available</p>
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
              <Badge variant="outline" className="bg-green-50 text-green-700">
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
              <div className="space-y-2">
                {reviewedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">
                Your Rating <span className="text-destructive">*</span>
              </Label>
            </div>
            
            <RadioGroup value={selectedGrade} onValueChange={setSelectedGrade}>
              <div className="space-y-2">
                {gradeOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${
                      selectedGrade === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={`grade-${option.value}`} className="mt-1" />
                    <div className="flex-1">
                      <label
                        htmlFor={`grade-${option.value}`}
                        className={`text-sm font-semibold cursor-pointer ${
                          selectedGrade === option.value ? 'text-primary' : option.color
                        }`}
                      >
                        {option.label}
                      </label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Comments */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="comments" className="text-sm font-medium">
                Detailed Comments <span className="text-destructive">*</span>
              </Label>
            </div>
            <Textarea
              id="comments"
              placeholder="Provide detailed findings from your review. Include specific observations about quality standards, documentation, processes, and any concerns identified..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 50 characters required ({comments.length}/50)
            </p>
          </div>

          {/* Strengths (Optional) */}
          <div className="space-y-3">
            <Label htmlFor="strengths" className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              Key Strengths (Optional)
            </Label>
            <Textarea
              id="strengths"
              placeholder="List the firm's key strengths and positive findings..."
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Areas for Improvement (Optional) */}
          <div className="space-y-3">
            <Label htmlFor="improvements" className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              Areas for Improvement (Optional)
            </Label>
            <Textarea
              id="improvements"
              placeholder="Identify areas that need attention or improvement..."
              value={areasForImprovement}
              onChange={(e) => setAreasForImprovement(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Recommendations (Optional) */}
          <div className="space-y-3">
            <Label htmlFor="recommendations" className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
              Recommendations (Optional)
            </Label>
            <Textarea
              id="recommendations"
              placeholder="Provide actionable recommendations for the firm..."
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Validation Checklist */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-4">
              <p className="text-sm font-medium mb-3">Before Submitting:</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  {selectedGrade ? (
                    <div className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={selectedGrade ? 'text-foreground' : 'text-muted-foreground'}>
                    Grade rating selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {comments.length >= 50 ? (
                    <div className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={comments.length >= 50 ? 'text-foreground' : 'text-muted-foreground'}>
                    Detailed comments provided (min 50 chars)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {reviewedFiles.length > 0 ? (
                    <div className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={reviewedFiles.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                    Reviewed files uploaded
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <SheetFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
          <Button
            onClick={handleSubmitReview}
            disabled={isSubmitting || !selectedGrade || comments.length < 50 || reviewedFiles.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

