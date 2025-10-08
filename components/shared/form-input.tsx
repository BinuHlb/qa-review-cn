"use client"

import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { FormField } from "./form-field"

interface FormInputProps {
  label: string
  placeholder?: string
  type?: string
  required?: boolean
  description?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  id?: string
  name?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, placeholder, type = "text", required = false, description, value, onChange, className, id, name }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, '-')
    const fieldName = name || fieldId
    
    return (
      <FormField label={label} required={required} description={description} className={className} htmlFor={fieldId}>
        <Input
          ref={ref}
          id={fieldId}
          name={fieldName}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
        />
      </FormField>
    )
  }
)

FormInput.displayName = "FormInput"
