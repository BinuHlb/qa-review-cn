"use client"

// import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  color: "blue" | "green" | "yellow" | "purple" | "red" | "orange" | "pink" | "indigo" | "teal" | "cyan"
  className?: string
  compact?: boolean
}

const colorClasses = {
  blue: "bg-primary/10 text-primary border-primary/20",
  green: "bg-green-50 text-green-600 border-green-200",
  yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  red: "bg-red-50 text-red-600 border-red-200",
  orange: "bg-orange-50 text-orange-600 border-orange-200",
  pink: "bg-pink-50 text-pink-600 border-pink-200",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
  teal: "bg-teal-50 text-teal-600 border-teal-200",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-200"
}

export function StatsCard({ icon: Icon, label, value, color, className = "", compact = false }: StatsCardProps) {
  const colors = colorClasses[color]

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colors} ${className} min-w-fit`}>
        <Icon className="h-3 w-3 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-medium truncate">{label}</p>
          <p className="text-sm font-bold truncate">{value}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${colors} ${className} min-w-fit`}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
        <p className="text-base font-bold truncate">{value}</p>
      </div>
    </div>
  )
}
