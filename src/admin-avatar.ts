import { AdminAvatarPreset } from '@prisma/client'

export const adminAvatarOptions: Array<{
  preset: AdminAvatarPreset
  emoji: string
  label: string
  backgroundClassName: string
}> = [
  { preset: 'DOG', emoji: '🐶', label: 'Perrito', backgroundClassName: 'bg-amber-100' },
  { preset: 'BEAR', emoji: '🐻', label: 'Oso', backgroundClassName: 'bg-stone-200' },
  { preset: 'CAT', emoji: '🐱', label: 'Gatito', backgroundClassName: 'bg-rose-100' },
  { preset: 'FOX', emoji: '🦊', label: 'Zorro', backgroundClassName: 'bg-orange-100' },
  { preset: 'KOALA', emoji: '🐨', label: 'Koala', backgroundClassName: 'bg-slate-200' },
  { preset: 'OWL', emoji: '🦉', label: 'Búho', backgroundClassName: 'bg-lime-100' },
]

export function getAdminAvatarOption(preset: AdminAvatarPreset) {
  return adminAvatarOptions.find((option) => option.preset === preset) ?? adminAvatarOptions[1]
}
