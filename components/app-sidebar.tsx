"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getNavigationForRole, getRoleDisplayName, type UserRole } from "@/lib/navigation"

// Function to determine role based on current path
function getRoleFromPath(pathname: string): UserRole {
  if (pathname.startsWith('/admin/')) return "admin"
  if (pathname.startsWith('/ceo/')) return "ceo"
  if (pathname.startsWith('/director/')) return "technical_director"
  if (pathname.startsWith('/firm/')) return "member_firm"
  if (pathname.startsWith('/reviewer/')) return "reviewer"
  return "reviewer" // default fallback
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const pathname = usePathname()
  
  // Get user role from session first, then fallback to path-based detection
  const sessionRole = session?.user?.role as UserRole
  const pathRole = getRoleFromPath(pathname)
  const userRole = sessionRole || pathRole
  
  const navigationData = getNavigationForRole(userRole)
  
  // Create user data for NavUser
  const userData = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "user@example.com",
    avatar: session?.user?.image || "", // Use session image if available, otherwise empty to show fallback
    role: getRoleDisplayName(userRole),
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg font-bold text-lg">
                  H
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">QA Review App</span>
                  <span className="truncate text-xs">{getRoleDisplayName(userRole)}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
        <NavProjects projects={navigationData.projects} />
        <NavSecondary items={navigationData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
