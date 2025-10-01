/**
 * Toast notification hook
 * Simple implementation - can be replaced with a library like sonner or react-hot-toast
 */

import { useState, useCallback } from "react"

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast = { id, title, description, variant }
    
    setToasts(prev => [...prev, newToast])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)

    // For now, also use console for visibility
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Toast ${variant}]:`, title, description)
    }

    return { id }
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}

