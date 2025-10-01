# Application Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│  Pages/Routes           │  Components        │  Hooks        │
│  ─────────────         │  ──────────        │  ─────        │
│  /admin/reviews        │  ReviewView        │  useReviews   │
│  /admin/reviewers      │  ReviewItem        │  useComments  │
│  /admin/member-firms   │  ActionPanel       │  useAttachments│
│                        │  FilterSection      │  useToast     │
├─────────────────────────────────────────────────────────────┤
│                      API Layer (Next.js API Routes)          │
├─────────────────────────────────────────────────────────────┤
│  /api/reviews         │  /api/comments      │  /api/attach. │
│  - GET /              │  - GET /?reviewId   │  - GET /      │
│  - POST /             │  - POST /           │  - POST /     │
│  - GET /:id           │  - DELETE /:id      │  - DELETE /:id│
│  - PUT /:id           │                     │  - GET /:id/  │
│  - DELETE /:id        │                     │    download   │
│  - POST /:id/assign   │                     │               │
│  - POST /:id/submit   │                     │               │
├─────────────────────────────────────────────────────────────┤
│                       Data Layer (Future)                    │
├─────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL)  │  File Storage (S3)  │  Cache       │
│  - Reviews             │  - Attachments      │  (Redis)      │
│  - Comments            │  - Documents        │               │
│  - Attachments Meta    │                     │               │
│  - Users               │                     │               │
│  - Reviewers           │                     │               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
qa-review-cn/
├── app/                          # Next.js App Router
│   ├── admin/                   # Admin pages
│   │   ├── reviews/            # Reviews management
│   │   │   ├── page.tsx        # Main reviews page
│   │   │   ├── constants.ts    # Page constants
│   │   │   └── utils.ts        # Utility functions
│   │   ├── reviewers/          # Reviewers management
│   │   └── member-firms/       # Member firms management
│   ├── api/                     # API Routes
│   │   ├── reviews/            # Reviews API
│   │   │   ├── route.ts        # GET, POST
│   │   │   └── [id]/
│   │   │       ├── route.ts    # GET, PUT, DELETE
│   │   │       ├── assign/     # POST assign reviewer
│   │   │       └── submit/     # POST submit review
│   │   ├── comments/           # Comments API
│   │   │   ├── route.ts        # GET, POST
│   │   │   └── [id]/route.ts   # DELETE
│   │   └── attachments/        # Attachments API
│   │       ├── route.ts        # GET, POST
│   │       └── [id]/
│   │           ├── route.ts    # DELETE
│   │           └── download/   # GET download
│   └── layout.tsx              # Root layout
├── components/                  # React components
│   ├── reviews/                # Review-specific components
│   │   ├── review-view.tsx     # Main review list view
│   │   ├── review-item.tsx     # Individual review card
│   │   ├── review-action-panel.tsx  # Action sidebar
│   │   └── review-assign-form.tsx   # Assignment form
│   ├── shared/                 # Shared components
│   │   ├── filter-section.tsx  # Filter UI
│   │   ├── page-layout.tsx     # Layout wrapper
│   │   └── form-*.tsx          # Form components
│   └── ui/                     # shadcn/ui components
├── hooks/                      # Custom React hooks
│   ├── use-reviews.ts         # Reviews data management
│   ├── use-comments.ts        # Comments management
│   ├── use-attachments.ts     # File upload management
│   └── use-toast.ts           # Toast notifications
├── lib/                       # Utilities and configs
│   ├── api/                  # API client classes
│   │   ├── reviews.ts        # ReviewsAPI class
│   │   ├── comments.ts       # CommentsAPI class
│   │   └── attachments.ts    # AttachmentsAPI class
│   ├── schemas/              # Zod validation schemas
│   │   └── review.schema.ts  # Review-related schemas
│   ├── auth.ts               # Authentication config
│   ├── utils.ts              # Utility functions
│   └── mock-data.ts          # Mock data (development)
└── types/                    # TypeScript type definitions
    └── next-auth.d.ts        # NextAuth types

```

---

## 🔄 Data Flow

### Review Selection Flow:
```
User clicks review card
  ↓
handleViewReview called
  ↓
setSelectedReview (toggle logic)
  ↓
Review highlighted with blue background
  ↓
Action panel shows/hides based on selection
  ↓
useComments & useAttachments fetch data for selected review
```

### File Upload Flow:
```
User drops files or clicks upload
  ↓
handleFileUpload / handleDrop
  ↓
useAttachments.uploadFiles()
  ↓
AttachmentsAPI.upload() → POST /api/attachments
  ↓
FormData sent to server
  ↓
Server validates and saves file
  ↓
Returns attachment metadata
  ↓
UI updates with new attachment
  ↓
Toast notification shows success
```

### Comment Flow:
```
User types comment and clicks Post
  ↓
handleAddComment
  ↓
useComments.addComment()
  ↓
CommentsAPI.create() → POST /api/comments
  ↓
Server validates and saves comment
  ↓
Returns comment with ID and timestamp
  ↓
UI updates with new comment
  ↓
Toast notification shows success
```

### Submit Review Flow:
```
User clicks Submit Review
  ↓
handleSubmit
  ↓
useReviews.submitReview()
  ↓
ReviewsAPI.submit() → POST /api/reviews/:id/submit
  ↓
Server updates review status to 'Completed'
  ↓
UI shows success screen
  ↓
Toast notification
  ↓
User can click "Back to Review"
```

---

## 🎯 State Management

### Local Component State:
- UI state (expanded, selected, etc.)
- Form inputs
- Temporary data

### Custom Hooks State:
- Reviews data
- Comments data
- Attachments data
- Loading states
- Error states

### Global State (Future):
- User session (NextAuth)
- App preferences
- Real-time notifications

---

## 🔐 Security Layers

### 1. Frontend Validation:
- Zod schemas
- Form validation
- File type/size checks

### 2. API Validation:
- Schema validation
- Authentication checks
- Authorization checks

### 3. Database Layer:
- Constraints
- Foreign keys
- Triggers

---

## 🚀 Performance Optimizations

### React Optimizations:
- ✅ useMemo for expensive calculations
- ✅ useCallback for event handlers
- ✅ Key props for list rendering
- ✅ Lazy loading with dynamic imports

### Next.js Optimizations:
- ✅ Static page generation where possible
- ✅ Image optimization
- ✅ Code splitting
- ✅ Font optimization

### API Optimizations:
- Cache headers
- Database query optimization
- Connection pooling
- Rate limiting

### Bundle Optimizations:
- Tree shaking
- Minification
- Compression
- CDN for static assets

---

## 📊 Monitoring Points

### Application Metrics:
- Page load time
- API response time
- Error rate
- User actions

### Database Metrics:
- Query performance
- Connection pool usage
- Slow queries
- Database size

### Business Metrics:
- Reviews created/completed
- Average review time
- Reviewer workload
- System usage patterns

---

## 🔄 Scalability Considerations

### Horizontal Scaling:
- Stateless API design
- Session storage in database
- File storage separate from app servers

### Vertical Scaling:
- Database read replicas
- Caching layer (Redis)
- CDN for static content

### Future Enhancements:
- Microservices architecture
- Message queue for background jobs
- Real-time updates with WebSockets
- GraphQL API option

---

## 🛡️ Error Handling Strategy

### Client Side:
```typescript
try {
  await api.call()
} catch (error) {
  toast.error()
  logError()
}
```

### Server Side:
```typescript
try {
  const result = await db.query()
  return NextResponse.json(result)
} catch (error) {
  logger.error(error)
  return NextResponse.json({ error }, { status: 500 })
}
```

### Global Error Boundary:
- Catches unhandled errors
- Shows user-friendly message
- Logs to monitoring service

---

## 🔌 Integration Points

### Current:
- NextAuth for authentication
- File system for uploads (dev)
- In-memory storage (dev)

### Production:
- Database (PostgreSQL)
- File storage (AWS S3)
- Email service (SendGrid)
- Monitoring (Sentry)
- Analytics (Google Analytics)

---

## 📝 Development Workflow

1. **Local Development**:
   ```bash
   npm run dev
   ```

2. **Testing**:
   ```bash
   npm test
   ```

3. **Build**:
   ```bash
   npm run build
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

---

## 🎨 UI Architecture

### Design System:
- **shadcn/ui** components
- **Tailwind CSS** for styling
- **Lucide Icons** for icons
- **Consistent spacing** and colors

### Responsive Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Color Palette:
- Primary: Blue (actions, selection)
- Success: Green (completed, success)
- Warning: Yellow (pending, caution)
- Error: Red (overdue, errors)
- Neutral: Gray (text, backgrounds)

---

## 🧩 Component Patterns

### Smart vs Presentational:
- **Smart**: Pages, containers (handle state and logic)
- **Presentational**: UI components (receive props, display data)

### Composition:
- Small, focused components
- Reusable pieces
- Clear prop interfaces

### Data Fetching:
- Custom hooks for data
- Loading states
- Error boundaries
- Optimistic updates

---

This architecture is designed to be:
- ✅ Scalable
- ✅ Maintainable
- ✅ Testable
- ✅ Secure
- ✅ Performant
- ✅ Production-ready

