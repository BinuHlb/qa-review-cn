export interface FAQCategory {
  id: string
  name: string
  icon: string
  faqs: FAQ[]
}

export interface FAQ {
  id: string
  question: string
  answer: string
  keywords: string[]
  category: string
}

export const faqCategories: FAQCategory[] = [
  {
    id: "reviews",
    name: "QA Reviews",
    icon: "mdi:clipboard-check",
    faqs: [
      {
        id: "what-is-qa-review",
        question: "What is a QA Review?",
        answer: "A QA Review is a comprehensive quality assessment of member firms to ensure compliance with professional standards and best practices. Reviews evaluate documentation, processes, and adherence to regulatory requirements.",
        keywords: ["qa", "quality", "assessment", "review", "what is"],
        category: "reviews"
      },
      {
        id: "review-process",
        question: "How does the review process work?",
        answer: "The review process follows these steps: 1) Assignment to a qualified reviewer, 2) Document collection and review, 3) On-site or remote assessment, 4) Grading and feedback, 5) Technical Director verification, 6) CEO final approval.",
        keywords: ["process", "workflow", "steps", "how", "procedure"],
        category: "reviews"
      },
      {
        id: "review-timeline",
        question: "How long does a review take?",
        answer: "A typical QA review takes 10-15 business days from start to finish. This includes document review (3-5 days), assessment (2-3 days), grading (1-2 days), verification (1-2 days), and final approval (1-2 days).",
        keywords: ["timeline", "duration", "how long", "time", "days"],
        category: "reviews"
      },
      {
        id: "review-types",
        question: "What types of reviews are available?",
        answer: "We conduct several review types: Annual Reviews (comprehensive yearly assessment), Engagement Reviews (specific project evaluation), Prospect Reviews (for new firm applications), and Special Reviews (targeted assessments for specific concerns).",
        keywords: ["types", "kinds", "categories", "annual", "engagement", "prospect"],
        category: "reviews"
      }
    ]
  },
  {
    id: "grading",
    name: "Grading System",
    icon: "mdi:star-outline",
    faqs: [
      {
        id: "grading-scale",
        question: "What is the grading scale?",
        answer: "Reviews are graded on a scale from 1-5: Grade 5 (Excellent - Exceeds all standards), Grade 4 (Good - Meets all standards), Grade 3 (Satisfactory - Meets most standards with minor improvements needed), Grade 2 (Needs Improvement - Significant deficiencies), Grade 1 (Unsatisfactory - Major deficiencies requiring immediate action).",
        keywords: ["grade", "scale", "rating", "score", "1-5", "grading"],
        category: "grading"
      },
      {
        id: "who-grades",
        question: "Who assigns the grades?",
        answer: "Grades are assigned through a multi-level review: The assigned Reviewer provides the initial grade, the Technical Director verifies and may adjust the grade, and the CEO provides final approval. This ensures objective and thorough assessment.",
        keywords: ["who", "grades", "assigns", "reviewer", "director", "ceo"],
        category: "grading"
      },
      {
        id: "prospect-grading",
        question: "How are prospect firms graded?",
        answer: "Prospect firms (new applicants) receive a Pass/Fail decision rather than a numerical grade. The decision is based on meeting minimum qualification standards for membership.",
        keywords: ["prospect", "new firm", "pass", "fail", "applicant"],
        category: "grading"
      }
    ]
  },
  {
    id: "workflow",
    name: "Workflow & Status",
    icon: "mdi:workflow",
    faqs: [
      {
        id: "review-status",
        question: "What do the different review statuses mean?",
        answer: "Review statuses track progress: Pending (awaiting assignment), Assigned (reviewer assigned), In Progress (actively being reviewed), Submitted (awaiting verification), Under Verification (Technical Director review), Pending Final (awaiting CEO approval), Completed (approved and finalized).",
        keywords: ["status", "pending", "progress", "completed", "workflow"],
        category: "workflow"
      },
      {
        id: "acceptance",
        question: "What is the acceptance phase?",
        answer: "When a review is assigned, the reviewer can accept or reject it. Acceptance confirms the reviewer's availability and commitment. Rejection allows reassignment to another qualified reviewer.",
        keywords: ["accept", "reject", "acceptance", "assignment"],
        category: "workflow"
      },
      {
        id: "verification",
        question: "What is the verification process?",
        answer: "After a reviewer submits their assessment, a Technical Director verifies the work for quality and accuracy. They review the findings, validate the grade, and either approve or request revisions.",
        keywords: ["verification", "verify", "technical director", "td", "validate"],
        category: "workflow"
      }
    ]
  },
  {
    id: "roles",
    name: "Roles & Permissions",
    icon: "mdi:account-group",
    faqs: [
      {
        id: "reviewer-role",
        question: "What is a Reviewer's role?",
        answer: "Reviewers conduct the actual QA assessment of member firms. They review documentation, evaluate compliance, conduct interviews if needed, and assign an initial grade based on their findings.",
        keywords: ["reviewer", "role", "responsibilities", "what does"],
        category: "roles"
      },
      {
        id: "td-role",
        question: "What is a Technical Director's role?",
        answer: "Technical Directors verify the quality of reviews submitted by reviewers. They ensure consistency in grading, validate findings, and provide technical oversight before reviews proceed to final approval.",
        keywords: ["technical director", "td", "role", "verification"],
        category: "roles"
      },
      {
        id: "admin-role",
        question: "What can Admins do?",
        answer: "Admins have comprehensive access to manage all aspects of the system: assign reviewers, manage member firms, oversee workflows, access all reviews, generate reports, and perform any action on behalf of other users for administrative purposes.",
        keywords: ["admin", "administrator", "permissions", "access", "omnipotent"],
        category: "roles"
      }
    ]
  },
  {
    id: "technical",
    name: "Technical Support",
    icon: "mdi:help-circle",
    faqs: [
      {
        id: "upload-documents",
        question: "How do I upload documents?",
        answer: "Click the 'Upload' button in the Attachments section, select your files (PDF, Word, Excel supported), and they will be uploaded and attached to the review. You can upload multiple files at once.",
        keywords: ["upload", "attach", "documents", "files", "how to"],
        category: "technical"
      },
      {
        id: "filter-reviews",
        question: "How do I filter reviews?",
        answer: "Use the filter bar at the top of the reviews list. You can filter by status, grade, priority, country, and more. Combine multiple filters to narrow down results. Click 'Clear Filters' to reset.",
        keywords: ["filter", "search", "find", "sort"],
        category: "technical"
      },
      {
        id: "change-view",
        question: "How do I change between list and card view?",
        answer: "Click the view toggle buttons (list/grid icons) in the top right of any list view. Your preference is saved and will persist across sessions.",
        keywords: ["view", "list", "card", "grid", "toggle", "switch"],
        category: "technical"
      }
    ]
  }
]

export const allFAQs = faqCategories.flatMap(cat => cat.faqs)

/**
 * Search FAQs by keyword
 */
export function searchFAQs(query: string): FAQ[] {
  if (!query || query.trim().length < 2) return []
  
  const searchTerm = query.toLowerCase().trim()
  
  return allFAQs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm) ||
    faq.answer.toLowerCase().includes(searchTerm) ||
    faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
  ).slice(0, 5) // Return max 5 results
}

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(categoryId: string): FAQ[] {
  const category = faqCategories.find(cat => cat.id === categoryId)
  return category?.faqs || []
}

