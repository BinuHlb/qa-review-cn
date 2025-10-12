/**
 * Workflow Status Badge
 * Shows colored badge for review workflow status
 */

import { Badge } from "@/components/ui/badge"
import { WORKFLOW_STATUS, WORKFLOW_STATUS_COLORS } from "@/lib/constants"
import type { ReviewWorkflowStatus } from "@/types/workflow"
import { cn } from "@/lib/utils"

interface WorkflowStatusBadgeProps {
  status?: ReviewWorkflowStatus
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function WorkflowStatusBadge({ 
  status, 
  className = "",
  size = 'md'
}: WorkflowStatusBadgeProps) {
  // If no workflow status provided, return null
  if (!status) return null
  
  // Get label from constants
  const statusConfig = Object.values(WORKFLOW_STATUS).find(s => s.value === status)
  const label = statusConfig?.label || status
  
  // Get color from constants
  const colorClass = WORKFLOW_STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'
  
  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }
  
  return (
    <Badge 
      className={cn(
        colorClass,
        sizeClasses[size],
        'font-medium whitespace-nowrap border-0',
        className
      )}
    >
      {label}
    </Badge>
  )
}

/**
 * Workflow Status Badge with Icon
 * Enhanced version with status indicator icon
 */
interface WorkflowStatusBadgeWithIconProps extends WorkflowStatusBadgeProps {
  showIcon?: boolean
}

export function WorkflowStatusBadgeWithIcon({ 
  status,
  className = "",
  size = 'md',
  showIcon = true
}: WorkflowStatusBadgeWithIconProps) {
  if (!status) return null
  
  const statusConfig = Object.values(WORKFLOW_STATUS).find(s => s.value === status)
  const label = statusConfig?.label || status
  const colorClass = WORKFLOW_STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'
  
  // Icon indicators based on status
  const getStatusIcon = () => {
    if (status === 'completed') return '✓'
    if (status === 'pending_acceptance') return '⏳'
    if (status === 'in_progress') return '⚙️'
    if (status === 'submitted_for_verification') return '📋'
    if (status === 'verified_pending_final') return '✅'
    if (status === 'rejected' || status === 'cancelled') return '✕'
    return '○'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }
  
  return (
    <Badge 
      className={cn(
        colorClass,
        sizeClasses[size],
        'font-medium whitespace-nowrap border-0 flex items-center gap-1.5',
        className
      )}
    >
      {showIcon && <span className="text-xs">{getStatusIcon()}</span>}
      <span>{label}</span>
    </Badge>
  )
}

