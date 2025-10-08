"use client"

import { FormField } from "./form-field"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

interface FormDatePickerProps {
  label: string
  required?: boolean
  description?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  id?: string
  name?: string
}

export function FormDatePicker({ 
  label, 
  required = false, 
  description, 
  value, 
  onChange, 
  className,
  id,
  name
}: FormDatePickerProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-')
  const fieldName = name || fieldId
  
  return (
    <FormField label={label} required={required} description={description} className={className} htmlFor={fieldId}>
      <div className="relative">
        <Input
          type="date"
          id={fieldId}
          name={fieldName}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          className="pl-10"
        />
        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </FormField>
  )
}
