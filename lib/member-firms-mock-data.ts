export interface MemberFirm {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "pending" | "suspended"
  type: "prospect" | "current_member"
  location: string
  country: string
  region: string
  establishedYear: number
  employeeCount: number
  partnerCount: number
  specializations: string[]
  certifications: string[]
  contactPerson: string
  contactEmail: string
  contactPhone: string
  website?: string
  address: string
  joinDate: string
  lastReviewDate: string
  nextReviewDate: string
  totalReviews: number
  averageRating: number
  complianceScore: number
  riskLevel: "low" | "medium" | "high"
  avatar?: string
  description?: string
  languages: string[]
  timezone: string
  currency: string
}

export const mockMemberFirms: MemberFirm[] = [
  {
    id: "1",
    name: "Anderson & Associates LLP",
    email: "contact@anderson-associates.com",
    status: "active",
    type: "current_member",
    location: "New York, USA",
    country: "United States",
    region: "North America",
    establishedYear: 1985,
    employeeCount: 150,
    partnerCount: 12,
    specializations: ["Corporate Law", "Tax Advisory", "Mergers & Acquisitions", "Securities"],
    certifications: ["ISO 9001", "SOC 2", "CPA Firm"],
    contactPerson: "John Anderson",
    contactEmail: "john.anderson@anderson-associates.com",
    contactPhone: "+1-555-0101",
    website: "https://anderson-associates.com",
    address: "123 Wall Street, New York, NY 10005",
    joinDate: "2010-03-15",
    lastReviewDate: "2023-12-15",
    nextReviewDate: "2024-12-15",
    totalReviews: 24,
    averageRating: 4.7,
    complianceScore: 92,
    riskLevel: "low",
    description: "Leading corporate law firm specializing in complex business transactions and regulatory compliance.",
    languages: ["English", "Spanish"],
    timezone: "America/New_York",
    currency: "USD"
  },
  {
    id: "2",
    name: "European Legal Partners",
    email: "info@european-legal.com",
    status: "active",
    type: "current_member",
    location: "London, UK",
    country: "United Kingdom",
    region: "Europe",
    establishedYear: 1992,
    employeeCount: 200,
    partnerCount: 18,
    specializations: ["International Law", "EU Regulations", "Commercial Litigation", "IP Law"],
    certifications: ["ISO 27001", "Lexcel", "SRA Approved"],
    contactPerson: "Sarah Mitchell",
    contactEmail: "sarah.mitchell@european-legal.com",
    contactPhone: "+44-20-7946-0958",
    website: "https://european-legal.com",
    address: "45 Fleet Street, London EC4Y 1AA",
    joinDate: "2012-07-20",
    lastReviewDate: "2023-11-20",
    nextReviewDate: "2024-11-20",
    totalReviews: 18,
    averageRating: 4.5,
    complianceScore: 88,
    riskLevel: "low",
    description: "Premier European law firm with extensive experience in cross-border transactions and regulatory matters.",
    languages: ["English", "French", "German", "Spanish"],
    timezone: "Europe/London",
    currency: "GBP"
  },
  {
    id: "3",
    name: "Asia Pacific Legal Group",
    email: "contact@asiapacific-legal.com",
    status: "active",
    type: "current_member",
    location: "Singapore",
    country: "Singapore",
    region: "Asia Pacific",
    establishedYear: 2000,
    employeeCount: 85,
    partnerCount: 8,
    specializations: ["Banking & Finance", "Real Estate", "Corporate Governance", "Dispute Resolution"],
    certifications: ["ISO 9001", "SAC Accredited"],
    contactPerson: "David Chen",
    contactEmail: "david.chen@asiapacific-legal.com",
    contactPhone: "+65-6123-4567",
    website: "https://asiapacific-legal.com",
    address: "88 Robinson Road, Singapore 068898",
    joinDate: "2015-01-10",
    lastReviewDate: "2023-10-10",
    nextReviewDate: "2024-10-10",
    totalReviews: 12,
    averageRating: 4.3,
    complianceScore: 85,
    riskLevel: "medium",
    description: "Growing law firm with strong presence in Southeast Asian markets and expertise in regional regulations.",
    languages: ["English", "Mandarin", "Malay", "Tamil"],
    timezone: "Asia/Singapore",
    currency: "SGD"
  },
  {
    id: "4",
    name: "Canadian Legal Services",
    email: "info@canadian-legal.ca",
    status: "active",
    type: "current_member",
    location: "Toronto, Canada",
    country: "Canada",
    region: "North America",
    establishedYear: 1978,
    employeeCount: 120,
    partnerCount: 15,
    specializations: ["Immigration Law", "Family Law", "Criminal Defense", "Employment Law"],
    certifications: ["LSO Certified", "ISO 9001"],
    contactPerson: "Michael Thompson",
    contactEmail: "michael.thompson@canadian-legal.ca",
    contactPhone: "+1-416-555-0123",
    website: "https://canadian-legal.ca",
    address: "100 King Street West, Toronto, ON M5X 1A9",
    joinDate: "2008-09-01",
    lastReviewDate: "2023-09-01",
    nextReviewDate: "2024-09-01",
    totalReviews: 20,
    averageRating: 4.6,
    complianceScore: 90,
    riskLevel: "low",
    description: "Established Canadian law firm providing comprehensive legal services across multiple practice areas.",
    languages: ["English", "French"],
    timezone: "America/Toronto",
    currency: "CAD"
  },
  {
    id: "5",
    name: "Australian Legal Partners",
    email: "contact@australian-legal.com.au",
    status: "pending",
    type: "prospect",
    location: "Sydney, Australia",
    country: "Australia",
    region: "Asia Pacific",
    establishedYear: 2010,
    employeeCount: 65,
    partnerCount: 6,
    specializations: ["Mining Law", "Environmental Law", "Commercial Law", "Property Law"],
    certifications: ["ISO 9001", "Law Society NSW"],
    contactPerson: "Emma Wilson",
    contactEmail: "emma.wilson@australian-legal.com.au",
    contactPhone: "+61-2-9876-5432",
    website: "https://australian-legal.com.au",
    address: "Level 25, 123 Pitt Street, Sydney NSW 2000",
    joinDate: "2024-01-15",
    lastReviewDate: "2024-01-15",
    nextReviewDate: "2025-01-15",
    totalReviews: 0,
    averageRating: 0,
    complianceScore: 0,
    riskLevel: "medium",
    description: "Specialized law firm focusing on mining and environmental regulations in the Australian market.",
    languages: ["English"],
    timezone: "Australia/Sydney",
    currency: "AUD"
  },
  {
    id: "6",
    name: "Latin American Legal Group",
    email: "info@latin-legal.com",
    status: "active",
    type: "current_member",
    location: "São Paulo, Brazil",
    country: "Brazil",
    region: "South America",
    establishedYear: 1995,
    employeeCount: 95,
    partnerCount: 10,
    specializations: ["Corporate Law", "Tax Law", "Labor Law", "International Trade"],
    certifications: ["OAB Certified", "ISO 9001"],
    contactPerson: "Carlos Rodriguez",
    contactEmail: "carlos.rodriguez@latin-legal.com",
    contactPhone: "+55-11-3456-7890",
    website: "https://latin-legal.com",
    address: "Av. Paulista, 1000, São Paulo, SP 01310-100",
    joinDate: "2018-05-20",
    lastReviewDate: "2023-05-20",
    nextReviewDate: "2024-05-20",
    totalReviews: 8,
    averageRating: 4.2,
    complianceScore: 82,
    riskLevel: "medium",
    description: "Leading Brazilian law firm with expertise in corporate transactions and regulatory compliance.",
    languages: ["Portuguese", "English", "Spanish"],
    timezone: "America/Sao_Paulo",
    currency: "BRL"
  },
  {
    id: "7",
    name: "Middle East Legal Services",
    email: "contact@middleeast-legal.ae",
    status: "suspended",
    type: "prospect",
    location: "Dubai, UAE",
    country: "United Arab Emirates",
    region: "Middle East",
    establishedYear: 2005,
    employeeCount: 45,
    partnerCount: 4,
    specializations: ["Islamic Finance", "Commercial Law", "Real Estate", "Banking"],
    certifications: ["DIFC Licensed", "ISO 9001"],
    contactPerson: "Ahmed Al-Rashid",
    contactEmail: "ahmed.alrashid@middleeast-legal.ae",
    contactPhone: "+971-4-123-4567",
    website: "https://middleeast-legal.ae",
    address: "Sheikh Zayed Road, Dubai, UAE",
    joinDate: "2020-03-10",
    lastReviewDate: "2023-03-10",
    nextReviewDate: "2024-03-10",
    totalReviews: 6,
    averageRating: 3.8,
    complianceScore: 75,
    riskLevel: "high",
    description: "Specialized law firm serving the Middle Eastern market with focus on Islamic finance and commercial law.",
    languages: ["Arabic", "English", "French"],
    timezone: "Asia/Dubai",
    currency: "AED"
  },
  {
    id: "8",
    name: "African Legal Consortium",
    email: "info@african-legal.co.za",
    status: "active",
    type: "current_member",
    location: "Cape Town, South Africa",
    country: "South Africa",
    region: "Africa",
    establishedYear: 1988,
    employeeCount: 75,
    partnerCount: 9,
    specializations: ["Mining Law", "Environmental Law", "Commercial Law", "Labor Law"],
    certifications: ["LSSA Certified", "ISO 9001"],
    contactPerson: "Thabo Mbeki",
    contactEmail: "thabo.mbeki@african-legal.co.za",
    contactPhone: "+27-21-123-4567",
    website: "https://african-legal.co.za",
    address: "1 Thibault Square, Cape Town 8001",
    joinDate: "2016-11-15",
    lastReviewDate: "2023-11-15",
    nextReviewDate: "2024-11-15",
    totalReviews: 10,
    averageRating: 4.1,
    complianceScore: 80,
    riskLevel: "medium",
    description: "Established South African law firm with expertise in mining, environmental, and commercial law.",
    languages: ["English", "Afrikaans", "Xhosa"],
    timezone: "Africa/Johannesburg",
    currency: "ZAR"
  }
]

export const getStatusColor = (status: MemberFirm["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200"
    case "inactive":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "suspended":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getTypeColor = (type: MemberFirm["type"]) => {
  switch (type) {
    case "current_member":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "prospect":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getTypeLabel = (type: MemberFirm["type"]) => {
  switch (type) {
    case "current_member":
      return "Current Member"
    case "prospect":
      return "Prospect"
    default:
      return type
  }
}

export const getRiskLevelColor = (riskLevel: MemberFirm["riskLevel"]) => {
  switch (riskLevel) {
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getComplianceScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600"
  if (score >= 80) return "text-yellow-600"
  return "text-red-600"
}

export const generateFirmInitials = (firmName: string) => {
  return firmName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

export const generateFirmAvatarColor = (firmName: string) => {
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-purple-100 text-purple-600',
    'bg-orange-100 text-orange-600',
    'bg-pink-100 text-pink-600',
    'bg-indigo-100 text-indigo-600',
    'bg-teal-100 text-teal-600',
    'bg-red-100 text-red-600',
    'bg-yellow-100 text-yellow-600',
    'bg-cyan-100 text-cyan-600'
  ]

  let hash = 0
  for (let i = 0; i < firmName.length; i++) {
    hash = firmName.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}
