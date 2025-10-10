import { TrendingUp } from "lucide-react"
import { PERCENTAGE_THRESHOLDS, PERCENTAGE_COLORS } from "@/lib/constants"

interface PercentageBadgeProps {
  value: number
  className?: string
  showIcon?: boolean
}

export function PercentageBadge({ value, className = "", showIcon = true }: PercentageBadgeProps) {
  const getPercentageColor = (percentage: number) => {
    if (percentage >= PERCENTAGE_THRESHOLDS.EXCELLENT) return PERCENTAGE_COLORS.EXCELLENT
    if (percentage >= PERCENTAGE_THRESHOLDS.GOOD) return PERCENTAGE_COLORS.GOOD
    if (percentage >= PERCENTAGE_THRESHOLDS.AVERAGE) return PERCENTAGE_COLORS.AVERAGE
    if (percentage >= PERCENTAGE_THRESHOLDS.POOR) return PERCENTAGE_COLORS.BELOW_AVERAGE
    return PERCENTAGE_COLORS.POOR
  }

  return (
    <div className={`flex items-center gap-2 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-md ${className}`}>
      {showIcon && <TrendingUp className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />}
      <span className={`text-xs font-medium whitespace-nowrap ${getPercentageColor(value)}`}>
        {value}%
      </span>
    </div>
  )
}

