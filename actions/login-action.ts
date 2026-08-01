"use server"

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, getAdminSessionMaxAge, getSafeAdminRedirect } from '@/src/auth'
import { clearFailedLoginAttempts, getLoginRateLimitState, registerFailedLoginAttempt } from '@/src/admin-login-rate-limit'
import { validateAdminLogin } from '@/src/admin-profile'

export type LoginState = {
  error: string
}

async function createAdminSession(email: string) {
  const cookieStore = await cookies()
  const sessionToken = await createAdminSessionToken(email)

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: getAdminSessionMaxAge(),
  })
}

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const redirectTo = getSafeAdminRedirect(String(formData.get('redirectTo') ?? '/admin/orders'))

  const rateLimitState = getLoginRateLimitState(email)

  if (rateLimitState.blocked) {
    redirect(`/login?error=blocked&retryAfter=${rateLimitState.retryAfterSeconds}&redirectTo=${encodeURIComponent(redirectTo)}`)
  }

  if (!(await validateAdminLogin(email, password))) {
    registerFailedLoginAttempt(email)
    redirect(`/login?error=1&redirectTo=${encodeURIComponent(redirectTo)}`)
  }

  clearFailedLoginAttempts(email)
  await createAdminSession(email)

  redirect(redirectTo)
}

export async function loginFromOrderModal(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const redirectTo = getSafeAdminRedirect(String(formData.get('redirectTo') ?? '/admin/orders'))

  const rateLimitState = getLoginRateLimitState(email)

  if (rateLimitState.blocked) {
    return {
      error: `Demasiados intentos. Vuelve a intentarlo en ${rateLimitState.retryAfterSeconds} segundos.`,
    }
  }

  if (!(await validateAdminLogin(email, password))) {
    registerFailedLoginAttempt(email)
    return {
      error: 'Credenciales incorrectas. Revisa el correo y la clave del administrador.',
    }
  }

  clearFailedLoginAttempts(email)
  await createAdminSession(email)

  redirect(redirectTo)
}
