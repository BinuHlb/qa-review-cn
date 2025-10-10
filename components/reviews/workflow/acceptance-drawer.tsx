"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { DrawerFooter } from "@/components/shared/drawer-footer"
import { 
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Calendar,
  Clock,
  MapPin,
  Building2,
  User,
  FileText
} from "lucide-react"
import { Icon } from "@iconify/react"
import type { Review } from "@/types/entities"
import { WorkflowStatusBadge } from "@/components/shared/workflow-status-badge"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils/formatters"
import { DATE_FORMATS } from "@/lib/constants"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface AcceptanceDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  review: Review | null
  userRole: 'reviewer' | 'firm'
  userName: string
  onAccept?: (reviewId: string, notes?: string) => Promise<void>
  onReject?: (reviewId: string, reason: string) => Promise<void>
}

export function AcceptanceDrawer({
  open,
  onOpenChange,
  review,
  userRole,
  userName,
  onAccept,
  onReject
}: AcceptanceDrawerProps) {
  const { toast } = useToast()
  const [notes, setNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAccept = async () => {
    if (!review || !onAccept) return

    setIsSubmitting(true)
    try {
      await onAccept(review.id, notes)
      
      toast({
        title: "Review Accepted",
        description: "Confirmation email has been sent to the admin.",
        variant: "default"
      })
      
      setNotes("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept review. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!review || !onReject || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onReject(review.id, rejectionReason)
      
      toast({
        title: "Review Rejected",
        description: "Notification has been sent to the admin.",
        variant: "default"
      })
      
      setRejectionReason("")
      setShowRejectDialog(false)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject review. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!review) return null

  const isReviewer = userRole === 'reviewer'
  const otherPartyAccepted = isReviewer 
    ? review.acceptance?.firm?.accepted
    : review.acceptance?.reviewer?.accepted

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Review Assignment
          </SheetTitle>
          <SheetDescription>
            Please review the details and decide whether to accept this assignment.
          </SheetDescription>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <WorkflowStatusBadge status={review.workflowStatus} size="sm" />
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
          {/* Review Info Card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              {/* Member Firm */}
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Member Firm</p>
                  <p className="font-semibold">{review.memberFirm}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{review.country}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Review Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Review Type</p>
                  <Badge variant="outline" className="font-medium">
                    <Clock className="h-3 w-3 mr-1" />
                    {review.reviewType}-hour
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Review Mode</p>
                  <Badge variant="outline" className="font-medium capitalize">
                    {review.reviewMode}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium">
                      {formatDate(review.startDate, DATE_FORMATS.DISPLAY)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="text-sm font-medium text-red-600">
                      {formatDate(review.dueDate || review.endDate, DATE_FORMATS.DISPLAY)}
                    </p>
                  </div>
                </div>
              </div>

              {isReviewer && (
                <>
                  <Separator />
                  
                  {/* Assigned By */}
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned By</p>
                      <p className="text-sm font-medium">{review.assignedBy || 'Admin'}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.assignedAt || review.startDate, DATE_FORMATS.DISPLAY)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          {review.documents && review.documents.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">
                  Original Documents ({review.documents.length})
                </Label>
              </div>
              <Card>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {review.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.size}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0"
                          onClick={() => {
                            // TODO: Implement download
                            console.log('Download:', doc.name)
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  // TODO: Download all
                  console.log('Download all documents')
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download All Documents
              </Button>
            </div>
          )}

          {/* Team Meeting Link */}
          {review.teamMeetingLink && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon icon="logos:microsoft-teams" className="h-4 w-4" />
                <Label className="text-sm font-medium">Team Meeting Link</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={review.teamMeetingLink}
                  readOnly
                  className="flex-1 h-9 rounded-md border border-input bg-secondary px-3 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(review.teamMeetingLink!)
                    toast({
                      title: "Copied!",
                      description: "Meeting link copied to clipboard"
                    })
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          )}

          {/* Other Party Status */}
          {otherPartyAccepted !== undefined && (
            <Card className={otherPartyAccepted ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  {otherPartyAccepted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-amber-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {isReviewer ? 'Member Firm' : 'Reviewer'} Status
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {otherPartyAccepted 
                        ? `✓ Already accepted on ${formatDate(
                            isReviewer 
                              ? review.acceptance?.firm?.acceptedAt || '' 
                              : review.acceptance?.reviewer?.acceptedAt || '',
                            DATE_FORMATS.DISPLAY
                          )}`
                        : 'Waiting for acceptance'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes (Optional) */}
          {!showRejectDialog && (
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-sm">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes or comments about accepting this review..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          )}

          {/* Rejection Reason */}
          {showRejectDialog && (
            <Card className="border-red-200 bg-red-50/30">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <Label className="text-sm font-semibold">
                    Reason for Rejection <span className="text-destructive">*</span>
                  </Label>
                </div>
                <Textarea
                  placeholder="Please provide a detailed reason for rejecting this assignment..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="resize-none bg-white"
                />
                <p className="text-xs text-muted-foreground">
                  This will be sent to the admin and the other party will be notified.
                </p>
              </CardContent>
            </Card>
          )}
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-muted/30">
          <div className="flex gap-3">
            {!showRejectDialog ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRejectDialog(true)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  type="button"
                  onClick={handleAccept}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Accepting...' : 'Accept Review'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRejectDialog(false)
                    setRejectionReason("")
                  }}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleReject}
                  className="flex-1"
                  disabled={isSubmitting || !rejectionReason.trim()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

