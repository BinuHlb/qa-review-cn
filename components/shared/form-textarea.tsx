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
  id?: string
  name?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, placeholder, required = false, description, value, onChange, rows = 3, className, id, name }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, '-')
    const fieldName = name || fieldId
    
    return (
      <FormField label={label} required={required} description={description} className={className} htmlFor={fieldId}>
        <Textarea
          ref={ref}
          id={fieldId}
          name={fieldName}
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
