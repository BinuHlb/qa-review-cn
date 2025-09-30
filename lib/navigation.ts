import {
  Users,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Building2,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  ClipboardList,
  TrendingUp,
  Database,
  Globe,
  Lock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  type LucideIcon,
} from "lucide-react"

export type UserRole = "admin" | "ceo" | "technical_director" | "member_firm" | "reviewer"

export interface NavigationItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
  roles?: UserRole[]
}

export interface ProjectItem {
  name: string
  url: string
  icon: LucideIcon
  roles?: UserRole[]
}

export interface SecondaryItem {
  title: string
  url: string
  icon: LucideIcon
  roles?: UserRole[]
}

// Navigation items for different roles
export const navigationData = {
  admin: {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: BarChart3,
        isActive: true,
        roles: ["admin"],
      },
      {
        title: "Manage Reviewers",
        url: "/admin/reviewers",
        icon: Users,
        roles: ["admin"],
        items: [
          {
            title: "All Reviewers",
            url: "/admin/reviewers",
          },
          {
            title: "Add Reviewer",
            url: "/admin/reviewers/add",
          },
          {
            title: "Reviewer Roles",
            url: "/admin/reviewers/roles",
          },
        ],
      },
      {
        title: "Member Firms",
        url: "/admin/member-firms",
        icon: Building2,
        roles: ["admin"],
        items: [
          {
            title: "All Firms",
            url: "/admin/member-firms",
          },
          {
            title: "Add Firm",
            url: "/admin/member-firms/add",
          },
          {
            title: "Firm Analytics",
            url: "/admin/member-firms/analytics",
          },
        ],
      },
      {
        title: "QA Reviews",
        url: "/admin/reviews",
        icon: ClipboardList,
        roles: ["admin"],
        items: [
          {
            title: "All Reviews",
            url: "/admin/reviews",
          },
          {
            title: "Review Templates",
            url: "/admin/reviews/templates",
          },
          {
            title: "Review Analytics",
            url: "/admin/reviews/analytics",
          },
        ],
      },
      {
        title: "System Settings",
        url: "/admin/settings",
        icon: Settings,
        roles: ["admin"],
        items: [
          {
            title: "General",
            url: "/admin/settings/general",
          },
          {
            title: "Security",
            url: "/admin/settings/security",
          },
          {
            title: "Integrations",
            url: "/admin/settings/integrations",
          },
          {
            title: "Backup & Restore",
            url: "/admin/settings/backup",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Active Reviews",
        url: "/admin/reviews/active",
        icon: CheckCircle,
        roles: ["admin"],
      },
      {
        name: "Pending Approvals",
        url: "/admin/approvals",
        icon: AlertTriangle,
        roles: ["admin"],
      },
      {
        name: "System Reports",
        url: "/admin/reports",
        icon: TrendingUp,
        roles: ["admin"],
      },
    ],
    navSecondary: [
      {
        title: "Audit Logs",
        url: "/admin/audit-logs",
        icon: Database,
        roles: ["admin"],
      },
      {
        title: "System Health",
        url: "/admin/system-health",
        icon: Shield,
        roles: ["admin"],
      },
    ],
  },
  ceo: {
    navMain: [
      {
        title: "Executive Dashboard",
        url: "/ceo/dashboard",
        icon: BarChart3,
        isActive: true,
        roles: ["ceo"],
      },
      {
        title: "Strategic Overview",
        url: "/ceo/strategic",
        icon: TrendingUp,
        roles: ["ceo"],
        items: [
          {
            title: "Performance Metrics",
            url: "/ceo/strategic/metrics",
          },
          {
            title: "Market Analysis",
            url: "/ceo/strategic/market",
          },
          {
            title: "Growth Projections",
            url: "/ceo/strategic/projections",
          },
        ],
      },
      {
        title: "Member Firms",
        url: "/ceo/member-firms",
        icon: Building2,
        roles: ["ceo"],
        items: [
          {
            title: "Firm Performance",
            url: "/ceo/member-firms/performance",
          },
          {
            title: "Compliance Status",
            url: "/ceo/member-firms/compliance",
          },
          {
            title: "Strategic Partnerships",
            url: "/ceo/member-firms/partnerships",
          },
        ],
      },
      {
        title: "Quality Assurance",
        url: "/ceo/quality",
        icon: CheckCircle,
        roles: ["ceo"],
        items: [
          {
            title: "Quality Metrics",
            url: "/ceo/quality/metrics",
          },
          {
            title: "Review Summary",
            url: "/ceo/quality/summary",
          },
          {
            title: "Improvement Plans",
            url: "/ceo/quality/improvements",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Executive Reports",
        url: "/ceo/reports",
        icon: FileText,
        roles: ["ceo"],
      },
      {
        name: "Board Presentations",
        url: "/ceo/presentations",
        icon: Globe,
        roles: ["ceo"],
      },
      {
        name: "Strategic Initiatives",
        url: "/ceo/initiatives",
        icon: TrendingUp,
        roles: ["ceo"],
      },
    ],
    navSecondary: [
      {
        title: "Market Intelligence",
        url: "/ceo/market-intelligence",
        icon: Globe,
        roles: ["ceo"],
      },
      {
        title: "Stakeholder Reports",
        url: "/ceo/stakeholder-reports",
        icon: FileText,
        roles: ["ceo"],
      },
    ],
  },
  technical_director: {
    navMain: [
      {
        title: "Technical Dashboard",
        url: "/director/dashboard",
        icon: BarChart3,
        isActive: true,
        roles: ["technical_director"],
      },
      {
        title: "Review Management",
        url: "/director/reviews",
        icon: ClipboardList,
        roles: ["technical_director"],
        items: [
          {
            title: "Assigned Reviews",
            url: "/director/reviews/assigned",
          },
          {
            title: "Review Templates",
            url: "/director/reviews/templates",
          },
          {
            title: "Quality Standards",
            url: "/director/reviews/standards",
          },
        ],
      },
      {
        title: "Team Management",
        url: "/director/team",
        icon: Users,
        roles: ["technical_director"],
        items: [
          {
            title: "Reviewers",
            url: "/director/team/reviewers",
          },
          {
            title: "Performance",
            url: "/director/team/performance",
          },
          {
            title: "Training",
            url: "/director/team/training",
          },
        ],
      },
      {
        title: "Technical Standards",
        url: "/director/standards",
        icon: Shield,
        roles: ["technical_director"],
        items: [
          {
            title: "QA Guidelines",
            url: "/director/standards/guidelines",
          },
          {
            title: "Best Practices",
            url: "/director/standards/practices",
          },
          {
            title: "Compliance",
            url: "/director/standards/compliance",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Active Reviews",
        url: "/director/reviews/active",
        icon: CheckCircle,
        roles: ["technical_director"],
      },
      {
        name: "Team Performance",
        url: "/director/team/performance",
        icon: TrendingUp,
        roles: ["technical_director"],
      },
      {
        name: "Technical Reports",
        url: "/director/reports",
        icon: FileText,
        roles: ["technical_director"],
      },
    ],
    navSecondary: [
      {
        title: "Technical Support",
        url: "/director/support",
        icon: Shield,
        roles: ["technical_director"],
      },
      {
        title: "Documentation",
        url: "/director/docs",
        icon: FileText,
        roles: ["technical_director"],
      },
    ],
  },
  member_firm: {
    navMain: [
      {
        title: "Firm Dashboard",
        url: "/firm/dashboard",
        icon: BarChart3,
        isActive: true,
        roles: ["member_firm"],
      },
      {
        title: "My Reviews",
        url: "/firm/reviews",
        icon: ClipboardList,
        roles: ["member_firm"],
        items: [
          {
            title: "Pending Reviews",
            url: "/firm/reviews/pending",
          },
          {
            title: "Completed Reviews",
            url: "/firm/reviews/completed",
          },
          {
            title: "Review History",
            url: "/firm/reviews/history",
          },
        ],
      },
      {
        title: "Compliance",
        url: "/firm/compliance",
        icon: CheckCircle,
        roles: ["member_firm"],
        items: [
          {
            title: "Compliance Status",
            url: "/firm/compliance/status",
          },
          {
            title: "Requirements",
            url: "/firm/compliance/requirements",
          },
          {
            title: "Certifications",
            url: "/firm/compliance/certifications",
          },
        ],
      },
      {
        title: "Resources",
        url: "/firm/resources",
        icon: FileText,
        roles: ["member_firm"],
        items: [
          {
            title: "Guidelines",
            url: "/firm/resources/guidelines",
          },
          {
            title: "Templates",
            url: "/firm/resources/templates",
          },
          {
            title: "Training Materials",
            url: "/firm/resources/training",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Active Projects",
        url: "/firm/projects/active",
        icon: CheckCircle,
        roles: ["member_firm"],
      },
      {
        name: "Compliance Tracker",
        url: "/firm/compliance/tracker",
        icon: AlertTriangle,
        roles: ["member_firm"],
      },
      {
        name: "Performance Reports",
        url: "/firm/reports",
        icon: TrendingUp,
        roles: ["member_firm"],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "/firm/support",
        icon: Shield,
        roles: ["member_firm"],
      },
      {
        title: "Feedback",
        url: "/firm/feedback",
        icon: FileText,
        roles: ["member_firm"],
      },
    ],
  },
  reviewer: {
    navMain: [
      {
        title: "Review Dashboard",
        url: "/reviewer/dashboard",
        icon: BarChart3,
        isActive: true,
        roles: ["reviewer"],
      },
      {
        title: "Assigned Reviews",
        url: "/reviewer/reviews",
        icon: ClipboardList,
        roles: ["reviewer"],
        items: [
          {
            title: "Pending Reviews",
            url: "/reviewer/reviews/pending",
          },
          {
            title: "In Progress",
            url: "/reviewer/reviews/in-progress",
          },
          {
            title: "Completed",
            url: "/reviewer/reviews/completed",
          },
        ],
      },
      {
        title: "Review Tools",
        url: "/reviewer/tools",
        icon: CheckCircle,
        roles: ["reviewer"],
        items: [
          {
            title: "Checklist Templates",
            url: "/reviewer/tools/checklists",
          },
          {
            title: "Review Guidelines",
            url: "/reviewer/tools/guidelines",
          },
          {
            title: "Quality Standards",
            url: "/reviewer/tools/standards",
          },
        ],
      },
      {
        title: "My Performance",
        url: "/reviewer/performance",
        icon: TrendingUp,
        roles: ["reviewer"],
        items: [
          {
            title: "Review Statistics",
            url: "/reviewer/performance/stats",
          },
          {
            title: "Quality Metrics",
            url: "/reviewer/performance/quality",
          },
          {
            title: "Feedback",
            url: "/reviewer/performance/feedback",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Urgent Reviews",
        url: "/reviewer/reviews/urgent",
        icon: AlertTriangle,
        roles: ["reviewer"],
      },
      {
        name: "Review Templates",
        url: "/reviewer/templates",
        icon: FileText,
        roles: ["reviewer"],
      },
      {
        name: "My Reports",
        url: "/reviewer/reports",
        icon: BarChart3,
        roles: ["reviewer"],
      },
    ],
    navSecondary: [
      {
        title: "Help & Support",
        url: "/reviewer/help",
        icon: Shield,
        roles: ["reviewer"],
      },
      {
        title: "Training",
        url: "/reviewer/training",
        icon: FileText,
        roles: ["reviewer"],
      },
    ],
  },
}

export function getNavigationForRole(role: UserRole) {
  return navigationData[role] || navigationData.reviewer
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames = {
    admin: "Administrator",
    ceo: "CEO",
    technical_director: "Technical Director",
    member_firm: "Member Firm",
    reviewer: "Reviewer",
  }
  return roleNames[role] || "Reviewer"
}
