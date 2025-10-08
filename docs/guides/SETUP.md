# Authentication Setup Guide

This application now includes SSO authentication with Google and GitHub providers. Follow these steps to set up the authentication:

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## OAuth Provider Setup

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an "OAuth 2.0 Client ID"
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Set the Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local` file

## Generate NextAuth Secret

Run the following command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use any secure random string generator.

## Features Implemented

- ✅ Login page with Google and GitHub SSO
- ✅ Authentication middleware for route protection
- ✅ Dashboard with user profile and sign-out
- ✅ Responsive design following ShadCN standards
- ✅ TypeScript support
- ✅ Session management with NextAuth.js
- ✅ Automatic redirects based on authentication state

## File Structure

```
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth API routes
│   ├── login/page.tsx                   # Login page
│   ├── dashboard/page.tsx               # Protected dashboard
│   └── layout.tsx                       # Root layout with auth provider
├── components/
│   ├── providers/session-provider.tsx   # Session provider wrapper
│   ├── dashboard-header.tsx             # Dashboard header with user menu
│   └── ui/card.tsx                      # Card component
├── lib/
│   ├── auth.ts                          # NextAuth configuration
│   └── env.ts                           # Environment variables validation
└── middleware.ts                        # Authentication middleware
```

## Usage

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. You'll be redirected to the login page
4. Sign in with Google or GitHub
5. You'll be redirected to the dashboard
6. Use the user menu in the top-right to sign out

The application automatically handles:
- Redirecting unauthenticated users to login
- Redirecting authenticated users away from login page
- Protecting dashboard routes
- Session management across page refreshes
