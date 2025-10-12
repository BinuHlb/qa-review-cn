"use client"

import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Send,
  Ban,
  Play,
  type LucideIcon
} from "lucide-react"
import { type Review } from "@/lib/mock-data"

interface StatusBadgeProps {
  status: Review['status']
  className?: string
  showIcon?: boolean
  interactive?: boolean
}

const statusConfig: Record<Review['status'], {
  label: string
  icon: LucideIcon
  className: string
  hoverClassName: string
}> = {
  'Completed': {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-700 border-green-300',
    hoverClassName: 'hover:bg-green-200 hover:border-green-400 hover:shadow-md'
  },
  'Submitted': {
    label: 'Submitted',
    icon: Send,
    className: 'bg-purple-100 text-purple-700 border-purple-300',
    hoverClassName: 'hover:bg-purple-200 hover:border-purple-400 hover:shadow-md'
  },
  'In Progress': {
    label: 'In Progress',
    icon: Play,
    className: 'bg-blue-100 text-blue-700 border-blue-300',
    hoverClassName: 'hover:bg-blue-200 hover:border-blue-400 hover:shadow-md'
  },
  'Pending': {
    label: 'Pending',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    hoverClassName: 'hover:bg-yellow-200 hover:border-yellow-400 hover:shadow-md'
  },
  'Overdue': {
    label: 'Overdue',
    icon: AlertCircle,
    className: 'bg-red-100 text-red-700 border-red-300 animate-pulse',
    hoverClassName: 'hover:bg-red-200 hover:border-red-400 hover:shadow-md'
  },
  'Cancelled': {
    label: 'Cancelled',
    icon: Ban,
    className: 'bg-gray-100 text-gray-600 border-gray-300',
    hoverClassName: 'hover:bg-gray-200 hover:border-gray-400 hover:shadow-md'
  },
  'Rejected': {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-300',
    hoverClassName: 'hover:bg-red-200 hover:border-red-400 hover:shadow-md'
  }
}

export function StatusBadge({ 
  status, 
  className = "", 
  showIcon = true,
  interactive = false
}: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge 
      variant="outline"
      className={`
        ${config.className} 
        ${interactive ? config.hoverClassName : ''} 
        ${interactive ? 'cursor-pointer' : ''}
        transition-all duration-200 
        font-medium 
        px-3 
        py-1 
        border
        ${className}
      `}
    >
      <div className="flex items-center gap-1.5">
        {showIcon && <Icon className="h-3.5 w-3.5" />}
        <span>{config.label}</span>
      </div>
    </Badge>
  )
}

// Helper function to get status badge component
export function getStatusBadge(status: Review['status'], options?: {
  showIcon?: boolean
  interactive?: boolean
  className?: string
}) {
  return (
    <StatusBadge 
      status={status}
      showIcon={options?.showIcon ?? true}
      interactive={options?.interactive ?? false}
      className={options?.className ?? ""}
    />
  )
}

