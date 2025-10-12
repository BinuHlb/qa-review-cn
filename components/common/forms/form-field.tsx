"use client"

import { ReactNode } from "react"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  label: string
  required?: boolean
  children: ReactNode
  className?: string
  description?: string
  htmlFor?: string
}

export function FormField({ label, required = false, children, className = "", description, htmlFor }: FormFieldProps) {
  const fieldId = htmlFor || label.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  )
}
