export interface Reviewer {
  id: string
  name: string
  email: string
  role: "reviewer" | "senior_reviewer" | "lead_reviewer" | "partner"
  status: "active" | "inactive" | "on_leave"
  specialization: string[]
  experience: number // years
  currentWorkload: number
  maxWorkload: number
  location: string
  phone?: string
  joinDate: string
  lastActive: string
  totalReviews: number
  averageRating: number
  avatar?: string
  bio?: string
  certifications: string[]
  languages: string[]
}

export const mockReviewers: Reviewer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "lead_reviewer",
    status: "active",
    specialization: ["Financial Services", "Risk Management", "Compliance"],
    experience: 12,
    currentWorkload: 8,
    maxWorkload: 15,
    location: "New York, USA",
    phone: "+1-555-0123",
    joinDate: "2020-03-15",
    lastActive: "2024-01-15",
    totalReviews: 156,
    averageRating: 4.8,
    bio: "Senior financial services expert with extensive experience in risk management and regulatory compliance.",
    certifications: ["CPA", "CFA", "FRM"],
    languages: ["English", "Spanish"]
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "senior_reviewer",
    status: "active",
    specialization: ["Technology", "Cybersecurity", "Data Privacy"],
    experience: 8,
    currentWorkload: 12,
    maxWorkload: 18,
    location: "San Francisco, USA",
    phone: "+1-555-0124",
    joinDate: "2021-07-20",
    lastActive: "2024-01-14",
    totalReviews: 89,
    averageRating: 4.6,
    bio: "Technology and cybersecurity specialist with deep knowledge in data privacy regulations.",
    certifications: ["CISSP", "CISM", "CISA"],
    languages: ["English", "Mandarin"]
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    role: "reviewer",
    status: "active",
    specialization: ["Healthcare", "Quality Assurance", "Regulatory Affairs"],
    experience: 5,
    currentWorkload: 6,
    maxWorkload: 12,
    location: "Boston, USA",
    phone: "+1-555-0125",
    joinDate: "2022-01-10",
    lastActive: "2024-01-13",
    totalReviews: 45,
    averageRating: 4.4,
    bio: "Healthcare quality assurance expert with strong background in regulatory compliance.",
    certifications: ["RAC", "CQA"],
    languages: ["English", "Spanish", "Portuguese"]
  },
  {
    id: "4",
    name: "David Thompson",
    email: "david.thompson@example.com",
    role: "partner",
    status: "active",
    specialization: ["Strategic Planning", "Business Operations", "Leadership"],
    experience: 15,
    currentWorkload: 4,
    maxWorkload: 8,
    location: "London, UK",
    phone: "+44-20-7946-0958",
    joinDate: "2019-09-01",
    lastActive: "2024-01-12",
    totalReviews: 203,
    averageRating: 4.9,
    bio: "Senior partner with extensive experience in strategic planning and business operations.",
    certifications: ["MBA", "PMP", "Six Sigma Black Belt"],
    languages: ["English", "French", "German"]
  },
  {
    id: "5",
    name: "Lisa Wang",
    email: "lisa.wang@example.com",
    role: "senior_reviewer",
    status: "active",
    specialization: ["Manufacturing", "Supply Chain", "Quality Control"],
    experience: 10,
    currentWorkload: 10,
    maxWorkload: 16,
    location: "Singapore",
    phone: "+65-6123-4567",
    joinDate: "2020-11-05",
    lastActive: "2024-01-11",
    totalReviews: 78,
    averageRating: 4.7,
    bio: "Manufacturing and supply chain expert with strong focus on quality control processes.",
    certifications: ["ASQ-CQE", "CPSM", "APICS"],
    languages: ["English", "Mandarin", "Malay"]
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james.wilson@example.com",
    role: "reviewer",
    status: "on_leave",
    specialization: ["Energy", "Environmental", "Sustainability"],
    experience: 6,
    currentWorkload: 0,
    maxWorkload: 10,
    location: "Houston, USA",
    phone: "+1-555-0126",
    joinDate: "2021-04-12",
    lastActive: "2023-12-20",
    totalReviews: 32,
    averageRating: 4.3,
    bio: "Energy and environmental specialist with expertise in sustainability practices.",
    certifications: ["PE", "LEED AP", "ISO 14001"],
    languages: ["English"]
  },
  {
    id: "7",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    role: "reviewer",
    status: "active",
    specialization: ["Education", "Training", "Development"],
    experience: 4,
    currentWorkload: 8,
    maxWorkload: 12,
    location: "Madrid, Spain",
    phone: "+34-91-123-4567",
    joinDate: "2022-08-15",
    lastActive: "2024-01-10",
    totalReviews: 28,
    averageRating: 4.2,
    bio: "Education and training specialist with focus on professional development programs.",
    certifications: ["CPTD", "SHRM-CP"],
    languages: ["Spanish", "English", "French"]
  },
  {
    id: "8",
    name: "Robert Kim",
    email: "robert.kim@example.com",
    role: "senior_reviewer",
    status: "active",
    specialization: ["Real Estate", "Construction", "Project Management"],
    experience: 9,
    currentWorkload: 14,
    maxWorkload: 18,
    location: "Seoul, South Korea",
    phone: "+82-2-1234-5678",
    joinDate: "2021-02-28",
    lastActive: "2024-01-09",
    totalReviews: 67,
    averageRating: 4.5,
    bio: "Real estate and construction expert with extensive project management experience.",
    certifications: ["PMP", "P.Eng", "RICS"],
    languages: ["Korean", "English", "Japanese"]
  }
]

export const getRoleColor = (role: Reviewer["role"]) => {
  switch (role) {
    case "partner":
      return "bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800"
    case "lead_reviewer":
      return "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
    case "senior_reviewer":
      return "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
    case "reviewer":
      return "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700"
    default:
      return "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700"
  }
}

export const getStatusColor = (status: Reviewer["status"]) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
    case "inactive":
      return "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
    case "on_leave":
      return "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
    default:
      return "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700"
  }
}

export const getWorkloadColor = (current: number, max: number) => {
  const percentage = (current / max) * 100
  if (percentage >= 90) return "text-rose-600 dark:text-rose-400"
  if (percentage >= 75) return "text-amber-600 dark:text-amber-400"
  return "text-emerald-600 dark:text-emerald-400"
}

export const generateReviewerInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

export const generateReviewerAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-cyan-500'
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}
