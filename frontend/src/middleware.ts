import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Forward pathname so server components can look up per-page SEO data
  // Keystatic routes are excluded — GitHub OAuth handles their own auth
  if (pathname.startsWith('/keystatic') || pathname.startsWith('/api/keystatic')) {
    return NextResponse.next()
  }

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
