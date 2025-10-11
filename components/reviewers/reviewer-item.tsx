"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MoreHorizontal, 
  MapPin, 
  Calendar,
  Star,
  Users,
  UserPlus,
  Edit,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { StatsGrid, ProgressBar, BadgeList, DetailContainer } from "@/components/shared/detail-sections"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  type Reviewer, 
  getRoleColor, 
  getStatusColor, 
  getWorkloadColor,
  generateReviewerInitials,
  generateReviewerAvatarColor
} from "@/lib/reviewers-mock-data"

interface ReviewerItemProps {
  reviewer: Reviewer
  viewMode: "list" | "card"
  onView?: (reviewer: Reviewer) => void
  onEdit?: (reviewer: Reviewer) => void
  onAssign?: (reviewer: Reviewer) => void
  onDelete?: (reviewer: Reviewer) => void
}

export function ReviewerItem({ reviewer, viewMode, onView, onEdit, onAssign, onDelete }: ReviewerItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (viewMode === "list") {
    return (
      <Card className="shadow-none border-none bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300">
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* Main Row - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              {/* Main Info - Clickable to expand/collapse */}
              <div 
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
                    <AvatarFallback className={`${generateReviewerAvatarColor(reviewer.name)} text-white text-xs font-semibold`}>
                      {generateReviewerInitials(reviewer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate group-hover:text-primary transition-colors" title={reviewer.name}>
                        {reviewer.name}
                      </h3>
                      <div className="text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 h-5 w-5 p-0 flex-shrink-0 flex items-center justify-center transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate group-hover:text-neutral-500 transition-colors" title={reviewer.email}>
                      {reviewer.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Info - Hidden on mobile, visible on larger screens */}
              <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                {/* Workload */}
                <div className="flex items-center gap-2 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-md">
                  <Users className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                  <div className="flex items-center gap-1 text-xs whitespace-nowrap">
                    <span className={`font-medium ${getWorkloadColor(reviewer.currentWorkload, reviewer.maxWorkload)}`}>
                      {reviewer.currentWorkload}/{reviewer.maxWorkload}
                    </span>
                  </div>
                </div>
                
                {/* Role and Status Badges */}
                <div className="flex items-center gap-1">
                  <Badge className={`${getRoleColor(reviewer.role)} text-xs px-2 py-0.5`}>
                    {reviewer.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  <Badge className={`${getStatusColor(reviewer.status)} text-xs px-2 py-0.5`}>
                    {reviewer.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                    onAssign?.(reviewer)
                  }}
                  className="text-xs h-7 px-2"
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Assign</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onView?.(reviewer)
                  }}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 h-7 w-7 p-0"
                >
                  <Eye className="h-3 w-3" />
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
                    <DropdownMenuItem onClick={() => onView?.(reviewer)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(reviewer)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Reviewer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAssign?.(reviewer)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Review
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(reviewer)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Mobile Workload and Status - Visible only on mobile */}
            <div className="flex sm:hidden items-center justify-between gap-2">
              {/* Workload */}
              <div className="flex items-center gap-2 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-md">
                <Users className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                <div className="flex items-center gap-1 text-xs whitespace-nowrap">
                  <span className={`font-medium ${getWorkloadColor(reviewer.currentWorkload, reviewer.maxWorkload)}`}>
                    {reviewer.currentWorkload}/{reviewer.maxWorkload}
                  </span>
                </div>
              </div>
              
              {/* Role and Status Badges */}
              <div className="flex items-center gap-1">
                <Badge className={`${getRoleColor(reviewer.role)} text-xs px-2 py-0.5`}>
                  {reviewer.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
                <Badge className={`${getStatusColor(reviewer.status)} text-xs px-2 py-0.5`}>
                  {reviewer.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
            </div>

            {/* Expandable Content */}
            <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <DetailContainer>
                  <BadgeList 
                    label="Specialization" 
                    items={reviewer.specialization}
                  />

                  <ProgressBar
                    label="Workload"
                    current={reviewer.currentWorkload}
                    max={reviewer.maxWorkload}
                    showNumbers={true}
                  />

                  <StatsGrid 
                    stats={[
                      { icon: Star, label: "Rating", value: `${reviewer.averageRating}/5.0` },
                      { icon: Users, label: "Reviews", value: reviewer.totalReviews },
                      { icon: MapPin, label: "Location", value: reviewer.location },
                      { icon: Calendar, label: "Experience", value: `${reviewer.experience} years` }
                    ]}
                  />
                </DetailContainer>
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
          <div 
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
              <AvatarFallback className={`${generateReviewerAvatarColor(reviewer.name)} text-white text-sm font-semibold`}>
                {generateReviewerInitials(reviewer.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base truncate group-hover:text-primary transition-colors" title={reviewer.name}>
                {reviewer.name}
              </CardTitle>
              <CardDescription className="text-xs truncate group-hover:text-neutral-500 transition-colors" title={reviewer.email}>
                {reviewer.email}
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
                <DropdownMenuItem onClick={() => onView?.(reviewer)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(reviewer)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Reviewer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAssign?.(reviewer)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign Review
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(reviewer)}
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
        {/* Role and Status */}
        <div className="flex flex-wrap gap-1">
          <Badge className={`${getRoleColor(reviewer.role)} text-xs px-2 py-0.5`}>
            {reviewer.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          <Badge className={`${getStatusColor(reviewer.status)} text-xs px-2 py-0.5`}>
            {reviewer.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>

        {/* Specialization - Always visible (first 2) */}
        <div className="space-y-1">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Specialization</div>
          <div className="flex flex-wrap gap-1">
            {reviewer.specialization.slice(0, 2).map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                {spec}
              </Badge>
            ))}
            {reviewer.specialization.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{reviewer.specialization.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Workload - Always visible */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">Workload</span>
            <span className={`font-medium ${getWorkloadColor(reviewer.currentWorkload, reviewer.maxWorkload)}`}>
              {reviewer.currentWorkload}/{reviewer.maxWorkload}
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                (reviewer.currentWorkload / reviewer.maxWorkload) >= 0.9 
                  ? 'bg-red-500' 
                  : (reviewer.currentWorkload / reviewer.maxWorkload) >= 0.75 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
              }`}
              style={{ width: `${(reviewer.currentWorkload / reviewer.maxWorkload) * 100}%` }}
            />
          </div>
        </div>

        {/* Expandable Content */}
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <DetailContainer>
              <StatsGrid 
                stats={[
                  { icon: Star, label: "Rating", value: `${reviewer.averageRating}/5.0` },
                  { icon: Users, label: "Reviews", value: reviewer.totalReviews },
                  { icon: MapPin, label: "Location", value: reviewer.location },
                  { icon: Calendar, label: "Experience", value: `${reviewer.experience} years` }
                ]}
              />
            </DetailContainer>
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
                onAssign?.(reviewer)
              }}
              className="text-xs h-7 px-3"
            >
              <UserPlus className="h-3 w-3 mr-1" />
              Assign
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onView?.(reviewer)
              }}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 h-7 w-7 p-0"
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(reviewer)
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
