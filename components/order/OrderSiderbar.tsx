import { cookies } from 'next/headers'
import {prisma} from '@/src/lib/prisma'
import { getAdminProfile } from '@/src/admin-profile'
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/src/auth'
import CategoryIcon from '../ui/CategoryIcon';
import AdminAccess from './AdminAccess';

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      id: 'asc',
    },
  })
}

export default async function OrderSiderbar() {
  const categories = await getCategories()
  const session = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value
  const isAuthenticated = await verifyAdminSessionToken(session)
  const profile = isAuthenticated ? await getAdminProfile() : null

  return (
    <aside className="border-slate-200 bg-white/90 px-3 py-5 backdrop-blur md:flex md:h-screen md:w-80 md:flex-col md:border-r md:px-4 md:py-6">
        <div className="mx-3 mt-4 border-b border-slate-200 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Menú</p>
              <p className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-slate-900">
                Elige una categoría
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Empieza tu pedido desde aquí.
              </p>
            </div>
          </div>
        </div>

        <nav className='mt-6 space-y-2 md:flex-1'>
          {categories.map(category => (
            <CategoryIcon
                key={category.id}
              category={category}
            />
          ))}
        </nav>

        <AdminAccess
          isAuthenticated={isAuthenticated}
          avatarPreset={profile?.avatarPreset}
          avatarImage={profile?.avatarImage}
        />

    </aside>
  )
}
