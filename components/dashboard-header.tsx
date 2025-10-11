"use client"

import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Search } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface SearchProps {
  searchTerm: string
  searchPlaceholder?: string
  onSearchChange: (value: string) => void
}

interface DashboardHeaderProps {
  search?: SearchProps
}

export function DashboardHeader({ search }: DashboardHeaderProps = {}) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  // Breadcrumb mapping for better labels
  const getBreadcrumbLabel = (segment: string): string => {
    const labels: Record<string, string> = {
      'admin': 'Admin',
      'users': 'User Management',
      'member-firms': 'Member Firms',
      'settings': 'System Settings',
      'reviews': 'QA Reviews',
      'ceo': 'CEO',
      'director': 'Technical Director',
      'firm': 'Member Firm',
      'reviewer': 'Reviewer',
      'dashboard': 'Dashboard',
      'active': 'Active Reviews',
      'analytics': 'Analytics',
      'add': 'Add New'
    }
    return labels[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Generate breadcrumb items
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []

    // Always start with Home
    breadcrumbs.push({
      label: 'Home',
      href: '/',
      isLast: segments.length === 0
    })

    // Add path segments
    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const isLast = index === segments.length - 1
      const label = getBreadcrumbLabel(segment)

      breadcrumbs.push({
        label,
        href,
        isLast
      })
    })

    return breadcrumbs
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {/* Dynamic Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            {generateBreadcrumbs().map((breadcrumb, index) => (
              <span key={breadcrumb.href} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {breadcrumb.isLast ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.href}>
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Optional Search Input */}
      {search && (
        <div className="flex-1 max-w-xxl px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={search.searchPlaceholder || "Search..."}
              value={search.searchTerm}
              onChange={(e) => search.onSearchChange(e.target.value)}
              className="pl-9 h-9 bg-neutral-100 dark:bg-neutral-800 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 px-4">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
