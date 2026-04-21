import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE = 'keystatic-auth'
const LOGIN_PATH  = '/keystatic-login'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page and admin-auth API through unconditionally
  if (pathname === LOGIN_PATH || pathname.startsWith('/api/admin-auth')) {
    return NextResponse.next()
  }

  // Password-gate the Keystatic UI and its API
  if (pathname.startsWith('/keystatic') || pathname.startsWith('/api/keystatic')) {
    const cookie = request.cookies.get(AUTH_COOKIE)
    const password = process.env.KEYSTATIC_PASSWORD
    if (!password || cookie?.value !== password) {
      if (pathname.startsWith('/api/keystatic')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const url = new URL(LOGIN_PATH, request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Forward pathname header for SEO lookups on all other routes
  const res = NextResponse.next()
  res.headers.set('x-pathname', pathname)
  return res
}

export const config = {
  matcher: [
    '/keystatic/:path*',
    '/api/keystatic/:path*',
    // Run on all page routes to forward x-pathname header
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|css|js)).*)',
  ],
}
