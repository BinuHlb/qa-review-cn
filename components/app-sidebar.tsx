"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Command } from "lucide-react"

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  
  // Get user role, default to reviewer if not available
  const userRole = (session?.user?.role as UserRole) || "reviewer"
  const navigationData = getNavigationForRole(userRole)
  
  // Create user data for NavUser
  const userData = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "user@example.com",
    avatar: "/avatars/user.jpg",
    role: getRoleDisplayName(userRole),
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
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
