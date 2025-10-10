"use client"

import { Label } from "@/components/ui/label"
import { getGradeColor } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

interface GradeSelectProps {
  value: string
  onValueChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  className?: string
}

export function GradeSelect({ 
  value, 
  onValueChange, 
  label = "Grade",
  placeholder = "Select grade",
  required = false,
  className = ""
}: GradeSelectProps) {
  const grades = ['1', '2', '3', '4', '5']
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs font-medium text-muted-foreground">
        {label} {required && '*'}
      </Label>
      
      {/* Interactive Grade Selector */}
      <div className="grid grid-cols-5 gap-2">
        {grades.map((grade) => (
          <button
            key={grade}
            type="button"
            onClick={() => onValueChange(grade)}
            className={cn(
              "relative flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200",
              "hover:scale-105 hover:shadow-md active:scale-95",
              value === grade
                ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-sm"
                : "border-muted hover:border-primary/50 bg-background"
            )}
          >
            {/* Badge */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-transform",
              getGradeColor(grade as '1' | '2' | '3' | '4' | '5'),
              value === grade && "scale-110"
            )}>
              {grade}
            </div>
            
            {/* Selected Indicator */}
            {value === grade && (
              <Star className="absolute -top-1 -right-1 h-3.5 w-3.5 fill-primary text-primary" />
            )}
          </button>
        ))}
      </div>
      
      {!value && (
        <p className="text-xs text-muted-foreground italic">
          {placeholder}
        </p>
      )}
    </div>
  )
}
