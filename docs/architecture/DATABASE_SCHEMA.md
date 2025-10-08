# Database Schema for QA Review Application

## Overview
This document outlines the database schema for the production-ready QA review application. The schema is designed to be database-agnostic and can be implemented with PostgreSQL, MySQL, MongoDB, or any other database.

## Tables/Collections

### 1. Reviews
```sql
CREATE TABLE reviews (
  id VARCHAR(255) PRIMARY KEY,
  member_firm VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  reviewer VARCHAR(255),
  reviewer_id VARCHAR(255),
  country VARCHAR(100) NOT NULL,
  reviewer_status ENUM('Active', 'Inactive', 'Pending') NOT NULL,
  partner_status ENUM('Active', 'Inactive', 'Pending') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  current_grade ENUM('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F') NOT NULL,
  status ENUM('Completed', 'In Progress', 'Pending', 'Overdue', 'Cancelled') NOT NULL,
  description TEXT,
  priority ENUM('High', 'Medium', 'Low') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  FOREIGN KEY (reviewer_id) REFERENCES reviewers(id)
);
```

### 2. Reviewers
```sql
CREATE TABLE reviewers (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('reviewer', 'senior_reviewer', 'lead_reviewer', 'partner') NOT NULL,
  status ENUM('active', 'inactive', 'on_leave') NOT NULL,
  location VARCHAR(255),
  phone VARCHAR(50),
  experience INT,
  current_workload INT DEFAULT 0,
  max_workload INT DEFAULT 10,
  join_date DATE,
  last_active TIMESTAMP,
  total_reviews INT DEFAULT 0,
  average_rating DECIMAL(3,2),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. Comments
```sql
CREATE TABLE comments (
  id VARCHAR(255) PRIMARY KEY,
  review_id VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  author_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 4. Attachments
```sql
CREATE TABLE attachments (
  id VARCHAR(255) PRIMARY KEY,
  review_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  size BIGINT NOT NULL,
  type VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  uploaded_by VARCHAR(255) NOT NULL,
  uploaded_by_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by_id) REFERENCES users(id)
);
```

### 5. Member Firms
```sql
CREATE TABLE member_firms (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  status ENUM('Active', 'Inactive', 'Pending') NOT NULL,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 6. Users (for authentication)
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('admin', 'ceo', 'director', 'firm', 'reviewer') NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

## Indexes

```sql
-- Reviews indexes
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_country ON reviews(country);
CREATE INDEX idx_reviews_priority ON reviews(priority);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Comments indexes
CREATE INDEX idx_comments_review_id ON comments(review_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Attachments indexes
CREATE INDEX idx_attachments_review_id ON attachments(review_id);
CREATE INDEX idx_attachments_created_at ON attachments(created_at);

-- Reviewers indexes
CREATE INDEX idx_reviewers_status ON reviewers(status);
CREATE INDEX idx_reviewers_role ON reviewers(role);
CREATE INDEX idx_reviewers_email ON reviewers(email);
```

## Relationships

- **Reviews → Reviewers**: Many-to-One (reviewer_id)
- **Reviews → Comments**: One-to-Many (review_id)
- **Reviews → Attachments**: One-to-Many (review_id)
- **Users → Comments**: One-to-Many (author_id)
- **Users → Attachments**: One-to-Many (uploaded_by_id)

## Migration Steps

1. **Set up database** (PostgreSQL recommended)
2. **Run migrations** to create tables
3. **Seed initial data** (member firms, reviewers, admin users)
4. **Update API routes** to use database instead of mock data
5. **Test all CRUD operations**
6. **Set up file storage** (AWS S3, Cloudinary, or local storage)

## ORMs Supported

This schema can be implemented with:
- **Prisma** (recommended for TypeScript)
- **Drizzle ORM**
- **TypeORM**
- **Sequelize**
- Raw SQL queries

## Example Prisma Schema

```prisma
model Review {
  id              String   @id @default(cuid())
  memberFirm      String
  type            String
  reviewer        String?
  reviewerId      String?
  country         String
  reviewerStatus  String
  partnerStatus   String
  startDate       DateTime
  endDate         DateTime
  currentGrade    String
  status          String
  description     String?
  priority        String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  createdBy       String?
  
  comments        Comment[]
  attachments     Attachment[]
  reviewerRef     Reviewer? @relation(fields: [reviewerId], references: [id])
}

model Comment {
  id        String   @id @default(cuid())
  reviewId  String
  author    String
  authorId  String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
}

model Attachment {
  id            String   @id @default(cuid())
  reviewId      String
  name          String
  size          Int
  type          String
  url           String
  uploadedBy    String
  uploadedById  String
  createdAt     DateTime @default(now())
  
  review        Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
}
```

## Data Validation

All API endpoints use Zod schemas for validation (see `/lib/schemas/review.schema.ts`)

## Security Considerations

1. **Authentication**: Verify user session before any operation
2. **Authorization**: Check user role/permissions
3. **File Upload**: Validate file types and sizes
4. **SQL Injection**: Use parameterized queries
5. **XSS Prevention**: Sanitize user input
6. **Rate Limiting**: Implement rate limits on API routes

