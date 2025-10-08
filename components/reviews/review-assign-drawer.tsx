"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  X, 
  Building2, 
  Award, 
  AlertTriangle,
  Calendar,
  FileText,
  Clock
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
    priority: string
    type: string
    dueDate: string
    notes: string
    forceAssignment?: boolean
  }) => Promise<void>
  preSelectedReviewerId?: string
}

export function ReviewAssignDrawer({ 
  open, 
  onOpenChange, 
  review, 
  reviewers = [], 
  onAssign,
  preSelectedReviewerId = ""
}: ReviewAssignDrawerProps) {
  const [formData, setFormData] = useState({
    reviewerId: preSelectedReviewerId,
    priority: "",
    type: "",
    dueDate: "",
    notes: "",
    forceAssignment: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!review || !onAssign) return

    // Validation
    if (!formData.reviewerId) {
      toast({
        title: "Error",
        description: "Please select a reviewer",
        variant: "destructive"
      })
      return
    }

    if (!formData.priority) {
      toast({
        title: "Error", 
        description: "Please select a priority",
        variant: "destructive"
      })
      return
    }

    if (!formData.type) {
      toast({
        title: "Error",
        description: "Please select a review type", 
        variant: "destructive"
      })
      return
    }

    if (!formData.dueDate) {
      toast({
        title: "Error",
        description: "Please select a due date",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onAssign(review.id, formData)
      toast({
        title: "Success",
        description: "Review assigned successfully"
      })
      onOpenChange(false)
      // Reset form
      setFormData({
        reviewerId: "",
        priority: "",
        type: "",
        dueDate: "",
        notes: "",
        forceAssignment: false
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign review",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFormData({
      reviewerId: "",
      priority: "",
      type: "",
      dueDate: "",
      notes: "",
      forceAssignment: false
    })
  }

  const priorities = [
    { value: "Low", label: "Low Priority", color: "bg-green-100 text-green-800" },
    { value: "Medium", label: "Medium Priority", color: "bg-yellow-100 text-yellow-800" },
    { value: "High", label: "High Priority", color: "bg-orange-100 text-orange-800" },
    { value: "Critical", label: "Critical Priority", color: "bg-red-100 text-red-800" }
  ]

  const types = [
    { value: "Initial", label: "Initial Review" },
    { value: "Follow-up", label: "Follow-up Review" },
    { value: "Compliance", label: "Compliance Review" },
    { value: "Quality", label: "Quality Assurance" },
    { value: "Risk", label: "Risk Assessment" }
  ]

  if (!review) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b bg-background">
          <SheetTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Reviewer
          </SheetTitle>
          <SheetDescription>
            Assign a reviewer to <span className="font-semibold">{review.memberFirm}</span> review
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Review Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{review.memberFirm}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{review.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Due: {review.endDate}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reviewer Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Reviewer Assignment</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="reviewerId" className="text-sm font-medium text-foreground">
                      Select Reviewer <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      name="reviewerId"
                      value={formData.reviewerId} 
                      onValueChange={(value) => handleInputChange("reviewerId", value)}
                    >
                      <SelectTrigger id="reviewerId" className="w-full">
                        <SelectValue placeholder="Choose a reviewer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {reviewers.map((reviewer) => (
                          <SelectItem key={reviewer.id} value={reviewer.id}>
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="font-medium">{reviewer.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {reviewer.role} • {reviewer.status}
                                </div>
                              </div>
                              {reviewer.specialization && reviewer.specialization.length > 0 && (
                                <Award className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Assignment Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-sm font-medium text-foreground">
                        Priority <span className="text-destructive">*</span>
                      </Label>
                      <Select 
                        name="priority"
                        value={formData.priority} 
                        onValueChange={(value) => handleInputChange("priority", value)}
                      >
                        <SelectTrigger id="priority" className="w-full">
                          <SelectValue placeholder="Select priority..." />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              <div className="flex items-center gap-2">
                                <Badge className={priority.color}>
                                  {priority.label}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reviewType" className="text-sm font-medium text-foreground">
                        Review Type <span className="text-destructive">*</span>
                      </Label>
                      <Select 
                        name="type"
                        value={formData.type} 
                        onValueChange={(value) => handleInputChange("type", value)}
                      >
                        <SelectTrigger id="reviewType" className="w-full">
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-sm font-medium text-foreground">
                      Due Date <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange("dueDate", e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Options */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Assignment Options</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-amber-50/50 border border-amber-200/50 rounded-lg">
                    <Checkbox
                      id="forceAssignment"
                      name="forceAssignment"
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
                        Override reviewer availability and assign immediately, even if the reviewer is currently busy or has reached their capacity.
                      </p>
                      {formData.forceAssignment && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-amber-800">
                          <AlertTriangle className="h-3 w-3" />
                          <span className="font-medium">This will override normal assignment rules</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Additional Notes</h3>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-foreground">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Add any additional notes or instructions for the reviewer..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t bg-background">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Assigning..." : "Assign Review"}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
