type LoginAttemptState = {
  failures: number
  blockedUntil: number
}

const loginAttempts = new Map<string, LoginAttemptState>()
const MAX_FAILURES = 5
const BLOCK_DURATION_MS = 10 * 60 * 1000

function getLoginAttemptKey(email: string) {
  return email.trim().toLowerCase() || 'anonymous'
}

export function getLoginRateLimitState(email: string) {
  const key = getLoginAttemptKey(email)
  const currentState = loginAttempts.get(key)

  if (!currentState) {
    return { blocked: false, retryAfterSeconds: 0 }
  }

  const now = Date.now()

  if (currentState.blockedUntil > now) {
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil((currentState.blockedUntil - now) / 1000),
    }
  }

  if (currentState.blockedUntil > 0) {
    loginAttempts.delete(key)
  }

  return { blocked: false, retryAfterSeconds: 0 }
}

export function registerFailedLoginAttempt(email: string) {
  const key = getLoginAttemptKey(email)
  const currentState = loginAttempts.get(key) ?? { failures: 0, blockedUntil: 0 }
  const failures = currentState.failures + 1

  if (failures >= MAX_FAILURES) {
    loginAttempts.set(key, {
      failures,
      blockedUntil: Date.now() + BLOCK_DURATION_MS,
    })
    return
  }

  loginAttempts.set(key, {
    failures,
    blockedUntil: 0,
  })
}

export function clearFailedLoginAttempts(email: string) {
  loginAttempts.delete(getLoginAttemptKey(email))
}
