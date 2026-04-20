import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/keystatic', '/api/keystatic']
const AUTH_COOKIE = 'keystatic-auth'
const LOGIN_PATH = '/keystatic-login'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const password = process.env.KEYSTATIC_PASSWORD
  const cookie = request.cookies.get(AUTH_COOKIE)
  const isAuthenticated = password && cookie?.value === password

  if (!isAuthenticated) {
    // API routes return JSON 401 so the Keystatic client can handle it gracefully
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
  matcher: ['/keystatic/:path*', '/api/keystatic/:path*'],
}
