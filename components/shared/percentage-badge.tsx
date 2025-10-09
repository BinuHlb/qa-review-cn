import { TrendingUp } from "lucide-react"

interface PercentageBadgeProps {
  value: number
  className?: string
  showIcon?: boolean
}

export function PercentageBadge({ value, className = "", showIcon = true }: PercentageBadgeProps) {
  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-blue-600"
    if (percentage >= 40) return "text-yellow-600"
    if (percentage >= 20) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className={`flex items-center gap-2 bg-white px-2 py-1 rounded-md ${className}`}>
      {showIcon && <TrendingUp className="h-3 w-3 text-neutral-500" />}
      <span className={`text-xs font-medium whitespace-nowrap ${getPercentageColor(value)}`}>
        {value}%
      </span>
    </div>
  )
}

