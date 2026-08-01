"use client"

import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { updateAdminPasswordAction } from '@/actions/update-admin-profile-action'

export default function AdminPasswordSettingsForm() {
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    const response = await updateAdminPasswordAction(formData)

    if (!response.ok) {
      toast.error(response.message)
      return
    }

    toast.success('Contraseña actualizada correctamente')
    router.refresh()
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="currentPassword">Contraseña actual</label>
        <input id="currentPassword" name="currentPassword" type="password" className="field-input" placeholder="Ingresa tu contraseña actual" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="nextPassword">Nueva contraseña</label>
        <input id="nextPassword" name="nextPassword" type="password" className="field-input" placeholder="Mínimo 8 caracteres" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="confirmPassword">Confirmar nueva contraseña</label>
        <input id="confirmPassword" name="confirmPassword" type="password" className="field-input" placeholder="Repite la nueva contraseña" />
      </div>

      <button type="submit" className="button-primary w-full">
        Actualizar contraseña
      </button>
    </form>
  )
}
