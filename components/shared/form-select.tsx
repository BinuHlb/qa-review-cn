"use client"

import { FormField } from "./form-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  label: string
  placeholder?: string
  required?: boolean
  description?: string
  value?: string
  onChange?: (value: string) => void
  options: SelectOption[]
  className?: string
}

export function FormSelect({ 
  label, 
  placeholder, 
  required = false, 
  description, 
  value, 
  onChange, 
  options,
  className 
}: FormSelectProps) {
  return (
    <FormField label={label} required={required} description={description} className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}
