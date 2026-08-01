import AdminAvatar from '@/components/admin/AdminAvatar'
import AdminAvatarSettingsForm from '@/components/admin/AdminAvatarSettingsForm'
import AdminPasswordSettingsForm from '@/components/admin/AdminPasswordSettingsForm'
import Heading from '@/components/ui/Heading'
import { getAdminProfile } from '@/src/admin-profile'

export const dynamic = 'force-dynamic'

export default async function AdminProfilePage() {
  const profile = await getAdminProfile()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Perfil</p>
          <Heading>Configuración de administrador</Heading>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Personaliza tu avatar, mantén tu acceso al día y deja el panel a tu gusto.
          </p>
        </div>

        {profile ? (
          <div className="panel flex items-center gap-4 rounded-[1.75rem] px-5 py-4">
            <AdminAvatar avatarPreset={profile.avatarPreset} avatarImage={profile.avatarImage} sizeClassName="h-16 w-16" emojiClassName="text-3xl" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Administrador</p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{profile.email}</p>
            </div>
          </div>
        ) : null}
      </div>

      {profile ? (
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="panel rounded-[2rem] p-6 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Avatar</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Elige tu identidad visual</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">Puedes elegir un avatar del sistema o subir una foto personalizada para que aparezca en el panel y en la sesión iniciada.</p>
            <div className="mt-6">
              <AdminAvatarSettingsForm profile={profile} />
            </div>
          </section>

          <section className="panel rounded-[2rem] p-6 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Seguridad</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Cambia tu contraseña</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">Actualiza tu acceso cuando lo necesites. La nueva contraseña se usará en el login del panel y en el acceso desde el quiosco.</p>
            <div className="mt-6">
              <AdminPasswordSettingsForm />
            </div>
          </section>
        </div>
      ) : (
        <div className="panel rounded-[2rem] px-5 py-6 text-sm text-slate-500">
          No se pudo inicializar el perfil del administrador. Revisa `ADMIN_EMAIL` y `ADMIN_PASSWORD`.
        </div>
      )}
    </div>
  )
}
