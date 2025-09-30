"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer } from "./drawer"
import { FormSection } from "./form-section"
import { GridForm } from "./grid-form"
import { FormSelect } from "./form-select"
import { FormDatePicker } from "./form-date-picker"
import { FormTextarea } from "./form-textarea"
import { UserPlus } from "lucide-react"

interface AssignDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  onSubmit: (data: {
    reviewerId: string
    priority: string
    type: string
    dueDate: string
    notes: string
  }) => void
  isLoading?: boolean
  reviewers?: Array<{ id: string; name: string; role: string; status: string }>
  priorities?: Array<{ value: string; label: string }>
  types?: Array<{ value: string; label: string }>
}

export function AssignDrawer({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  onSubmit, 
  isLoading = false,
  reviewers = [],
  priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
  ],
  types = [
    { value: "audit", label: "Audit" },
    { value: "compliance", label: "Compliance" },
    { value: "quality", label: "Quality Review" },
    { value: "risk", label: "Risk Assessment" }
  ]
}: AssignDrawerProps) {
  const [formData, setFormData] = useState({
    reviewerId: "",
    priority: "",
    type: "",
    dueDate: "",
    notes: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
    setFormData({
      reviewerId: "",
      priority: "",
      type: "",
      dueDate: "",
      notes: ""
    })
  }

  const handleClose = () => {
    onOpenChange(false)
    setFormData({
      reviewerId: "",
      priority: "",
      type: "",
      dueDate: "",
      notes: ""
    })
  }

  const footer = (
    <div className="flex gap-2">
      <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
        <UserPlus className="h-4 w-4 mr-2" />
        Assign Review
      </Button>
      <Button onClick={handleClose} variant="outline" disabled={isLoading}>
        Cancel
      </Button>
    </div>
  )

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={footer}
      size="md"
    >
      <div className="space-y-6">
        {/* Assignment Details */}
        <FormSection title="Assignment Details">
          <GridForm columns={1}>
            <FormSelect
              label="Reviewer"
              placeholder="Select a reviewer"
              required
              value={formData.reviewerId}
              onChange={(value) => handleInputChange("reviewerId", value)}
              options={reviewers.map(reviewer => ({
                value: reviewer.id,
                label: `${reviewer.name} (${reviewer.role})`
              }))}
            />

            <FormSelect
              label="Priority"
              placeholder="Select priority level"
              required
              value={formData.priority}
              onChange={(value) => handleInputChange("priority", value)}
              options={priorities}
            />

            <FormSelect
              label="Review Type"
              placeholder="Select review type"
              required
              value={formData.type}
              onChange={(value) => handleInputChange("type", value)}
              options={types}
            />

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
              label="Notes"
              placeholder="Add any additional notes or instructions..."
              value={formData.notes}
              onChange={(value) => handleInputChange("notes", value)}
              rows={4}
            />
          </GridForm>
        </FormSection>
      </div>
    </Drawer>
  )
}
