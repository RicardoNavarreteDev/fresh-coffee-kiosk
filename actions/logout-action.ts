"use server"

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, getSafeInternalRedirect } from '@/src/auth'

export async function logout(formData?: FormData) {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)

  const redirectTo = getSafeInternalRedirect(
    typeof formData?.get === 'function' ? String(formData.get('redirectTo') ?? '/login') : '/login',
    '/login'
  )

  redirect(redirectTo)
}
