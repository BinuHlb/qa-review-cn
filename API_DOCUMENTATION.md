# API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

---

## Authentication

All API endpoints require authentication via NextAuth session.

```typescript
// Headers
{
  "Content-Type": "application/json",
  "Cookie": "next-auth.session-token=..."
}
```

---

## Endpoints

### Reviews

#### GET /api/reviews
Fetch all reviews

**Response:**
```json
[
  {
    "id": "REV-001",
    "memberFirm": "Deloitte & Associates",
    "type": "Annual Review",
    "reviewer": "John Smith",
    "reviewerId": "reviewer-1",
    "country": "United States",
    "reviewerStatus": "Active",
    "partnerStatus": "Active",
    "startDate": "2024-01-15",
    "endDate": "2024-03-15",
    "currentGrade": "A",
    "status": "In Progress",
    "description": "Comprehensive annual quality assurance review",
    "priority": "High",
    "lastUpdated": "2024-01-20"
  }
]
```

#### GET /api/reviews/:id
Fetch a single review

**Response:**
```json
{
  "id": "REV-001",
  "memberFirm": "Deloitte & Associates",
  ...
}
```

#### POST /api/reviews
Create a new review

**Request Body:**
```json
{
  "memberFirm": "New Firm",
  "type": "Annual Review",
  "reviewer": "John Doe",
  "country": "United States",
  "reviewerStatus": "Active",
  "partnerStatus": "Active",
  "startDate": "2024-01-15",
  "endDate": "2024-03-15",
  "currentGrade": "A",
  "status": "Pending",
  "priority": "High"
}
```

#### PUT /api/reviews/:id
Update a review

**Request Body:**
```json
{
  "status": "Completed",
  "currentGrade": "A+"
}
```

#### DELETE /api/reviews/:id
Delete a review

**Response:**
```json
{
  "success": true
}
```

#### POST /api/reviews/:id/assign
Assign a reviewer to a review

**Request Body:**
```json
{
  "reviewerId": "reviewer-1",
  "priority": "High",
  "notes": "Urgent review required"
}
```

#### POST /api/reviews/:id/submit
Submit a review

**Response:**
```json
{
  "id": "REV-001",
  "status": "Completed",
  ...
}
```

---

### Comments

#### GET /api/comments?reviewId=xxx
Fetch comments for a review

**Query Parameters:**
- `reviewId` (required): Review ID

**Response:**
```json
[
  {
    "id": "comment-1",
    "reviewId": "REV-001",
    "author": "John Smith",
    "authorId": "user-1",
    "content": "Review looks good",
    "timestamp": "2024-01-15T10:30:00Z"
  }
]
```

#### POST /api/comments
Create a new comment

**Request Body:**
```json
{
  "reviewId": "REV-001",
  "author": "John Smith",
  "authorId": "user-1",
  "content": "Great progress on this review"
}
```

#### DELETE /api/comments/:id
Delete a comment

---

### Attachments

#### GET /api/attachments?reviewId=xxx
Fetch attachments for a review

**Query Parameters:**
- `reviewId` (required): Review ID

**Response:**
```json
[
  {
    "id": "attachment-1",
    "reviewId": "REV-001",
    "name": "report.pdf",
    "size": 2457600,
    "type": "application/pdf",
    "url": "https://storage/files/report.pdf",
    "uploadedBy": "John Smith",
    "uploadedById": "user-1",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### POST /api/attachments
Upload a file

**Request:**
- Content-Type: `multipart/form-data`
- Form Fields:
  - `file`: File to upload
  - `reviewId`: Review ID

**Response:**
```json
{
  "id": "attachment-1",
  "reviewId": "REV-001",
  "name": "report.pdf",
  "size": 2457600,
  "url": "https://storage/files/report.pdf",
  ...
}
```

#### DELETE /api/attachments/:id
Delete an attachment

#### GET /api/attachments/:id/download
Download an attachment

**Response:**
Binary file data with appropriate headers

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Error message",
  "details": {} // Optional validation errors
}
```

### HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Authenticated**: 1000 requests per 15 minutes
- **File Upload**: 20 uploads per hour

---

## Webhooks (Future)

For real-time notifications:

```typescript
POST /api/webhooks/review-submitted
POST /api/webhooks/reviewer-assigned
POST /api/webhooks/comment-added
```

---

## Data Export

```typescript
GET /api/reviews/export?format=csv
GET /api/reviews/export?format=xlsx
GET /api/reviews/export?format=pdf
```

---

## Usage Examples

### JavaScript/TypeScript:

```typescript
// Fetch all reviews
const response = await fetch('/api/reviews')
const reviews = await response.json()

// Create a review
const response = await fetch('/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(reviewData)
})

// Upload file
const formData = new FormData()
formData.append('file', file)
formData.append('reviewId', 'REV-001')

const response = await fetch('/api/attachments', {
  method: 'POST',
  body: formData
})
```

### cURL:

```bash
# Fetch reviews
curl http://localhost:3000/api/reviews

# Create review
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"memberFirm":"Test Firm",...}'

# Upload file
curl -X POST http://localhost:3000/api/attachments \
  -F "file=@document.pdf" \
  -F "reviewId=REV-001"
```

---

## Versioning

Current API Version: `v1`

Future versions will be available at `/api/v2/...`

