"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminAvatarPreset, AdminProfile } from '@prisma/client'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { updateAdminAvatarAction } from '@/actions/update-admin-profile-action'
import { adminAvatarOptions } from '@/src/admin-avatar'
import AdminAvatar from '@/components/admin/AdminAvatar'

type AdminAvatarSettingsFormProps = {
  profile: AdminProfile
}

export default function AdminAvatarSettingsForm({ profile }: AdminAvatarSettingsFormProps) {
  const router = useRouter()
  const [avatarPreset, setAvatarPreset] = useState<AdminAvatarPreset>(profile.avatarPreset)
  const [avatarImage, setAvatarImage] = useState(profile.avatarImage ?? '')

  const handleSubmit = async (formData: FormData) => {
    const response = await updateAdminAvatarAction(formData)

    if (!response.ok) {
      toast.error(response.message)
      return
    }

    toast.success('Avatar actualizado correctamente')
    router.refresh()
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
        <AdminAvatar avatarPreset={avatarPreset} avatarImage={avatarImage || undefined} sizeClassName="h-16 w-16" emojiClassName="text-3xl" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Vista previa</p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Tu avatar actual</p>
        </div>
      </div>

      <input type="hidden" name="avatarPreset" value={avatarPreset} />
      <input type="hidden" name="avatarImage" value={avatarImage} />

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Avatares rápidos</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {adminAvatarOptions.map((option) => {
            const isActive = avatarPreset === option.preset && !avatarImage

            return (
              <button
                key={option.preset}
                type="button"
                onClick={() => {
                  setAvatarPreset(option.preset)
                  setAvatarImage('')
                }}
                className={`flex items-center gap-4 rounded-[1.5rem] border px-4 py-4 text-left transition ${isActive ? 'border-amber-300 bg-amber-50 ring-1 ring-amber-200' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <AdminAvatar avatarPreset={option.preset} sizeClassName="h-14 w-14" emojiClassName="text-2xl" />
                <div>
                  <p className="text-base font-semibold tracking-tight text-slate-900">{option.label}</p>
                  <p className="text-sm text-slate-500">Preset del sistema</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Subir foto</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">También puedes usar una foto personalizada para tu perfil.</p>
        </div>

        <CldUploadWidget
          uploadPreset="RicardoN"
          options={{ maxFiles: 1 }}
          onSuccess={(result, { widget }) => {
            if (result.event === 'success') {
              widget.close()
              // @ts-expect-error next-cloudinary response typing is loose here
              setAvatarImage(result.info?.secure_url ?? '')
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="inline-flex rounded-2xl border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-400 hover:bg-white"
            >
              Subir foto
            </button>
          )}
        </CldUploadWidget>

        {avatarImage ? (
          <div className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <Image fill className="object-cover" src={avatarImage} alt="Previsualización de avatar" />
            </div>
            <button
              type="button"
              onClick={() => setAvatarImage('')}
              className="text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700"
            >
              Volver al preset seleccionado
            </button>
          </div>
        ) : null}
      </div>

      <button type="submit" className="button-primary w-full">
        Guardar avatar
      </button>
    </form>
  )
}
