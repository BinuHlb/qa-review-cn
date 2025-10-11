"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  Star,
  Users,
  Building,
  Phone,
  Mail,
  Eye
} from "lucide-react"
import { StatsGrid, ContactSection, BadgeList, DetailContainer } from "@/components/shared/detail-sections"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataItemCard, type DropdownAction } from "@/components/shared/data-item-card"
import { 
  type MemberFirm, 
  getStatusColor, 
  getTypeColor, 
  getTypeLabel,
  getRiskLevelColor,
  getComplianceScoreColor,
  generateFirmInitials,
  generateFirmAvatarColor
} from "@/lib/member-firms-mock-data"

interface MemberFirmItemProps {
  memberFirm: MemberFirm
  viewMode: "list" | "card"
  onView?: (memberFirm: MemberFirm) => void
  onEdit?: (memberFirm: MemberFirm) => void
  onDelete?: (memberFirm: MemberFirm) => void
  onReview?: (memberFirm: MemberFirm) => void
  isSelected?: boolean
}

export function MemberFirmItem({ memberFirm, viewMode, onView, onEdit, onDelete, onReview, isSelected }: MemberFirmItemProps) {
  // Avatar component
  const avatar = (
    <Avatar className="h-8 w-8 flex-shrink-0">
      <AvatarImage src={memberFirm.avatar} alt={memberFirm.name} />
      <AvatarFallback className={`${generateFirmAvatarColor(memberFirm.name)} text-xs font-semibold`}>
        {generateFirmInitials(memberFirm.name)}
      </AvatarFallback>
    </Avatar>
  )

  // Badges component
  const badges = (
    <div className="flex flex-wrap gap-1">
      <Badge className={`${getStatusColor(memberFirm.status)} text-xs px-2 py-0.5`}>
        {memberFirm.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
      <Badge className={`${getTypeColor(memberFirm.type)} text-xs px-2 py-0.5`}>
        {getTypeLabel(memberFirm.type)}
      </Badge>
      <Badge className={`${getRiskLevelColor(memberFirm.riskLevel)} text-xs px-2 py-0.5`}>
        <span className="hidden sm:inline">{memberFirm.riskLevel.toUpperCase()} RISK</span>
        <span className="sm:hidden">{memberFirm.riskLevel.toUpperCase()}</span>
      </Badge>
    </div>
  )

  // Secondary info for list view (desktop)
  const secondaryInfo = (
    <>
      {/* Compliance Score */}
      <div className="flex items-center gap-2 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-md">
        <Star className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
        <div className="flex items-center gap-1 text-xs whitespace-nowrap">
          <span className={`font-medium ${getComplianceScoreColor(memberFirm.complianceScore)}`}>
            {memberFirm.complianceScore}%
          </span>
        </div>
      </div>
      
      {/* Status and Type Badges */}
      <div className="flex items-center gap-1">
        <Badge className={`${getStatusColor(memberFirm.status)} text-xs px-2 py-0.5`}>
          {memberFirm.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
        <Badge className={`${getTypeColor(memberFirm.type)} text-xs px-2 py-0.5`}>
          {getTypeLabel(memberFirm.type)}
        </Badge>
      </div>
    </>
  )

  // Mobile info for list view
  const mobileInfo = (
    <>
      {/* Compliance Score */}
      <div className="flex items-center gap-2 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-md">
        <Star className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
        <div className="flex items-center gap-1 text-xs whitespace-nowrap">
          <span className={`font-medium ${getComplianceScoreColor(memberFirm.complianceScore)}`}>
            {memberFirm.complianceScore}%
          </span>
        </div>
      </div>
      
      {/* Status and Type Badges */}
      <div className="flex items-center gap-1">
        <Badge className={`${getStatusColor(memberFirm.status)} text-xs px-2 py-0.5`}>
          {memberFirm.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
        <Badge className={`${getTypeColor(memberFirm.type)} text-xs px-2 py-0.5`}>
          {getTypeLabel(memberFirm.type)}
        </Badge>
      </div>
    </>
  )

  // Always visible content for card view
  const alwaysVisibleContent = (
    <>
      {/* Status and Type */}
      {badges}

      {/* Specialization - Always visible (first 2) */}
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Specializations</div>
        <div className="flex flex-wrap gap-1">
          {memberFirm.specializations.slice(0, 2).map((spec, index) => (
            <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 truncate max-w-[120px]" title={spec}>
              {spec}
            </Badge>
          ))}
          {memberFirm.specializations.length > 2 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{memberFirm.specializations.length - 2}
            </Badge>
          )}
        </div>
      </div>
    </>
  )

  // Expandable content
  const expandableContent = (
    <DetailContainer>
      <BadgeList 
        label="Specializations" 
        items={memberFirm.specializations}
      />

      <StatsGrid 
        stats={[
          { icon: Users, label: "Employees", value: memberFirm.employeeCount },
          { icon: Building, label: "Partners", value: memberFirm.partnerCount },
          { icon: Star, label: "Compliance", value: `${memberFirm.complianceScore}%`, valueClassName: getComplianceScoreColor(memberFirm.complianceScore) },
          { icon: Calendar, label: "Reviews", value: memberFirm.totalReviews }
        ]}
      />

      <ContactSection
        title="Contact"
        contacts={[
          { icon: Mail, value: memberFirm.contactEmail, href: `mailto:${memberFirm.contactEmail}` },
          { icon: Phone, value: memberFirm.contactPhone, href: `tel:${memberFirm.contactPhone}` }
        ]}
      />
    </DetailContainer>
  )

  // Dropdown actions
  const dropdownActions: DropdownAction[] = []
  
  if (onEdit) {
    dropdownActions.push({
      icon: <Eye className="mr-2 h-4 w-4" />,
      label: "Edit",
      onClick: () => onEdit(memberFirm)
    })
  }
  
  if (onDelete) {
    dropdownActions.push({
      icon: <Eye className="mr-2 h-4 w-4" />,
      label: "Delete",
      onClick: () => onDelete(memberFirm),
      variant: "destructive"
    })
  }

  // Quick actions for card view
  const quickActions = viewMode === "card" && onReview ? (
    <Button
      variant="outline"
      size="sm"
      onClick={(e) => {
        e.stopPropagation()
        onReview(memberFirm)
      }}
      className="text-xs h-7 px-3"
    >
      <Star className="h-3 w-3 mr-1" />
      Review
    </Button>
  ) : undefined

  // Primary action for list view
  const primaryAction = viewMode === "list" && onReview ? {
    icon: <Eye className="h-3 w-3" />,
    label: "Review",
    onClick: () => onReview(memberFirm)
  } : undefined

  return (
    <DataItemCard
      viewMode={viewMode}
      avatar={avatar}
      title={memberFirm.name}
      subtitle={memberFirm.location}
      secondaryInfo={secondaryInfo}
      mobileInfo={mobileInfo}
      expandableContent={expandableContent}
      alwaysVisibleContent={alwaysVisibleContent}
      primaryAction={primaryAction}
      quickActions={quickActions}
      dropdownActions={dropdownActions}
      isSelected={isSelected}
      onClick={() => onReview?.(memberFirm)}
    />
  )
}
