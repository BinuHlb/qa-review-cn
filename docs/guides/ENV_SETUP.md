# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/qa_review_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-min-32-chars"

# SSO Configuration (Azure AD, Google, etc.)
AZURE_AD_CLIENT_ID="your-azure-client-id"
AZURE_AD_CLIENT_SECRET="your-azure-client-secret"
AZURE_AD_TENANT_ID="your-azure-tenant-id"

# File Storage Configuration
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="qa-review-attachments"

# Application Configuration
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Optional: Email, Rate Limiting, etc.
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
MAX_FILE_SIZE="10485760"
ALLOWED_FILE_TYPES="pdf,xlsx,xls,docx,doc,png,jpg,jpeg"
```

## Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

