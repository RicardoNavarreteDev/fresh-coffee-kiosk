import Logo from "../ui/Logo"
import AdminRoute from "./AdminRoute"
import { logout } from "@/actions/logout-action"
import AdminAvatar from "@/components/admin/AdminAvatar"
import { getAdminProfile } from "@/src/admin-profile"

const adminNavigation = [
    {url: '/admin/orders', text: 'Pedidos', blank: false},
    {url: '/admin/products', text: 'Productos', blank: false},
    {url: '/admin/top', text: 'Top', blank: false},
    {url: '/admin/profile', text: 'Perfil', blank: false},
    {url: '/', text: 'Ver Quiosco', blank: true},
]

export default async function AdminSidebar() {
    const profile = await getAdminProfile()

    return (
        <>
            <div className="flex h-full flex-col px-3 pb-6 pt-4 md:h-screen md:pb-5">
                <div className="rounded-[2rem] border border-slate-200 bg-white px-4 py-5 shadow-sm">
                    <Logo className="flex justify-center" imageClassName="relative h-28 w-28 transition hover:scale-[1.02]" />

                    <div className="mt-4 rounded-[1.5rem] bg-gradient-to-br from-slate-50 to-stone-50 px-4 py-4 ring-1 ring-slate-200/80">
                        {profile ? (
                            <div className="flex items-center gap-4">
                                <AdminAvatar avatarPreset={profile.avatarPreset} avatarImage={profile.avatarImage} sizeClassName="h-14 w-14" emojiClassName="text-2xl" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Admin</p>
                                    <p className="mt-1 text-base font-semibold tracking-tight text-slate-900">{profile.email}</p>
                                </div>
                            </div>
                        ) : null}

                        <p className="mt-4 text-sm leading-6 text-slate-500">Controla pedidos y productos con una vista clara y ordenada.</p>
                    </div>
                </div>

                <div className="mt-5 flex min-h-0 flex-1 flex-col rounded-[2rem] border border-slate-200 bg-white px-0 py-5 shadow-sm">
                    <div className="px-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Navegación</p>
                    </div>

                    <nav className="mt-4 flex flex-col gap-2">
                        {adminNavigation.map(link =>(
                            <AdminRoute
                                key={link.url}
                                link={link}
                            />
                        ))}
                    </nav>

                    <div className="mx-3 mt-auto border-t border-slate-200 pt-5">
                        <form action={logout}>
                            <button type="submit" className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                                Cerrar sesión
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>

    )
}
