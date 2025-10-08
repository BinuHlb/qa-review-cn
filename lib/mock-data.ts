export interface Document {
  id: string
  name: string
  size: string
  uploadedBy: string
  uploadedAt: string
  type: string
  url?: string
}

export interface Review {
  id: string
  memberFirm: string
  type: 'Current Member' | 'Prospect'
  reviewer: string
  country: string
  reviewerStatus: 'Active' | 'Inactive' | 'Pending'
  partnerStatus: 'Active' | 'Inactive' | 'Pending'
  startDate: string
  endDate: string
  currentGrade: '1' | '2' | '3' | '4' | '5'
  status: 'Completed' | 'Submitted' | 'In Progress' | 'Pending' | 'Overdue' | 'Cancelled' | 'Rejected'
  description?: string
  priority: 'High' | 'Medium' | 'Low'
  lastUpdated: string
  documents?: Document[]
}

export const mockReviews: Review[] = [
  {
    id: 'REV-001',
    memberFirm: 'Deloitte & Associates',
    type: 'Current Member',
    reviewer: 'John Smith',
    country: 'United States',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    currentGrade: '1',
    status: 'In Progress',
    description: 'Current member quality assurance review',
    priority: 'High',
    lastUpdated: '2024-01-20',
    documents: [
      {
        id: 'DOC-001',
        name: 'Financial Statements 2023.pdf',
        size: '2.5 MB',
        uploadedBy: 'John Smith',
        uploadedAt: '2024-01-15T10:30:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-002',
        name: 'Audit Report.pdf',
        size: '1.8 MB',
        uploadedBy: 'John Smith',
        uploadedAt: '2024-01-16T14:20:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-003',
        name: 'Compliance Certificate.pdf',
        size: '850 KB',
        uploadedBy: 'Sarah Admin',
        uploadedAt: '2024-01-17T09:15:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-004',
        name: 'Quality Review Checklist.xlsx',
        size: '450 KB',
        uploadedBy: 'John Smith',
        uploadedAt: '2024-01-18T11:45:00Z',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    ]
  },
  {
    id: 'REV-002',
    memberFirm: 'PwC Global',
    type: 'Prospect',
    reviewer: 'Sarah Johnson',
    country: 'United Kingdom',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    currentGrade: '2',
    status: 'Submitted',
    description: 'Prospect review and assessment',
    priority: 'High',
    lastUpdated: '2024-02-28',
    documents: [
      {
        id: 'DOC-005',
        name: 'Compliance Report Q1 2024.pdf',
        size: '3.2 MB',
        uploadedBy: 'Sarah Johnson',
        uploadedAt: '2024-02-10T08:30:00Z',
        type: 'application/pdf'
      },
      {
        id: 'DOC-006',
        name: 'Risk Assessment.docx',
        size: '1.1 MB',
        uploadedBy: 'Sarah Johnson',
        uploadedAt: '2024-02-12T16:45:00Z',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
    ]
  },
  {
    id: 'REV-003',
    memberFirm: 'KPMG International',
    type: 'Current Member',
    reviewer: 'Michael Chen',
    country: 'Canada',
    reviewerStatus: 'Active',
    partnerStatus: 'Pending',
    startDate: '2024-01-20',
    endDate: '2024-04-20',
    currentGrade: '1',
    status: 'In Progress',
    description: 'Current member quality assurance review',
    priority: 'Medium',
    lastUpdated: '2024-01-25'
  },
  {
    id: 'REV-004',
    memberFirm: 'EY Global',
    type: 'Prospect',
    reviewer: 'Emily Davis',
    country: 'Australia',
    reviewerStatus: 'Inactive',
    partnerStatus: 'Active',
    startDate: '2024-01-10',
    endDate: '2024-01-31',
    currentGrade: '3',
    status: 'Overdue',
    description: 'Prospect assessment and review',
    priority: 'High',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'REV-005',
    memberFirm: 'Grant Thornton',
    type: 'Current Member',
    reviewer: 'David Wilson',
    country: 'Germany',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
    currentGrade: '2',
    status: 'Pending',
    description: 'Current member operational review',
    priority: 'Medium',
    lastUpdated: '2024-02-10'
  },
  {
    id: 'REV-006',
    memberFirm: 'BDO International',
    type: 'Prospect',
    reviewer: 'Lisa Anderson',
    country: 'France',
    reviewerStatus: 'Active',
    partnerStatus: 'Inactive',
    startDate: '2024-01-05',
    endDate: '2024-02-05',
    currentGrade: '1',
    status: 'Submitted',
    description: 'Prospect review and compliance check',
    priority: 'High',
    lastUpdated: '2024-02-05'
  },
  {
    id: 'REV-007',
    memberFirm: 'RSM International',
    type: 'Current Member',
    reviewer: 'Robert Taylor',
    country: 'Japan',
    reviewerStatus: 'Pending',
    partnerStatus: 'Active',
    startDate: '2024-03-01',
    endDate: '2024-06-01',
    currentGrade: '2',
    status: 'Pending',
    description: 'Current member standards assessment',
    priority: 'High',
    lastUpdated: '2024-02-28'
  },
  {
    id: 'REV-008',
    memberFirm: 'Crowe Global',
    type: 'Prospect',
    reviewer: 'Jennifer Brown',
    country: 'Netherlands',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    startDate: '2024-02-20',
    endDate: '2024-04-20',
    currentGrade: '1',
    status: 'In Progress',
    description: 'Prospect compliance and quality review',
    priority: 'Medium',
    lastUpdated: '2024-02-25'
  },
  {
    id: 'REV-009',
    memberFirm: 'Mazars',
    type: 'Current Member',
    reviewer: 'Christopher Lee',
    country: 'Singapore',
    reviewerStatus: 'Active',
    partnerStatus: 'Pending',
    startDate: '2024-01-30',
    endDate: '2024-03-30',
    currentGrade: '3',
    status: 'In Progress',
    description: 'Current member performance evaluation',
    priority: 'Low',
    lastUpdated: '2024-02-01'
  },
  {
    id: 'REV-010',
    memberFirm: 'Nexia International',
    type: 'Prospect',
    reviewer: 'Amanda Garcia',
    country: 'Brazil',
    reviewerStatus: 'Inactive',
    partnerStatus: 'Inactive',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    currentGrade: '4',
    status: 'Cancelled',
    description: 'Prospect governance and ethics review',
    priority: 'Medium',
    lastUpdated: '2024-01-15'
  }
]

export const getGradeColor = (grade: Review['currentGrade']): string => {
  const gradeColors = {
    '1': 'bg-green-600 text-white', // Best - 1 is best
    '2': 'bg-blue-600 text-white',   // Good
    '3': 'bg-yellow-600 text-white', // Ok
    '4': 'bg-orange-600 text-white', // Bad
    '5': 'bg-red-600 text-white'       // Poor - 5 is poor
  }
  return gradeColors[grade] || 'bg-gray-600 text-white'
}

export const getStatusColor = (status: Review['status']): string => {
  const statusColors = {
    'Completed': 'text-green-600 bg-green-50',
    'Submitted': 'text-purple-600 bg-purple-50', // Ready for final review
    'In Progress': 'text-blue-600 bg-blue-50',
    'Pending': 'text-yellow-600 bg-yellow-50',
    'Overdue': 'text-red-600 bg-red-50',
    'Cancelled': 'text-gray-600 bg-gray-50',
    'Rejected': 'text-red-600 bg-red-50'
  }
  return statusColors[status] || 'text-gray-600 bg-gray-50'
}

export const getPriorityColor = (priority: Review['priority']): string => {
  const priorityColors = {
    'High': 'text-red-600 bg-red-50',
    'Medium': 'text-yellow-600 bg-yellow-50',
    'Low': 'text-green-600 bg-green-50'
  }
  return priorityColors[priority] || 'text-gray-600 bg-gray-50'
}

export const getReviewerStatusColor = (status: Review['reviewerStatus'] | Review['partnerStatus']): string => {
  const statusColors = {
    'Active': 'text-green-600 bg-green-50',
    'Inactive': 'text-gray-600 bg-gray-50',
    'Pending': 'text-yellow-600 bg-yellow-50'
  }
  return statusColors[status] || 'text-gray-600 bg-gray-50'
}
