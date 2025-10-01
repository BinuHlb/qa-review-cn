"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, Download, Paperclip } from "lucide-react"
import { formatFileSize, getFileIcon } from "@/lib/utils/review-utils"

interface Attachment {
  id: string
  name: string
  size: number | string
  uploadedBy: string
  uploadedAt: string
  type: string
}

interface AttachmentsSectionProps {
  attachments: Attachment[]
  onUpload?: (files: File[]) => void
  onRemove?: (id: string) => void
  onDownload?: (id: string) => void
  title?: string
  showUpload?: boolean
  maxHeight?: string
  className?: string
}

/**
 * Reusable attachments section component
 * Handles file display, upload, and management
 */
export function AttachmentsSection({
  attachments,
  onUpload,
  onRemove,
  onDownload,
  title = "Attachments",
  showUpload = true,
  maxHeight = "max-h-80",
  className = ""
}: AttachmentsSectionProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && onUpload) {
      onUpload(Array.from(files))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && onUpload) {
      onUpload(Array.from(files))
    }
  }

  const getFileSize = (size: number | string) => {
    return typeof size === 'number' ? formatFileSize(size) : size
  }

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title} ({attachments.length})</CardTitle>
          {showUpload && onUpload && (
            <label htmlFor="file-upload">
              <Button size="sm" variant="outline" asChild>
                <span className="cursor-pointer">
                  <Upload className="h-3 w-3 mr-2" />
                  Upload
                </span>
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          )}
        </div>
      </CardHeader>
      <CardContent className={`space-y-3 ${maxHeight} overflow-y-auto`}>
        {/* Drop Zone */}
        {showUpload && onUpload && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
            }`}
          >
            <Paperclip className="h-6 w-6 mx-auto text-neutral-400 mb-2" />
            <p className="text-xs text-neutral-500">
              Drag and drop files here, or click Upload button
            </p>
          </div>
        )}

        {/* Attachments List */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">{getFileIcon(attachment.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate" title={attachment.name}>
                      {attachment.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {getFileSize(attachment.size)} • {attachment.uploadedBy} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {onDownload && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0"
                      onClick={() => onDownload(attachment.id)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                  {onRemove && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                      onClick={() => onRemove(attachment.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
