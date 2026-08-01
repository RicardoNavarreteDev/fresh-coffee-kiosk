"use server"

import { AdminAvatarPreset } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { updateAdminAvatar, updateAdminPassword } from '@/src/admin-profile'

const avatarPresetValues = new Set<AdminAvatarPreset>(['DOG', 'BEAR', 'CAT', 'FOX', 'KOALA', 'OWL'])

function isValidAvatarImageUrl(value: string) {
  if (!value) {
    return true
  }

  return /^https:\/\/res\.cloudinary\.com\/.+\.(jpg|jpeg|webp)(\?.*)?$/i.test(value)
}

export async function updateAdminAvatarAction(formData: FormData) {
  const avatarPreset = String(formData.get('avatarPreset') ?? 'BEAR') as AdminAvatarPreset
  const avatarImage = String(formData.get('avatarImage') ?? '').trim()

  if (!avatarPresetValues.has(avatarPreset)) {
    return { ok: false, message: 'Selecciona un avatar válido.' }
  }

  if (!isValidAvatarImageUrl(avatarImage)) {
    return { ok: false, message: 'La foto debe ser una imagen Cloudinary en JPG, JPEG o WEBP.' }
  }

  const result = await updateAdminAvatar({ avatarPreset, avatarImage })

  if (result.ok) {
    revalidatePath('/admin/profile')
    revalidatePath('/admin/orders')
    revalidatePath('/admin/products')
  }

  return result
}

export async function updateAdminPasswordAction(formData: FormData) {
  const currentPassword = String(formData.get('currentPassword') ?? '')
  const nextPassword = String(formData.get('nextPassword') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  if (nextPassword.length < 8) {
    return { ok: false, message: 'La nueva contraseña debe tener al menos 8 caracteres.' }
  }

  if (nextPassword !== confirmPassword) {
    return { ok: false, message: 'La confirmación de contraseña no coincide.' }
  }

  const result = await updateAdminPassword(currentPassword, nextPassword)

  if (result.ok) {
    revalidatePath('/admin/profile')
  }

  return result
}
