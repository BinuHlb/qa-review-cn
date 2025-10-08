import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { env } from "@/lib/env"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Development credentials provider
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For development only - accept any credentials
        if (credentials?.email && credentials?.password) {
          // Determine role based on email for development
          let role = "admin" // default role
          const email = credentials.email as string
          if (email.includes("ceo")) role = "ceo"
          else if (email.includes("director")) role = "technical_director"
          else if (email.includes("member")) role = "member_firm"
          else if (email.includes("reviewer")) role = "reviewer"
          
          return {
            id: "1",
            email: credentials.email as string,
            name: "Development User",
            role: role,
          }
        }
        return null
      }
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (token.role) {
        session.user.role = token.role as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
})
