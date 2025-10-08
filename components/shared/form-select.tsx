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
  id?: string
  name?: string
}

export function FormSelect({ 
  label, 
  placeholder, 
  required = false, 
  description, 
  value, 
  onChange, 
  options,
  className,
  id,
  name
}: FormSelectProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-')
  const fieldName = name || fieldId
  
  return (
    <FormField label={label} required={required} description={description} className={className} htmlFor={fieldId}>
      <Select name={fieldName} value={value} onValueChange={onChange}>
        <SelectTrigger id={fieldId}>
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
