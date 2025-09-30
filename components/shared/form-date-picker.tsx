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
}

export function FormDatePicker({ 
  label, 
  required = false, 
  description, 
  value, 
  onChange, 
  className 
}: FormDatePickerProps) {
  return (
    <FormField label={label} required={required} description={description} className={className}>
      <div className="relative">
        <Input
          type="date"
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
