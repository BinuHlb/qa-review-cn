"use client"

import { ReactNode } from "react"

interface GridFormProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function GridForm({ children, columns = 2, className = "" }: GridFormProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  }

  return (
    <div className={`grid ${gridClasses[columns]} gap-6 ${className}`}>
      {children}
    </div>
  )
}
