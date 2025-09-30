"use client"

import { ReactNode } from "react"

interface UnifiedViewProps<T extends { id: string } = { id: string }> {
  viewMode: "list" | "card"
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
}

export function UnifiedView<T extends { id: string } = { id: string }>({ viewMode, items, renderItem }: UnifiedViewProps<T>) {
  if (viewMode === "list") {
    return (
      <div className="space-y-1 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="animate-in fade-in-0 slide-in-from-left-2 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-3 space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 pb-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="break-inside-avoid mb-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}
