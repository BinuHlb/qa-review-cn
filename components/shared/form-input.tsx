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
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, placeholder, type = "text", required = false, description, value, onChange, className }, ref) => {
    return (
      <FormField label={label} required={required} description={description} className={className}>
        <Input
          ref={ref}
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
