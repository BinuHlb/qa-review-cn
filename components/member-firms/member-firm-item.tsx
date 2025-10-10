"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MoreHorizontal, 
  Calendar,
  Star,
  Users,
  Building,
  Edit,
  Eye,
  Trash2,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
}

export function MemberFirmItem({ memberFirm, viewMode, onView, onEdit, onDelete, onReview }: MemberFirmItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (viewMode === "list") {
    return (
      <Card className="shadow-none border-none bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300">
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* Main Row - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              {/* Main Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={memberFirm.avatar} alt={memberFirm.name} />
                    <AvatarFallback className={`${generateFirmAvatarColor(memberFirm.name)} text-xs font-semibold`}>
                      {generateFirmInitials(memberFirm.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate" title={memberFirm.name}>
                        {memberFirm.name}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsExpanded(!isExpanded)
                        }}
                        className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 h-5 w-5 p-0 flex-shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate" title={memberFirm.location}>
                      {memberFirm.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Info - Hidden on mobile, visible on larger screens */}
              <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
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
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onReview?.(memberFirm)
                  }}
                  className="text-xs h-7 px-2"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Review</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 h-7 w-7 p-0"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onView?.(memberFirm)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(memberFirm)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Firm
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onReview?.(memberFirm)}>
                      <Star className="mr-2 h-4 w-4" />
                      Schedule Review
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(memberFirm)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Mobile Compliance and Status - Visible only on mobile */}
            <div className="flex sm:hidden items-center justify-between gap-2">
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
            </div>

            {/* Expandable Content */}
            <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                {/* Specialization */}
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Specializations</div>
                  <div className="flex flex-wrap gap-1">
                    {memberFirm.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                      <Users className="h-3 w-3" />
                      <span className="font-medium">Employees</span>
                    </div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                      {memberFirm.employeeCount}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                      <Building className="h-3 w-3" />
                      <span className="font-medium">Partners</span>
                    </div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                      {memberFirm.partnerCount}
                    </div>
                  </div>
                </div>

                {/* Compliance and Reviews */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                      <Star className="h-3 w-3" />
                      <span className="font-medium">Compliance</span>
                    </div>
                    <div className={`font-medium ${getComplianceScoreColor(memberFirm.complianceScore)}`}>
                      {memberFirm.complianceScore}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                      <Calendar className="h-3 w-3" />
                      <span className="font-medium">Reviews</span>
                    </div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                      {memberFirm.totalReviews}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Contact</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs min-w-0 text-neutral-700 dark:text-neutral-300">
                      <Mail className="h-3 w-3 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                      <span className="truncate" title={memberFirm.contactEmail}>
                        {memberFirm.contactEmail}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs min-w-0 text-neutral-700 dark:text-neutral-300">
                      <Phone className="h-3 w-3 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                      <span className="truncate" title={memberFirm.contactPhone}>
                        {memberFirm.contactPhone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Card view
  return (
    <Card className="shadow-none border-none bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={memberFirm.avatar} alt={memberFirm.name} />
              <AvatarFallback className={`${generateFirmAvatarColor(memberFirm.name)} text-sm font-semibold`}>
                {generateFirmInitials(memberFirm.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base truncate" title={memberFirm.name}>
                {memberFirm.name}
              </CardTitle>
              <CardDescription className="text-xs truncate" title={memberFirm.location}>
                {memberFirm.location}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onView?.(memberFirm)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(memberFirm)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Firm
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReview?.(memberFirm)}>
                  <Star className="mr-2 h-4 w-4" />
                  Schedule Review
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(memberFirm)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 flex flex-col">
        {/* Status and Type */}
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

        {/* Expandable Content */}
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                  <Users className="h-3 w-3" />
                  <span className="font-medium">Employees</span>
                </div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {memberFirm.employeeCount}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                  <Building className="h-3 w-3" />
                  <span className="font-medium">Partners</span>
                </div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {memberFirm.partnerCount}
                </div>
              </div>
            </div>

            {/* Compliance and Reviews */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                  <Star className="h-3 w-3" />
                  <span className="font-medium">Compliance</span>
                </div>
                <div className={`font-medium ${getComplianceScoreColor(memberFirm.complianceScore)}`}>
                  {memberFirm.complianceScore}%
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">Reviews</span>
                </div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {memberFirm.totalReviews}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-1">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Contact</div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs min-w-0 text-neutral-700 dark:text-neutral-300">
                  <Mail className="h-3 w-3 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                  <span className="truncate" title={memberFirm.contactEmail}>
                    {memberFirm.contactEmail}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs min-w-0 text-neutral-700 dark:text-neutral-300">
                  <Phone className="h-3 w-3 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                  <span className="truncate" title={memberFirm.contactPhone}>
                    {memberFirm.contactPhone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Show More and Action Buttons in Same Row */}
        <div className="flex justify-between items-center pt-1 mt-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 h-6 px-2 text-xs"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show More
              </>
            )}
          </Button>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onReview?.(memberFirm)
              }}
              className="text-xs h-7 px-3"
            >
              <Star className="h-3 w-3 mr-1" />
              Review
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(memberFirm)
              }}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 h-7 w-7 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
