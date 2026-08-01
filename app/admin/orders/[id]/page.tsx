import Link from 'next/link'
import { notFound } from 'next/navigation'
import { completeOrder } from '@/actions/complete-order-action'
import { deleteOrder } from '@/actions/delete-order-action'
import GoBackButton from '@/components/ui/GoBackButton'
import Heading from '@/components/ui/Heading'
import { prisma } from '@/src/lib/prisma'
import { formatCurrency, formatDate } from '@/src/utils'
import { getOrderStatusLabel } from '@/src/utils/order-status'

async function getOrderById(id: number) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return order
}

type OrderDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const orderId = Number.parseInt(id, 10)

  if (Number.isNaN(orderId)) {
    notFound()
  }

  const order = await getOrderById(orderId)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Pedido #{order.id}</p>
          <Heading>Detalle del Pedido</Heading>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <GoBackButton />
          <Link href="/admin/orders" className="button-secondary">
            Volver al listado
          </Link>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="panel rounded-[2rem] p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Cliente</p>
              <p className="text-3xl font-semibold tracking-tight text-slate-900">{order.name}</p>
              <p className="text-sm text-slate-500">Ingresado el {formatDate(order.date)}</p>
            </div>

            <span className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'}`}>
              {order.status === 'COMPLETED' ? 'Pedido listo' : order.status === 'CANCELLED' ? 'Pedido cancelado' : 'Pedido pendiente'}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {order.orderProducts.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{item.product.name}</p>
                  <p className="mt-1 text-sm text-slate-500">Cantidad: {item.quantity}</p>
                </div>

                <p className="text-base font-semibold text-slate-700">{formatCurrency(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="space-y-6">
          <section className="panel-muted rounded-[2rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Resumen</p>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Productos</span>
                <span className="font-semibold text-slate-900">{order.orderProducts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estado</span>
                <span className="font-semibold text-slate-900">{getOrderStatusLabel(order.status)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-4 text-white">
                <span>Total</span>
                <span className="text-lg font-semibold">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </section>

          <section className="panel rounded-[2rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Acciones</p>
            <div className="mt-5 space-y-3">
              {order.status === 'PENDING' ? (
                <form action={completeOrder}>
                  <input type="hidden" name="order_id" value={order.id} />
                  <button type="submit" className="button-primary w-full">
                    Marcar como listo
                  </button>
                </form>
              ) : null}

              {order.status === 'PENDING' ? (
                <form action={deleteOrder}>
                  <input type="hidden" name="order_id" value={order.id} />
                  <button type="submit" className="inline-flex w-full items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-700 transition hover:bg-red-100">
                    Cancelar pedido
                  </button>
                </form>
              ) : null}
            </div>
          </section>
        </aside>
      </section>
    </div>
  )
}
