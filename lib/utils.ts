import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns consistent styling classes for selected/unselected item cards
 * Used across review-item, member-firm-item, reviewer-item components
 */
export function getItemCardStyles(isSelected: boolean = false) {
  return isSelected
    ? "bg-primary/10 dark:bg-primary/20 hover:bg-primary/10 dark:hover:bg-primary/20 border-l-4 border-l-primary"
    : "bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800"
}
