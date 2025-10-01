# Production Deployment Guide

## 🚀 Complete Production Setup Guide

This guide will help you deploy the QA Review Application to production with full functionality.

---

## 📋 Prerequisites

- Node.js 18+ installed
- Database (PostgreSQL recommended)
- File storage service (AWS S3, Cloudinary, or equivalent)
- SSO provider credentials (Azure AD, Google, etc.)
- Domain name and SSL certificate

---

## 🛠️ Step-by-Step Setup

### 1. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your actual credentials
nano .env.local
```

**Required Environment Variables:**
- `DATABASE_URL` - Your database connection string
- `NEXTAUTH_URL` - Your application URL
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- SSO credentials (Azure AD, Google, etc.)
- File storage credentials (AWS S3 or Cloudinary)

### 2. Database Setup

**Option A: Using Prisma (Recommended)**

```bash
# Install Prisma
npm install @prisma/client
npm install -D prisma

# Initialize Prisma
npx prisma init

# Create schema (see DATABASE_SCHEMA.md)
# Edit prisma/schema.prisma

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed
```

**Option B: Using raw SQL**

```bash
# Run the SQL scripts from DATABASE_SCHEMA.md
psql $DATABASE_URL < schema.sql
psql $DATABASE_URL < seed.sql
```

### 3. File Storage Setup

**Option A: AWS S3**

```bash
# Install AWS SDK
npm install @aws-sdk/client-s3

# Create S3 bucket
aws s3 mb s3://qa-review-attachments

# Set bucket policy for file access
```

**Option B: Cloudinary**

```bash
# Install Cloudinary
npm install cloudinary

# Configure in lib/storage/cloudinary.ts
```

**Option C: Local Storage (Development only)**

```bash
# Create uploads directory
mkdir -p public/uploads
```

### 4. Update API Routes

Replace mock data with actual database calls in:

```
app/api/reviews/route.ts
app/api/reviews/[id]/route.ts
app/api/reviews/[id]/assign/route.ts
app/api/reviews/[id]/submit/route.ts
app/api/comments/route.ts
app/api/attachments/route.ts
```

### 5. Install Dependencies

```bash
# Install all dependencies
npm install

# Install additional production dependencies
npm install @prisma/client zod react-hook-form
```

### 6. Build and Test

```bash
# Run lint
npm run lint

# Run type check
npx tsc --noEmit

# Build for production
npm run build

# Test production build locally
npm run start

# Access at http://localhost:3000
```

### 7. Deploy to Production

**Option A: Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

**Option B: Docker**

```dockerfile
# Create Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t qa-review-app .
docker run -p 3000:3000 --env-file .env.local qa-review-app
```

**Option C: Traditional Server**

```bash
# Build on server
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "qa-review" -- start
pm2 save
pm2 startup
```

---

## 🔐 Security Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Validate all file uploads
- [ ] Sanitize user input
- [ ] Use environment variables for secrets
- [ ] Enable database connection pooling
- [ ] Set up database backups
- [ ] Configure CSP headers
- [ ] Enable security headers (helmet)
- [ ] Set up monitoring and logging

---

## 📊 Monitoring and Logging

### Recommended Tools:

1. **Application Monitoring**: Sentry, DataDog, or New Relic
2. **Logging**: Winston, Pino, or CloudWatch
3. **Analytics**: Google Analytics, Mixpanel
4. **Error Tracking**: Sentry
5. **Performance**: Lighthouse, Web Vitals

### Setup Sentry (Example):

```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

---

## 🔄 Database Migration Strategy

### For Zero-Downtime Deployments:

1. **Create migration** (backward compatible)
2. **Deploy application** (supports old and new schema)
3. **Run migration**
4. **Deploy again** (remove old schema support)

### Using Prisma:

```bash
# Create migration
npx prisma migrate dev --name add_new_field

# Apply to production
npx prisma migrate deploy
```

---

## 📈 Performance Optimization

### Implemented Optimizations:

✅ React memoization (useMemo, useCallback)
✅ Code splitting with dynamic imports
✅ Image optimization with Next.js Image
✅ Static page generation where possible
✅ API response caching
✅ Database query optimization with indexes

### Additional Recommendations:

- [ ] Enable Redis for caching
- [ ] Use CDN for static assets
- [ ] Implement database query caching
- [ ] Add service worker for offline support
- [ ] Optimize bundle size with tree shaking
- [ ] Use compression middleware

---

## 🧪 Testing Strategy

### Unit Tests:

```bash
# Install testing libraries
npm install -D jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### Integration Tests:

```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

### API Tests:

```bash
# Install Supertest
npm install -D supertest

# Test API endpoints
npm run test:api
```

---

## 📱 Mobile Responsiveness

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Test on:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)

---

## 🚦 Deployment Checklist

### Pre-Deployment:

- [ ] All tests passing
- [ ] Build succeeds with no errors
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] File storage configured
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Backup strategy in place

### Post-Deployment:

- [ ] Verify all pages load
- [ ] Test user authentication
- [ ] Test CRUD operations
- [ ] Test file uploads
- [ ] Test comments system
- [ ] Check error monitoring
- [ ] Verify email notifications (if enabled)
- [ ] Test on multiple devices
- [ ] Load testing completed
- [ ] Security audit passed

---

## 🔧 Troubleshooting

### Common Issues:

**Build Fails:**
- Check TypeScript errors: `npx tsc --noEmit`
- Clear cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Database Connection:**
- Verify DATABASE_URL format
- Check firewall rules
- Verify database credentials
- Test connection: `npx prisma db pull`

**File Upload Issues:**
- Check file size limits
- Verify storage credentials
- Check CORS configuration
- Verify bucket permissions

**Authentication Issues:**
- Verify NEXTAUTH_SECRET is set
- Check SSO credentials
- Verify callback URLs
- Check session configuration

---

## 📞 Support and Maintenance

### Regular Maintenance Tasks:

- **Daily**: Monitor error logs and performance metrics
- **Weekly**: Review database performance, check disk space
- **Monthly**: Security updates, dependency updates
- **Quarterly**: Performance audit, security audit

### Dependency Updates:

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update Next.js
npm install next@latest

# Test after updates
npm run build && npm test
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Vercel Deployment](https://vercel.com/docs)
- [Database Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

## 🎯 Success Metrics

Track these KPIs in production:

- Response time (< 200ms average)
- Error rate (< 1%)
- Uptime (> 99.9%)
- User satisfaction
- Review completion rate
- System utilization

---

## 🔐 Backup Strategy

### Database Backups:

```bash
# Daily automated backups
0 2 * * * pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Keep last 30 days
find /backups -name "backup_*.sql" -mtime +30 -delete
```

### File Backups:

- Configure S3 versioning
- Set up cross-region replication
- Regular backup verification

---

## ✅ Production Ready

Once all steps are complete, your QA Review Application will be:

✅ Fully functional with database
✅ Scalable to thousands of users
✅ Secure and production-hardened
✅ Monitored and logged
✅ Backed up and disaster-recovery ready
✅ Optimized for performance
✅ Mobile-responsive
✅ Tested and verified

