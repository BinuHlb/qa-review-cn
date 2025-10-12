import { Star } from "lucide-react"
import { getPercentageColor } from "@/lib/utils/score-utils"

interface PercentageBadgeProps {
  value: number
  className?: string
  showIcon?: boolean
}

/**
 * Reusable percentage badge component
 * 
 * Displays a percentage score with color-coded styling based on thresholds.
 * Uses centralized score-utils for zero hardcoding.
 * 
 * @example
 * ```tsx
 * <PercentageBadge value={85} />
 * <PercentageBadge value={45} showIcon={false} />
 * ```
 */
export function PercentageBadge({ value, className = "", showIcon = true }: PercentageBadgeProps) {
  return (
    <div className={`flex items-center gap-2 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-md ${className}`}>
      {showIcon && <Star className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />}
      <span className={`text-xs font-medium whitespace-nowrap ${getPercentageColor(value)}`}>
        {value}%
      </span>
    </div>
  )
}

