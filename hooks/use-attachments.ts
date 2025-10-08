"use client"

import { useState, useCallback } from "react"
import { Attachment } from "@/components/shared/attachments-section"

interface UseAttachmentsProps {
  initialAttachments?: Attachment[]
  onUpload?: (files: File[]) => Promise<Attachment[]>
  onRemove?: (attachmentId: string) => Promise<void>
  onDownload?: (attachment: Attachment) => Promise<void>
}

export function useAttachments({
  initialAttachments = [],
  onUpload,
  onRemove,
  onDownload
}: UseAttachmentsProps = {}) {
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments)
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoving, setIsRemoving] = useState<string | null>(null)

  const handleUpload = useCallback(async (files: File[]) => {
    if (!onUpload) {
      // Default behavior - create attachments locally
      const newAttachments: Attachment[] = files.map((file, index) => ({
        id: `attachment-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedBy: "Current User",
        uploadedAt: new Date().toISOString(),
        type: file.type
      }))
      
      setAttachments(prev => [...prev, ...newAttachments])
      return
    }

    setIsUploading(true)
    try {
      const newAttachments = await onUpload(files)
      setAttachments(prev => [...prev, ...newAttachments])
    } catch (error) {
      console.error('Failed to upload files:', error)
      // You could add toast notification here
    } finally {
      setIsUploading(false)
    }
  }, [onUpload])

  const handleRemove = useCallback(async (attachmentId: string) => {
    if (!onRemove) {
      // Default behavior - remove locally
      setAttachments(prev => prev.filter(att => att.id !== attachmentId))
      return
    }

    setIsRemoving(attachmentId)
    try {
      await onRemove(attachmentId)
      setAttachments(prev => prev.filter(att => att.id !== attachmentId))
    } catch (error) {
      console.error('Failed to remove attachment:', error)
      // You could add toast notification here
    } finally {
      setIsRemoving(null)
    }
  }, [onRemove])

  const handleDownload = useCallback(async (attachment: Attachment) => {
    if (onDownload) {
      try {
        await onDownload(attachment)
      } catch (error) {
        console.error('Failed to download attachment:', error)
        // You could add toast notification here
      }
    } else if (attachment.url) {
      // Fallback to direct download
      const link = document.createElement('a')
      link.href = attachment.url
      link.download = attachment.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [onDownload])

  const addAttachment = useCallback((attachment: Attachment) => {
    setAttachments(prev => [...prev, attachment])
  }, [])

  const updateAttachment = useCallback((attachmentId: string, updates: Partial<Attachment>) => {
    setAttachments(prev => prev.map(att => 
      att.id === attachmentId ? { ...att, ...updates } : att
    ))
  }, [])

  const clearAttachments = useCallback(() => {
    setAttachments([])
  }, [])

  return {
    attachments,
    isUploading,
    isRemoving,
    handleUpload,
    handleRemove,
    handleDownload,
    addAttachment,
    updateAttachment,
    clearAttachments
  }
}