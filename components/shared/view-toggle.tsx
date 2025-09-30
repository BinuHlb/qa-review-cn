"use client"

import { Button } from "@/components/ui/button"
import { List, Grid3X3 } from "lucide-react"

interface ViewToggleProps {
  viewMode: "list" | "card"
  onViewModeChange: (mode: "list" | "card") => void
  compact?: boolean
}

export function ViewToggle({ viewMode, onViewModeChange, compact = false }: ViewToggleProps) {
  if (compact) {
    return (
      <div className="flex rounded-md border bg-background">
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("list")}
          className="rounded-r-none h-8 w-8 p-0 transition-all duration-200 ease-in-out hover:scale-105"
        >
          <List className="h-3 w-3" />
        </Button>
        <Button
          variant={viewMode === "card" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("card")}
          className="rounded-l-none h-8 w-8 p-0 transition-all duration-200 ease-in-out hover:scale-105"
        >
          <Grid3X3 className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex rounded-md border bg-background">
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("list")}
        className="rounded-r-none transition-all duration-200 ease-in-out hover:scale-105"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "card" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("card")}
        className="rounded-l-none transition-all duration-200 ease-in-out hover:scale-105"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  )
}
