"use client"

import { ReactNode } from "react"

interface FormSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function FormSection({ title, children, className = "" }: FormSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  )
}
