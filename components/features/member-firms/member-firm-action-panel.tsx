"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type MemberFirm } from "@/lib/member-firms-mock-data"
import { AttachmentsSection, type Attachment } from "@/components/common/documents/attachments-section"
import {
  ActionPanelLayout,
  ActionPanelHeader,
  ActionPanelSection,
  ActionPanelInfoCard,
  ActionPanelFormSection
} from "@/components/common/panels/action-panel-layout"
import { StatsGrid, ContactSection, BadgeList } from "@/components/common/panels/detail-sections"
import { getComplianceScoreColor } from "@/lib/utils/score-utils"
import {
  CheckCircle,
  XCircle,
  Building,
  Users,
  Star,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award
} from "lucide-react"

interface MemberFirmActionPanelProps {
  memberFirm: MemberFirm
  onAccept?: (firmId: string, notes: string) => void
  onReject?: (firmId: string, notes: string) => void
}

export function MemberFirmActionPanel({
  memberFirm,
  onAccept,
  onReject
}: MemberFirmActionPanelProps) {
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
    setIsProcessing(true)
    try {
      await onAccept?.(memberFirm.id, reviewNotes)
      setReviewNotes("")
    } catch (error) {
      console.error("Error accepting:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    setIsProcessing(true)
    try {
      await onReject?.(memberFirm.id, reviewNotes)
      setReviewNotes("")
    } catch (error) {
      console.error("Error rejecting:", error)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'inactive': return 'bg-neutral-100 text-neutral-800 border-neutral-200'
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'primary': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'secondary': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200'
    }
  }

  return (
    <ActionPanelLayout
      header={
        <ActionPanelHeader
          title={memberFirm.name}
          subtitle={`${memberFirm.location}, ${memberFirm.country}`}
          avatar={{ name: memberFirm.name }}
          badges={[
            { label: memberFirm.type, className: getTypeColor(memberFirm.type) },
            { label: memberFirm.status.charAt(0).toUpperCase() + memberFirm.status.slice(1), className: getStatusColor(memberFirm.status) }
          ]}
        />
      }
    >
      <ActionPanelSection>
        {/* Review Documents - First Position */}
        <div>
          <AttachmentsSection
            attachments={attachments}
            onUpload={handleFileUpload}
            onRemove={handleRemoveAttachment}
            onDownload={handleDownloadAttachment}
            maxHeight="100%"
            showUpload={true}
            showDownload={true}
            showRemove={true}
            title="Firm Documents"
          />
        </div>

        {/* Firm Stats */}
        <ActionPanelInfoCard
          items={[
            {
              icon: <Users className="h-3.5 w-3.5 text-muted-foreground" />,
              label: "Employees",
              value: memberFirm.employeeCount.toString()
            },
            {
              icon: <Building className="h-3.5 w-3.5 text-muted-foreground" />,
              label: "Partners",
              value: memberFirm.partnerCount.toString()
            },
            {
              icon: <Star className="h-3.5 w-3.5 text-muted-foreground" />,
              label: "Compliance",
              value: `${memberFirm.complianceScore}%`,
              valueClassName: getComplianceScoreColor(memberFirm.complianceScore)
            },
            {
              icon: <Calendar className="h-3.5 w-3.5 text-muted-foreground" />,
              label: "Total Reviews",
              value: memberFirm.totalReviews.toString()
            }
          ]}
        />

        {/* Detailed Information */}
        <div className="space-y-4">
          <BadgeList 
            label="Specializations" 
            items={memberFirm.specializations}
          />

          <ContactSection
            title="Contact Information"
            contacts={[
              { icon: Mail, value: memberFirm.contactEmail, href: `mailto:${memberFirm.contactEmail}` },
              { icon: Phone, value: memberFirm.contactPhone, href: `tel:${memberFirm.contactPhone}` }
            ]}
          />

          {memberFirm.certifications && memberFirm.certifications.length > 0 && (
            <BadgeList 
              label="Certifications" 
              items={memberFirm.certifications}
              variant="secondary"
            />
          )}

          <ActionPanelInfoCard
            columns={1}
            items={[
              {
                icon: <MapPin className="h-3.5 w-3.5 text-muted-foreground" />,
                label: "Full Address",
                value: memberFirm.address
              },
              {
                icon: <Calendar className="h-3.5 w-3.5 text-muted-foreground" />,
                label: "Join Date",
                value: new Date(memberFirm.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              }
            ]}
          />
        </div>

        {/* Review Actions */}
        <ActionPanelFormSection
          title="Review Decision"
          icon={<Award className="h-5 w-5 text-primary" />}
          description="Review the firm's documents and information, then provide your decision"
        >
          {/* Review Notes */}
          <div className="space-y-2">
            <Label htmlFor="review-notes" className="text-sm font-medium">
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isProcessing}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept
            </Button>
          </div>
        </ActionPanelFormSection>
      </ActionPanelSection>
    </ActionPanelLayout>
  )
}


