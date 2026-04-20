import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/keystatic', '/api/keystatic']
const AUTH_COOKIE = 'keystatic-auth'
const LOGIN_PATH = '/keystatic-login'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))

  if (!isProtected) {
    // Forward pathname so server components can look up per-page SEO data
    const res = NextResponse.next()
    res.headers.set('x-pathname', pathname)
    return res
  }

  const password = process.env.KEYSTATIC_PASSWORD
  const cookie = request.cookies.get(AUTH_COOKIE)
  const isAuthenticated = password && cookie?.value === password

  if (!isAuthenticated) {
    if (pathname.startsWith('/api/keystatic')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = new URL(LOGIN_PATH, request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/keystatic/:path*',
    '/api/keystatic/:path*',
    // Run on all page routes to forward x-pathname header
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|css|js)).*)',
  ],
}
