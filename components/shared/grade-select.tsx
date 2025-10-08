"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getGradeColor } from "@/lib/mock-data"

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
  const grades = [
    { value: '1', label: 'Best' },
    { value: '2', label: 'Good' },
    { value: '3', label: 'Ok' },
    { value: '4', label: 'Bad' },
    { value: '5', label: 'Poor' }
  ]

  const getGradeLabel = (gradeValue: string) => {
    return grades.find(g => g.value === gradeValue)?.label || gradeValue
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-xs font-medium text-muted-foreground">
        {label} {required && '*'}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-9 bg-white">
          {value ? (
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${getGradeColor(value)}`}>
                {value}
              </div>
              <span>{getGradeLabel(value)}</span>
            </div>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          {grades.map((grade) => (
            <SelectItem key={grade.value} value={grade.value}>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${getGradeColor(grade.value)}`}>
                  {grade.value}
                </div>
                <span>{grade.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

