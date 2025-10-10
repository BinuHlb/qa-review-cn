"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormSection } from "@/components/shared/form-section"
import { GridForm } from "@/components/shared/grid-form"
import { FormSelect } from "@/components/shared/form-select"
import { FormDatePicker } from "@/components/shared/form-date-picker"
import { FormTextarea } from "@/components/shared/form-textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus, X, Building2, Award, AlertTriangle } from "lucide-react"
import type { Review } from "@/types/entities"
import { getGradeColor, getStatusColor } from "@/lib/mock-data"

interface ReviewAssignFormProps {
  review: Review
  onSubmit: (data: {
    reviewerId: string
    priority: string
    type: string
    dueDate: string
    notes: string
    forceAssignment?: boolean
  }) => void
  onCancel: () => void
  reviewers?: Array<{ id: string; name: string; role: string; status: string; email?: string; specialization?: string[] }>
  priorities?: Array<{ value: string; label: string }>
  types?: Array<{ value: string; label: string }>
  preSelectedReviewerId?: string
}

export function ReviewAssignForm({ 
  review,
  onSubmit,
  onCancel,
  reviewers = [],
  priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
  ],
  types = [
    { value: "Current Member", label: "Current Member" },
    { value: "Prospect", label: "Prospect" }
  ],
  preSelectedReviewerId = ""
}: ReviewAssignFormProps) {
  const [formData, setFormData] = useState({
    reviewerId: preSelectedReviewerId,
    priority: "",
    type: "",
    dueDate: "",
    notes: "",
    forceAssignment: false
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
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
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className={`${generateFirmAvatarColor(review.memberFirm)} text-sm font-semibold`}>
                {generateFirmInitials(review.memberFirm)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Assign Review</h2>
              <p className="text-sm text-neutral-500">{review.memberFirm}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Review Summary */}
        <div className="flex items-center gap-2">
          <Badge className={`${getGradeColor(review.currentGrade)}`}>
            <Award className="h-3 w-3 mr-1" />
            {review.currentGrade}
          </Badge>
          <Badge className={`${getStatusColor(review.status)}`}>
            {review.status}
          </Badge>
          <span className="text-sm text-neutral-500">•</span>
          <span className="text-sm text-neutral-500">{review.type}</span>
        </div>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-6">
          {/* Review Context Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Review Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500 mb-1">Review ID</p>
                  <p className="font-medium text-neutral-900">{review.id}</p>
                </div>
                <div>
                  <p className="text-neutral-500 mb-1">Country</p>
                  <p className="font-medium text-neutral-900">{review.country}</p>
                </div>
                <div>
                  <p className="text-neutral-500 mb-1">Current Reviewer</p>
                  <p className="font-medium text-neutral-900">{review.reviewer}</p>
                </div>
                <div>
                  <p className="text-neutral-500 mb-1">Priority</p>
                  <Badge variant="outline" className={`${getStatusColor(review.status)}`}>
                    {review.priority}
                  </Badge>
                </div>
              </div>
              {review.description && (
                <div className="pt-3 border-t">
                  <p className="text-xs text-neutral-500 mb-1">Description</p>
                  <p className="text-sm text-neutral-700">{review.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment Form */}
          <FormSection title="Assignment Details">
            <GridForm columns={1}>
              <FormSelect
                label="Assign to Reviewer"
                placeholder="Select a reviewer"
                required
                value={formData.reviewerId}
                onChange={(value) => handleInputChange("reviewerId", value)}
                options={reviewers.map(reviewer => ({
                  value: reviewer.id,
                  label: `${reviewer.name} (${reviewer.role})`
                }))}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Priority Level"
                  placeholder="Select priority"
                  required
                  value={formData.priority}
                  onChange={(value) => handleInputChange("priority", value)}
                  options={priorities}
                />

                <FormSelect
                  label="Review Type"
                  placeholder="Select type"
                  required
                  value={formData.type}
                  onChange={(value) => handleInputChange("type", value)}
                  options={types}
                />
              </div>

              <FormDatePicker
                label="Due Date"
                required
                value={formData.dueDate}
                onChange={(value) => handleInputChange("dueDate", value)}
              />
            </GridForm>
          </FormSection>

          {/* Additional Notes */}
          <FormSection title="Additional Information">
            <GridForm columns={1}>
              <FormTextarea
                label="Assignment Notes"
                placeholder="Add any special instructions, requirements, or notes for the reviewer..."
                value={formData.notes}
                onChange={(value) => handleInputChange("notes", value)}
                rows={6}
              />
            </GridForm>
          </FormSection>

          {/* Force Assignment Option */}
          <FormSection title="Assignment Options">
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
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
          </FormSection>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t bg-neutral-50">
        <div className="max-w-2xl flex gap-3">
          <Button onClick={handleSubmit} className="flex-1">
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Review
          </Button>
          <Button onClick={onCancel} variant="outline" className="min-w-[120px]">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

