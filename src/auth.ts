export const ADMIN_SESSION_COOKIE = 'fresh-coffee-admin-session'
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 8

function isProduction() {
  return process.env.NODE_ENV === 'production'
}

type AdminSessionPayload = {
  email: string
  exp: number
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4 || 4)) % 4)
  const binary = atob(paddedBase64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ??
      (isProduction() ? '' : 'fresh-coffee-dev-admin-session')
}

function encodeSessionPayload(payload: AdminSessionPayload) {
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)))
}

function decodeSessionPayload(value: string) {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlToBytes(value))) as AdminSessionPayload
  } catch {
    return null
  }
}

async function signSessionPayload(value: string) {
  const secret = getAdminSessionSecret()

  if (!secret) {
    return ''
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))

  return bytesToBase64Url(new Uint8Array(signature))
}

export async function createAdminSessionToken(email: string) {
  const payload: AdminSessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_DURATION_SECONDS,
  }
  const encodedPayload = encodeSessionPayload(payload)
  const signature = await signSessionPayload(encodedPayload)

  return `${encodedPayload}.${signature}`
}

export async function verifyAdminSessionToken(sessionValue?: string) {
  if (!sessionValue) {
    return false
  }

  const [encodedPayload, signature] = sessionValue.split('.')

  if (!encodedPayload || !signature) {
    return false
  }

  const expectedSignature = await signSessionPayload(encodedPayload)

  if (!expectedSignature || expectedSignature !== signature) {
    return false
  }

  const payload = decodeSessionPayload(encodedPayload)

  if (!payload) {
    return false
  }

  return payload.exp > Math.floor(Date.now() / 1000)
}

export function getAdminSessionMaxAge() {
  return ADMIN_SESSION_DURATION_SECONDS
}

export function getSafeAdminRedirect(value: string | null | undefined) {
  if (!value || !value.startsWith('/admin') || value.startsWith('//')) {
    return '/admin/orders'
  }

  return value
}

export function getSafeInternalRedirect(value: string | null | undefined, fallback: string) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback
  }

  return value
}
