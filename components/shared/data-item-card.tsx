"use client"

import { useState, ReactNode } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface DropdownAction {
  icon: ReactNode
  label: string
  onClick: () => void
  variant?: "default" | "destructive"
}

interface DataItemCardProps {
  // View mode
  viewMode: "list" | "card"
  
  // Main content (always visible)
  avatar?: ReactNode
  title: string
  titleClassName?: string
  subtitle?: string
  subtitleClassName?: string
  badges?: ReactNode
  secondaryInfo?: ReactNode // For list view - shown on desktop
  mobileInfo?: ReactNode // For list view - shown on mobile
  
  // Expandable content
  expandableContent?: ReactNode
  alwaysVisibleContent?: ReactNode // Content shown even when not expanded (card view)
  
  // Actions
  primaryAction?: {
    icon: ReactNode
    label: string
    onClick: () => void
  }
  quickActions?: ReactNode // Custom quick action buttons
  dropdownActions?: DropdownAction[]
  
  // Selection/click
  isSelected?: boolean
  onClick?: () => void
  
  // Styling
  className?: string
}

export function DataItemCard({
  viewMode,
  avatar,
  title,
  titleClassName,
  subtitle,
  subtitleClassName,
  badges,
  secondaryInfo,
  mobileInfo,
  expandableContent,
  alwaysVisibleContent,
  primaryAction,
  quickActions,
  dropdownActions = [],
  isSelected = false,
  onClick,
  className
}: DataItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasExpandableContent = Boolean(expandableContent)

  // List view
  if (viewMode === "list") {
    return (
      <Card 
        className={cn(
          "shadow-none border-none transition-all duration-300 cursor-pointer",
          isSelected 
            ? "bg-primary/10 dark:bg-primary/20 hover:bg-primary/10 dark:hover:bg-primary/20 border-l-4 border-l-primary" 
            : "bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800",
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* Main Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              {/* Main Info - Clickable to expand/collapse */}
              <div 
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                onClick={(e) => {
                  if (hasExpandableContent) {
                    e.stopPropagation()
                    setIsExpanded(!isExpanded)
                  }
                }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {avatar}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={cn("font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate group-hover:text-primary transition-colors", titleClassName)} title={title}>
                        {title}
                      </h3>
                      {hasExpandableContent && (
                        <div className="text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 h-5 w-5 p-0 flex-shrink-0 flex items-center justify-center transition-colors">
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                    {subtitle && (
                      <p className={cn("text-xs text-neutral-600 dark:text-neutral-400 truncate group-hover:text-neutral-500 transition-colors", subtitleClassName)} title={subtitle}>
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Secondary Info - Desktop only */}
              {secondaryInfo && (
                <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                  {secondaryInfo}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {primaryAction && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      primaryAction.onClick()
                    }}
                    className="text-xs h-7 px-2"
                  >
                    {primaryAction.icon}
                    <span className="hidden sm:inline ml-1">{primaryAction.label}</span>
                  </Button>
                )}

                {quickActions}

                {dropdownActions.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 h-7 w-7 p-0"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {dropdownActions.map((action, index) => (
                        <DropdownMenuItem 
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation()
                            action.onClick()
                          }}
                          className={action.variant === "destructive" ? "text-red-600" : ""}
                        >
                          {action.icon}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Mobile Info - Mobile only */}
            {mobileInfo && (
              <div className="flex sm:hidden items-center justify-between gap-2">
                {mobileInfo}
              </div>
            )}

            {/* Expandable Content */}
            <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                {expandableContent}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Card view
  return (
    <Card className={cn(
      "shadow-none border-none bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 h-full flex flex-col",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div 
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
            onClick={(e) => {
              if (hasExpandableContent) {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }
            }}
          >
            {avatar}
            <div className="min-w-0 flex-1">
              <h3 className={cn("text-base font-semibold truncate group-hover:text-primary transition-colors", titleClassName)} title={title}>
                {title}
              </h3>
              {subtitle && (
                <p className={cn("text-xs text-muted-foreground truncate group-hover:text-neutral-500 transition-colors", subtitleClassName)} title={subtitle}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {dropdownActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {dropdownActions.map((action, index) => (
                    <DropdownMenuItem 
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        action.onClick()
                      }}
                      className={action.variant === "destructive" ? "text-red-600" : ""}
                    >
                      {action.icon}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 flex flex-col">
        {/* Badges */}
        {badges}

        {/* Always Visible Content */}
        {alwaysVisibleContent}

        {/* Expandable Content */}
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
            {expandableContent}
          </div>
        </div>

        {/* Show More and Action Buttons in Same Row */}
        {(hasExpandableContent || primaryAction || quickActions) && (
          <div className="flex justify-between items-center pt-1 mt-auto">
            {hasExpandableContent ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
                className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 h-6 px-2 text-xs"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show More
                  </>
                )}
              </Button>
            ) : <div />}
            
            <div className="flex gap-1">
              {quickActions}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

