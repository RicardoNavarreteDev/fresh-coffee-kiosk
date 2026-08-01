import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE, getSafeAdminRedirect, verifyAdminSessionToken } from '@/src/auth'

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const isAdmin = await verifyAdminSessionToken(session)

  if (pathname.startsWith('/admin') && !isAdmin) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)

    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/login' && isAdmin) {
    const redirectTo = getSafeAdminRedirect(searchParams.get('redirectTo'))
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
