import AdminOrdersTabs from '@/components/order/AdminOrdersTabs'
import AdminOrdersPagination from '@/components/order/AdminOrdersPagination'
import OrderCard from '@/components/order/OrderCard'
import Heading from '@/components/ui/Heading'
import { redirect } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'

async function getOrders() {
  return prisma.order.findMany({
    orderBy: {
      date: 'asc',
    },
    include: {
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
  })
}

type OrdersPageProps = {
  searchParams: Promise<{ tab?: string; page?: string }>
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const orders = await getOrders()
  const { tab, page: pageParam } = await searchParams
  const activeTab = tab === 'completed' || tab === 'cancelled' ? tab : 'pending'
  const pendingOrders = orders.filter((order) => order.status === 'PENDING')
  const completedOrders = orders.filter((order) => order.status === 'COMPLETED')
  const cancelledOrders = orders.filter((order) => order.status === 'CANCELLED')
  const ordersByTab: Record<'pending' | 'completed' | 'cancelled', typeof orders> = {
    pending: pendingOrders,
    completed: completedOrders,
    cancelled: cancelledOrders,
  }
  const activeOrders = ordersByTab[activeTab]
  const tabTitles: Record<'pending' | 'completed' | 'cancelled', { eyebrow: string; title: string; empty: string; helper: string }> = {
    pending: {
      eyebrow: 'Pendientes',
      title: 'Pedidos por preparar',
      empty: 'No hay pedidos pendientes en este momento.',
      helper: `${pendingOrders.length} pedido(s) esperando gestión.`,
    },
    completed: {
      eyebrow: 'Listos',
      title: 'Pedidos completados',
      empty: 'Aún no hay pedidos listos.',
      helper: `${completedOrders.length} pedido(s) marcados como listos.`,
    },
    cancelled: {
      eyebrow: 'Cancelados',
      title: 'Pedidos cancelados',
      empty: 'Aún no hay pedidos cancelados.',
      helper: `${cancelledOrders.length} pedido(s) cancelados en el historial.`,
    },
  }
  const currentTabMeta = tabTitles[activeTab]
  const page = Number.parseInt(pageParam ?? '1', 10)
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page
  const pageSize = 3
  const totalPages = Math.max(1, Math.ceil(activeOrders.length / pageSize))

  if (safePage > totalPages) {
    redirect(`/admin/orders?tab=${activeTab}&page=${totalPages}`)
  }

  const paginatedOrders = activeOrders.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Panel de pedidos</p>
          <Heading>Todos los Pedidos</Heading>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Revisa el historial completo del quiosco, entra al detalle de cada pedido y administra su estado desde un solo lugar.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="panel rounded-[1.75rem] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Total</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{orders.length}</p>
          </div>
          <div className="panel rounded-[1.75rem] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Pendientes</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-amber-600">{pendingOrders.length}</p>
          </div>
          <div className="panel rounded-[1.75rem] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Listos</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-600">{completedOrders.length}</p>
          </div>
        </div>
      </div>

      {orders.length ? (
        <section className="mt-8">
          <AdminOrdersTabs
            activeTab={activeTab}
            counts={{
              pending: pendingOrders.length,
              completed: completedOrders.length,
              cancelled: cancelledOrders.length,
            }}
          />

          <div className="rounded-b-[1.75rem] rounded-tr-[1.75rem] border border-slate-200 bg-white px-5 py-6 shadow-sm lg:px-6 lg:py-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{currentTabMeta.eyebrow}</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{currentTabMeta.title}</h2>
              </div>
              <p className="text-sm text-slate-500">{currentTabMeta.helper}</p>
            </div>

            {activeOrders.length ? (
              <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                {paginatedOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="panel mt-6 rounded-[1.75rem] px-5 py-6 text-sm text-slate-500">
                {currentTabMeta.empty}
              </div>
            )}

            <AdminOrdersPagination
              activeTab={activeTab}
              currentPage={safePage}
              totalPages={totalPages}
            />
          </div>
        </section>
      ) : (
        <p className="mt-12 text-center text-slate-500">Todavia no hay pedidos registrados.</p>
      )}
    </>
  )
}
