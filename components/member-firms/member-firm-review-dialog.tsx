"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  CheckCircle, 
  XCircle,
  Building,
  Users,
  Mail,
  Phone,
  Star,
  FileText
} from "lucide-react"
import { type MemberFirm } from "@/lib/member-firms-mock-data"
import { AttachmentsSection, type Attachment } from "@/components/shared/attachments-section"

interface MemberFirmReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberFirm: MemberFirm | null
  onAccept?: (firmId: string, notes: string) => void
  onReject?: (firmId: string, notes: string) => void
}

export function MemberFirmReviewDialog({
  open,
  onOpenChange,
  memberFirm,
  onAccept,
  onReject
}: MemberFirmReviewDialogProps) {
  const [reviewNotes, setReviewNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([
    {
      id: "1",
      name: "Financial_Report_2024.pdf",
      size: "2.4 MB",
      uploadedBy: "Admin User",
      uploadedAt: "2024-01-15T10:00:00Z",
      type: "application/pdf"
    },
    {
      id: "2",
      name: "Compliance_Checklist.xlsx",
      size: "856 KB",
      uploadedBy: "Admin User",
      uploadedAt: "2024-01-18T14:00:00Z",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    },
    {
      id: "3",
      name: "Audit_Summary.pdf",
      size: "1.2 MB",
      uploadedBy: "Admin User",
      uploadedAt: "2024-01-20T09:00:00Z",
      type: "application/pdf"
    }
  ])

  const handleAccept = async () => {
    if (!memberFirm) return
    setIsProcessing(true)
    try {
      await onAccept?.(memberFirm.id, reviewNotes)
      setReviewNotes("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error accepting review:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!memberFirm) return
    setIsProcessing(true)
    try {
      await onReject?.(memberFirm.id, reviewNotes)
      setReviewNotes("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error rejecting review:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = (files: File[]) => {
    files.forEach(file => {
      const newAttachment: Attachment = {
        id: String(Date.now() + Math.random()),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        uploadedBy: "Current User",
        uploadedAt: new Date().toISOString(),
        type: file.type
      }
      setAttachments(prev => [...prev, newAttachment])
    })
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const handleDownloadAttachment = (attachment: Attachment) => {
    console.log('Download attachment:', attachment)
  }

  if (!memberFirm) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Review Member Firm - {memberFirm.name}
          </DialogTitle>
          <DialogDescription>
            Review the documents and provide your decision with optional notes
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Firm Summary */}
          <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-background to-muted/20">
            {/* Header Section */}
            <div className="p-4 border-b bg-background/50 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {memberFirm.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-foreground truncate">
                      {memberFirm.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Building className="h-3 w-3" />
                      <span className="truncate">{memberFirm.location}</span>
                      <span>•</span>
                      <span>{memberFirm.country}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-2.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {memberFirm.type}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs px-2.5 py-0.5 ${
                      memberFirm.status === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}
                  >
                    {memberFirm.status.charAt(0).toUpperCase() + memberFirm.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
              <div className="group relative overflow-hidden rounded-lg bg-background p-3 border hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                    <div className="h-7 w-7 rounded-md bg-blue-50 flex items-center justify-center">
                      <Users className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <p className="text-xs font-medium">Employees</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{memberFirm.employeeCount}</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg bg-background p-3 border hover:border-purple-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                    <div className="h-7 w-7 rounded-md bg-purple-50 flex items-center justify-center">
                      <Building className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <p className="text-xs font-medium">Partners</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{memberFirm.partnerCount}</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg bg-background p-3 border hover:border-green-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                    <div className="h-7 w-7 rounded-md bg-green-50 flex items-center justify-center">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <p className="text-xs font-medium">Compliance</p>
                  </div>
                  <p className="text-xl font-bold text-green-600">{memberFirm.complianceScore}%</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg bg-background p-3 border hover:border-orange-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                    <div className="h-7 w-7 rounded-md bg-orange-50 flex items-center justify-center">
                      <FileText className="h-3.5 w-3.5 text-orange-600" />
                    </div>
                    <p className="text-xs font-medium">Reviews</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{memberFirm.totalReviews}</p>
                </div>
              </div>
            </div>

            {/* Quick Info Bar */}
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background border">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground truncate max-w-[180px]" title={memberFirm.contactEmail}>
                    {memberFirm.contactEmail}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background border">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{memberFirm.contactPhone}</span>
                </div>
                {memberFirm.specializations.length > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50 border border-blue-200">
                    <Star className="h-3 w-3 text-blue-600" />
                    <span className="text-blue-700 font-medium">
                      {memberFirm.specializations.length} Specialization{memberFirm.specializations.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <AttachmentsSection
            attachments={attachments}
            onUpload={handleFileUpload}
            onRemove={handleRemoveAttachment}
            onDownload={handleDownloadAttachment}
            maxHeight="400px"
            showUpload={true}
            showDownload={true}
            showRemove={true}
            title="Review Documents"
            className="border-0"
          />

          {/* Review Notes */}
          <div className="space-y-2">
            <Label htmlFor="review-notes" className="text-sm font-semibold">
              Review Notes (Optional)
            </Label>
            <Textarea
              id="review-notes"
              name="reviewNotes"
              placeholder="Add your review comments, observations, or reasons for your decision..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

