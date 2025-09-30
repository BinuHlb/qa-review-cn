import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req: NextRequest & { auth: any }) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Define protected routes
  const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard')
  
  // Define public routes
  const isPublicRoute = nextUrl.pathname === '/' || 
                       nextUrl.pathname === '/login' ||
                       nextUrl.pathname.startsWith('/api/auth')

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // Redirect to dashboard if accessing login page while authenticated
  if (nextUrl.pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  // Redirect to dashboard if accessing home page while authenticated
  if (nextUrl.pathname === '/' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
  runtime: 'nodejs',
}
