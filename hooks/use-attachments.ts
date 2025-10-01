/**
 * Custom hook for managing file attachments
 */

import { useState, useEffect, useCallback } from "react"
import { AttachmentsAPI } from "@/lib/api/attachments"
import { type Attachment } from "@/lib/schemas/review.schema"
import { useToast } from "@/hooks/use-toast"

export function useAttachments(reviewId: string | null) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch attachments when reviewId changes
  useEffect(() => {
    if (!reviewId) {
      setAttachments([])
      return
    }

    const fetchAttachments = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await AttachmentsAPI.getByReviewId(reviewId)
        setAttachments(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch attachments"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttachments()
  }, [reviewId])

  // Upload files
  const uploadFiles = useCallback(async (files: File[]) => {
    if (!reviewId) return

    try {
      setIsUploading(true)
      const uploadPromises = files.map(file => AttachmentsAPI.upload(reviewId, file))
      const newAttachments = await Promise.all(uploadPromises)
      setAttachments(prev => [...prev, ...newAttachments])
      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`,
      })
      return newAttachments
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload files"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsUploading(false)
    }
  }, [reviewId, toast])

  // Delete an attachment
  const deleteAttachment = useCallback(async (id: string) => {
    try {
      await AttachmentsAPI.delete(id)
      setAttachments(prev => prev.filter(att => att.id !== id))
      toast({
        title: "Success",
        description: "File deleted successfully",
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete file"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  // Download an attachment
  const downloadAttachment = useCallback(async (id: string, filename: string) => {
    try {
      const blob = await AttachmentsAPI.download(id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({
        title: "Success",
        description: "File downloaded successfully",
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to download file"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  return {
    attachments,
    isLoading,
    isUploading,
    error,
    uploadFiles,
    deleteAttachment,
    downloadAttachment,
  }
}

