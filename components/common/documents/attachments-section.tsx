"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Upload,
  X,
  Paperclip,
  Download,
  FileText,
  Image,
  File,
  Video,
  Music,
  Archive,
  RefreshCw
} from "lucide-react"
import { getFileIcon } from "@/lib/utils/review-utils"
import type { Attachment } from "@/types/entities"

// Re-export for backward compatibility
export type { Attachment }

interface AttachmentsSectionProps {
  attachments: Attachment[]
  onUpload?: (files: File[]) => void
  onRemove?: (attachmentId: string) => void
  onDownload?: (attachment: Attachment) => void
  maxHeight?: string
  showUpload?: boolean
  showDownload?: boolean
  showRemove?: boolean
  className?: string
  title?: string
}

export function AttachmentsSection({
  attachments = [],
  onUpload,
  onRemove,
  onDownload,
  maxHeight = "fit-content",
  showUpload = true,
  showDownload = true,
  showRemove = true,
  className = "",
  title = "Documents"
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

  const handleRemove = (attachmentId: string) => {
    if (onRemove) {
      onRemove(attachmentId)
    }
  }

  const handleDownload = (attachment: Attachment) => {
    if (onDownload) {
      onDownload(attachment)
    } else if (attachment.url) {
      // Fallback to direct download if no handler provided
      const link = document.createElement('a')
      link.href = attachment.url
      link.download = attachment.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getFileTypeIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />
    if (type.startsWith('audio/')) return <Music className="h-4 w-4" />
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <Archive className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  return (
    <div className={className}>
      <div className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded">
              <Paperclip className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {attachments.length} {attachments.length === 1 ? 'file' : 'files'}
              </p>
            </div>
          </div>
          {showUpload && onUpload && (
            <label htmlFor="file-upload" className="flex-shrink-0">
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" asChild>
                <span className="cursor-pointer" title="Upload files">
                  <Upload className="h-3.5 w-3.5" />
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
        {showUpload && onUpload && (
          <div className="flex items-center gap-2 p-2.5 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded text-xs text-muted-foreground">
            <RefreshCw className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p>
              <span className="font-medium">Review Flow:</span> Download → Review → Re-upload
            </p>
          </div>
        )}
      </div>
      <div className={`space-y-2 overflow-y-auto`} style={{ maxHeight }}>
        {/* Drop Zone */}
        {showUpload && onUpload && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
              isDragging 
                ? 'border-primary bg-primary/10 scale-[1.02]' 
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50'
            }`}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <div className={`p-3 rounded-full mx-auto mb-3 w-fit transition-colors ${
              isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <Upload className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium mb-1">
              {isDragging ? 'Drop files here' : 'Upload Files'}
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="hidden sm:inline">Drag and drop or click to browse</span>
              <span className="sm:hidden">Tap to browse files</span>
            </p>
          </div>
        )}

        {/* Documents/Files List */}
        {attachments.length > 0 ? (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="group flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all"
              >
                {/* File Icon */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    {getFileTypeIcon(attachment.type)}
                  </div>
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate mb-1" title={attachment.name}>
                    {attachment.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {attachment.size}
                    </Badge>
                    <span>•</span>
                    <span className="truncate">{attachment.uploadedBy}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {showDownload && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleDownload(attachment)}
                      title="Download for review"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {showRemove && onRemove && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemove(attachment.id)}
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4">
            <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
              <Paperclip className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No documents yet</p>
            {showUpload && onUpload && (
              <p className="text-xs text-muted-foreground">
                <span className="hidden sm:inline">Upload files using the button above or drag and drop</span>
                <span className="sm:hidden">Tap upload button to add files</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}