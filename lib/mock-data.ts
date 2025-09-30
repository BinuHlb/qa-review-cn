export interface Review {
  id: string
  memberFirm: string
  type: string
  reviewer: string
  country: string
  reviewerStatus: 'Active' | 'Inactive' | 'Pending'
  partnerStatus: 'Active' | 'Inactive' | 'Pending'
  startDate: string
  endDate: string
  currentGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F'
  status: 'Completed' | 'In Progress' | 'Pending' | 'Overdue' | 'Cancelled'
  description?: string
  priority: 'High' | 'Medium' | 'Low'
  lastUpdated: string
}

export const mockReviews: Review[] = [
  {
    id: 'REV-001',
    memberFirm: 'Deloitte & Associates',
    type: 'Annual Review',
    reviewer: 'John Smith',
    country: 'United States',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    currentGrade: 'A',
    status: 'In Progress',
    description: 'Comprehensive annual quality assurance review',
    priority: 'High',
    lastUpdated: '2024-01-20'
  },
  {
    id: 'REV-002',
    memberFirm: 'PwC Global',
    type: 'Compliance Review',
    reviewer: 'Sarah Johnson',
    country: 'United Kingdom',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    currentGrade: 'B+',
    status: 'Completed',
    description: 'Regulatory compliance assessment',
    priority: 'High',
    lastUpdated: '2024-02-28'
  },
  {
    id: 'REV-003',
    memberFirm: 'KPMG International',
    type: 'Risk Assessment',
    reviewer: 'Michael Chen',
    country: 'Canada',
    reviewerStatus: 'Active',
    partnerStatus: 'Pending',
    startDate: '2024-01-20',
    endDate: '2024-04-20',
    currentGrade: 'A+',
    status: 'In Progress',
    description: 'Enterprise risk management review',
    priority: 'Medium',
    lastUpdated: '2024-01-25'
  },
  {
    id: 'REV-004',
    memberFirm: 'EY Global',
    type: 'Quality Audit',
    reviewer: 'Emily Davis',
    country: 'Australia',
    reviewerStatus: 'Inactive',
    partnerStatus: 'Active',
    startDate: '2024-01-10',
    endDate: '2024-01-31',
    currentGrade: 'C+',
    status: 'Overdue',
    description: 'Quality management system audit',
    priority: 'High',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'REV-005',
    memberFirm: 'Grant Thornton',
    type: 'Performance Review',
    reviewer: 'David Wilson',
    country: 'Germany',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
    currentGrade: 'B',
    status: 'Pending',
    description: 'Operational performance evaluation',
    priority: 'Medium',
    lastUpdated: '2024-02-10'
  },
  {
    id: 'REV-006',
    memberFirm: 'BDO International',
    type: 'Financial Review',
    reviewer: 'Lisa Anderson',
    country: 'France',
    reviewerStatus: 'Active',
    partnerStatus: 'Inactive',
    startDate: '2024-01-05',
    endDate: '2024-02-05',
    currentGrade: 'A-',
    status: 'Completed',
    description: 'Financial controls and procedures review',
    priority: 'High',
    lastUpdated: '2024-02-05'
  },
  {
    id: 'REV-007',
    memberFirm: 'RSM International',
    type: 'IT Security Review',
    reviewer: 'Robert Taylor',
    country: 'Japan',
    reviewerStatus: 'Pending',
    partnerStatus: 'Active',
    startDate: '2024-03-01',
    endDate: '2024-06-01',
    currentGrade: 'B+',
    status: 'Pending',
    description: 'Information technology security assessment',
    priority: 'High',
    lastUpdated: '2024-02-28'
  },
  {
    id: 'REV-008',
    memberFirm: 'Crowe Global',
    type: 'Environmental Review',
    reviewer: 'Jennifer Brown',
    country: 'Netherlands',
    reviewerStatus: 'Active',
    partnerStatus: 'Active',
    startDate: '2024-02-20',
    endDate: '2024-04-20',
    currentGrade: 'A',
    status: 'In Progress',
    description: 'Environmental compliance and sustainability review',
    priority: 'Medium',
    lastUpdated: '2024-02-25'
  },
  {
    id: 'REV-009',
    memberFirm: 'Mazars',
    type: 'Operational Review',
    reviewer: 'Christopher Lee',
    country: 'Singapore',
    reviewerStatus: 'Active',
    partnerStatus: 'Pending',
    startDate: '2024-01-30',
    endDate: '2024-03-30',
    currentGrade: 'C',
    status: 'In Progress',
    description: 'Operational efficiency and process review',
    priority: 'Low',
    lastUpdated: '2024-02-01'
  },
  {
    id: 'REV-010',
    memberFirm: 'Nexia International',
    type: 'Governance Review',
    reviewer: 'Amanda Garcia',
    country: 'Brazil',
    reviewerStatus: 'Inactive',
    partnerStatus: 'Inactive',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    currentGrade: 'D',
    status: 'Cancelled',
    description: 'Corporate governance and ethics review',
    priority: 'Medium',
    lastUpdated: '2024-01-15'
  }
]

export const getGradeColor = (grade: Review['currentGrade']): string => {
  const gradeColors = {
    'A+': 'text-green-600 bg-green-50',
    'A': 'text-green-600 bg-green-50',
    'A-': 'text-green-500 bg-green-50',
    'B+': 'text-blue-600 bg-blue-50',
    'B': 'text-blue-600 bg-blue-50',
    'B-': 'text-blue-500 bg-blue-50',
    'C+': 'text-yellow-600 bg-yellow-50',
    'C': 'text-yellow-600 bg-yellow-50',
    'C-': 'text-yellow-500 bg-yellow-50',
    'D': 'text-orange-600 bg-orange-50',
    'F': 'text-red-600 bg-red-50'
  }
  return gradeColors[grade] || 'text-gray-600 bg-gray-50'
}

export const getStatusColor = (status: Review['status']): string => {
  const statusColors = {
    'Completed': 'text-green-600 bg-green-50',
    'In Progress': 'text-blue-600 bg-blue-50',
    'Pending': 'text-yellow-600 bg-yellow-50',
    'Overdue': 'text-red-600 bg-red-50',
    'Cancelled': 'text-gray-600 bg-gray-50'
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
