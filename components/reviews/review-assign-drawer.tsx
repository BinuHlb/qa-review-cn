"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { 
  UserPlus, 
  Building2, 
  AlertTriangle
} from "lucide-react"
import { type Review } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface ReviewAssignDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  review: Review | null
  reviewers?: Array<{ id: string; name: string; role: string; status: string; email?: string; specialization?: string[] }>
  onAssign?: (reviewId: string, data: {
    reviewerId: string
    reviewType: string
    reviewMode: string
    assignDate: string
    deadlineDate: string
    teamMeetingLink: string
    forceAssignment: boolean
  }) => Promise<void>
  onUpdate?: (reviewId: string, data: {
    reviewerId: string
    reviewType: string
    reviewMode: string
    assignDate: string
    deadlineDate: string
    teamMeetingLink: string
    forceAssignment: boolean
  }) => Promise<void>
  preSelectedReviewerId?: string
  isEditMode?: boolean
}

export function ReviewAssignDrawer({ 
  open, 
  onOpenChange, 
  review, 
  reviewers = [], 
  onAssign,
  onUpdate,
  preSelectedReviewerId = "",
  isEditMode = false
}: ReviewAssignDrawerProps) {
  const [formData, setFormData] = useState({
    reviewerId: preSelectedReviewerId,
    reviewType: "normal",
    reviewMode: "",
    assignDate: "",
    deadlineDate: "",
    teamMeetingLink: "",
    forceAssignment: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent, action: 'assign' | 'update') => {
    e.preventDefault()
    
    if (!review) return
    if (action === 'assign' && !onAssign) return
    if (action === 'update' && !onUpdate) return

    // Validation
    if (!formData.reviewerId) {
      toast({
        title: "Error",
        description: "Please select a reviewer",
        variant: "destructive"
      })
      return
    }

    if (!formData.reviewMode) {
      toast({
        title: "Error",
        description: "Please select a review mode",
        variant: "destructive"
      })
      return
    }

    if (!formData.assignDate) {
      toast({
        title: "Error",
        description: "Please select an assign date",
        variant: "destructive"
      })
      return
    }

    if (!formData.deadlineDate) {
      toast({
        title: "Error",
        description: "Please select a deadline date",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      if (action === 'assign' && onAssign) {
        await onAssign(review.id, formData)
        toast({
          title: "Success",
          description: "Review assigned successfully"
        })
      } else if (action === 'update' && onUpdate) {
        await onUpdate(review.id, formData)
        toast({
          title: "Success",
          description: "Review updated successfully"
        })
      }
      onOpenChange(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} review`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      reviewerId: "",
      reviewType: "normal",
      reviewMode: "",
      assignDate: "",
      deadlineDate: "",
      teamMeetingLink: "",
      forceAssignment: false
    })
  }

  const handleClose = () => {
    onOpenChange(false)
    resetForm()
  }

  const reviewTypes = [
    { value: "normal", label: "Normal Review", hours: "18 hours" },
    { value: "reduce", label: "Reduce Review", hours: "8 hours" },
    { value: "quick", label: "Quick Review", hours: "5 hours" }
  ]

  const reviewModes = [
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "Onsite" },
    { value: "other", label: "Other" }
  ]

  if (!review) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b bg-background">
          <SheetTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {isEditMode ? "Update Review Assignment" : "Assign Reviewer"}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2 mt-1">
            <Building2 className="h-3.5 w-3.5" />
            <span className="font-semibold">{review.memberFirm}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form className="space-y-6">
            {/* Review Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                Review Type <span className="text-destructive">*</span>
              </Label>
              <div className="space-y-2">
                {reviewTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-3">
                    <Checkbox
                      id={type.value}
                      checked={formData.reviewType === type.value}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange("reviewType", type.value)
                        }
                      }}
                    />
                    <label
                      htmlFor={type.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {type.label} <span className="text-muted-foreground">({type.hours})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Mode */}
            <div className="space-y-2">
              <Label htmlFor="reviewMode" className="text-sm font-medium text-foreground">
                Review <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.reviewMode} 
                onValueChange={(value) => handleInputChange("reviewMode", value)}
              >
                <SelectTrigger id="reviewMode" className="w-full">
                  <SelectValue placeholder="Select review mode..." />
                </SelectTrigger>
                <SelectContent>
                  {reviewModes.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignDate" className="text-sm font-medium text-foreground">
                  Assign Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  id="assignDate"
                  value={formData.assignDate}
                  onChange={(e) => handleInputChange("assignDate", e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadlineDate" className="text-sm font-medium text-foreground">
                  Deadline Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  id="deadlineDate"
                  value={formData.deadlineDate}
                  onChange={(e) => handleInputChange("deadlineDate", e.target.value)}
                  className="w-full"
                  min={formData.assignDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Assign Reviewer */}
            <div className="space-y-2">
              <Label htmlFor="reviewerId" className="text-sm font-medium text-foreground">
                Assign Reviewer <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.reviewerId} 
                onValueChange={(value) => handleInputChange("reviewerId", value)}
              >
                <SelectTrigger id="reviewerId" className="w-full">
                  <SelectValue placeholder="Choose a reviewer..." />
                </SelectTrigger>
                <SelectContent>
                  {reviewers.map((reviewer) => (
                    <SelectItem key={reviewer.id} value={reviewer.id}>
                      <div className="flex flex-col">
                        <div className="font-medium">{reviewer.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {reviewer.role} • {reviewer.status}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Force Assignment */}
            <div className="flex items-start space-x-3 p-3 bg-amber-50/50 border border-amber-200/50 rounded-lg">
              <Checkbox
                id="forceAssignment"
                checked={formData.forceAssignment}
                onCheckedChange={(checked) => handleInputChange("forceAssignment", checked as boolean)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <label
                  htmlFor="forceAssignment"
                  className="text-sm font-medium text-amber-800 cursor-pointer"
                >
                  Force Assignment
                </label>
                <p className="text-xs text-amber-700 mt-1">
                  Override reviewer availability and assign immediately
                </p>
                {formData.forceAssignment && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-800">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="font-medium">This will override normal assignment rules</span>
                  </div>
                )}
              </div>
            </div>

            {/* Team Meeting Link */}
            <div className="space-y-2">
              <Label htmlFor="teamMeetingLink" className="text-sm font-medium text-foreground">
                Team Meeting Link
              </Label>
              <Input
                type="url"
                id="teamMeetingLink"
                placeholder="https://meet.example.com/..."
                value={formData.teamMeetingLink}
                onChange={(e) => handleInputChange("teamMeetingLink", e.target.value)}
                className="w-full"
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t bg-background">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, 'assign')}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Assigning..." : "Assign"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => handleSubmit(e, 'update')}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
