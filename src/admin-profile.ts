import { scryptSync, timingSafeEqual } from 'node:crypto'
import { AdminAvatarPreset } from '@prisma/client'
import { prisma } from '@/src/lib/prisma'

function isProduction() {
  return process.env.NODE_ENV === 'production'
}

export function getBootstrapAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL ?? (isProduction() ? '' : 'admin@freshcoffee.cl'),
    password: process.env.ADMIN_PASSWORD ?? (isProduction() ? '' : 'Admin1234!'),
  }
}

export function hashAdminPassword(password: string) {
  return scryptSync(password, 'fresh-coffee-admin', 64).toString('hex')
}

export function verifyAdminPassword(password: string, passwordHash: string) {
  const incomingHash = Buffer.from(hashAdminPassword(password), 'hex')
  const storedHash = Buffer.from(passwordHash, 'hex')

  return incomingHash.length === storedHash.length && timingSafeEqual(incomingHash, storedHash)
}

export async function ensureAdminProfile() {
  const existingProfile = await prisma.adminProfile.findFirst({
    orderBy: { id: 'asc' },
  })

  if (existingProfile) {
    return existingProfile
  }

  const bootstrapCredentials = getBootstrapAdminCredentials()

  if (!bootstrapCredentials.email || !bootstrapCredentials.password) {
    return null
  }

  return prisma.adminProfile.create({
    data: {
      email: bootstrapCredentials.email,
      passwordHash: hashAdminPassword(bootstrapCredentials.password),
      avatarPreset: 'BEAR',
    },
  })
}

export async function getAdminProfile() {
  return ensureAdminProfile()
}

export async function validateAdminLogin(email: string, password: string) {
  const profile = await ensureAdminProfile()

  if (!profile) {
    return false
  }

  return profile.email === email && verifyAdminPassword(password, profile.passwordHash)
}

export async function updateAdminPassword(currentPassword: string, nextPassword: string) {
  const profile = await ensureAdminProfile()

  if (!profile) {
    return { ok: false, message: 'No se pudo cargar el perfil del administrador.' }
  }

  if (!verifyAdminPassword(currentPassword, profile.passwordHash)) {
    return { ok: false, message: 'La contraseña actual no es correcta.' }
  }

  await prisma.adminProfile.update({
    where: { id: profile.id },
    data: { passwordHash: hashAdminPassword(nextPassword) },
  })

  return { ok: true }
}

export async function updateAdminAvatar(input: { avatarPreset: AdminAvatarPreset; avatarImage?: string }) {
  const profile = await ensureAdminProfile()

  if (!profile) {
    return { ok: false, message: 'No se pudo cargar el perfil del administrador.' }
  }

  await prisma.adminProfile.update({
    where: { id: profile.id },
    data: {
      avatarPreset: input.avatarPreset,
      avatarImage: input.avatarImage?.trim() ? input.avatarImage : null,
    },
  })

  return { ok: true }
}
