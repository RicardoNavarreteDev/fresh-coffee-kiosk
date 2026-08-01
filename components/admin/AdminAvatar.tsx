import Image from 'next/image'
import { AdminAvatarPreset } from '@prisma/client'
import { getAdminAvatarOption } from '@/src/admin-avatar'

type AdminAvatarProps = {
  avatarPreset: AdminAvatarPreset
  avatarImage?: string | null
  sizeClassName?: string
  emojiClassName?: string
}

export default function AdminAvatar({
  avatarPreset,
  avatarImage,
  sizeClassName = 'h-12 w-12',
  emojiClassName = 'text-2xl',
}: AdminAvatarProps) {
  if (avatarImage) {
    return (
      <div className={`relative overflow-hidden rounded-2xl ring-1 ring-slate-200 ${sizeClassName}`}>
        <Image
          fill
          className="object-cover"
          src={avatarImage}
          alt="Avatar del administrador"
        />
      </div>
    )
  }

  const avatarOption = getAdminAvatarOption(avatarPreset)

  return (
    <div className={`flex items-center justify-center rounded-2xl ring-1 ring-slate-200 ${avatarOption.backgroundClassName} ${sizeClassName}`}>
      <span className={emojiClassName} aria-hidden="true">{avatarOption.emoji}</span>
    </div>
  )
}
