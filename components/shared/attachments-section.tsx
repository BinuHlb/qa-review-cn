"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Archive
} from "lucide-react"
import { getFileIcon } from "@/lib/utils/review-utils"

export interface Attachment {
  id: string
  name: string
  size: string
  uploadedBy: string
  uploadedAt: string
  type: string
  url?: string
}

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
    <Card className={`shadow-none border-none p-0 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {title} ({attachments.length})
          </CardTitle>
          {showUpload && onUpload && (
            <label htmlFor="file-upload" className="flex-shrink-0">
              <Button size="sm" variant="outline" asChild>
                <span className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
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
      <CardContent className={`space-y-3 overflow-y-auto`} style={{ maxHeight }}>
        {/* Drop Zone */}
        {showUpload && onUpload && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
          >
            <Paperclip className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              <span className="hidden sm:inline">Drag and drop files here or click to browse</span>
              <span className="sm:hidden">Tap to add files</span>
            </p>
          </div>
        )}

        {/* Documents/Files List */}
        {attachments.length > 0 ? (
          <div className="space-y-1">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="group flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors"
              >
                {/* File Icon */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded bg-muted">
                    <span className="text-sm">{getFileIcon(attachment.type)}</span>
                  </div>
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" title={attachment.name}>
                    {attachment.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{attachment.size}</span>
                    <span>•</span>
                    <span className="truncate">{attachment.uploadedBy}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {showDownload && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleDownload(attachment)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {showRemove && onRemove && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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
          <div className="text-center py-8">
            <Paperclip className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No attachments yet</p>
            {showUpload && onUpload && (
              <p className="text-xs text-muted-foreground/70 mt-1">
                <span className="hidden sm:inline">Upload files to get started</span>
                <span className="sm:hidden">Tap upload to add files</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}