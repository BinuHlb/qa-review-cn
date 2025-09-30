"use client"

import { forwardRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "./form-field"

interface FormTextareaProps {
  label: string
  placeholder?: string
  required?: boolean
  description?: string
  value?: string
  onChange?: (value: string) => void
  rows?: number
  className?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, placeholder, required = false, description, value, onChange, rows = 3, className }, ref) => {
    return (
      <FormField label={label} required={required} description={description} className={className}>
        <Textarea
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          rows={rows}
        />
      </FormField>
    )
  }
)

FormTextarea.displayName = "FormTextarea"
