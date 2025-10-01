"use client"

import { ReactNode } from "react"

interface ScrollablePanelProps {
  header: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
}

/**
 * Reusable scrollable panel component with fixed header and footer
 * Ensures proper scrolling behavior and consistent layout
 */
export function ScrollablePanel({
  header,
  children,
  footer,
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerClassName = ""
}: ScrollablePanelProps) {
  return (
    <div className={`h-full flex flex-col bg-white ${className}`}>
      {/* Fixed Header */}
      {header && (
        <div className={`flex-shrink-0 ${headerClassName}`}>
          {header}
        </div>
      )}

      {/* Scrollable Content */}
      <div className={`flex-1 overflow-y-auto min-h-0 ${contentClassName}`}>
        {children}
      </div>

      {/* Fixed Footer */}
      {footer && (
        <div className={`flex-shrink-0 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  )
}
