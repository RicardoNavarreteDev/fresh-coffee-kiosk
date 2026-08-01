import Image from 'next/image'
import { StarIcon } from '@heroicons/react/24/solid'
import Heading from '@/components/ui/Heading'
import { prisma } from '@/src/lib/prisma'
import { formatCurrency, getImagePath } from '@/src/utils'

export const dynamic = 'force-dynamic'

async function getCompletedOrders() {
  return prisma.order.findMany({
    where: {
      status: 'COMPLETED',
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

function getDateRanges() {
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  return { weekStart, monthStart }
}

function aggregateProducts(orders: Awaited<ReturnType<typeof getCompletedOrders>>, filter: (orderDate: Date) => boolean) {
  const products = new Map<number, { name: string; image: string; quantity: number; revenue: number }>()

  for (const order of orders) {
    if (!filter(order.date)) {
      continue
    }

    for (const item of order.orderProducts) {
      const current = products.get(item.productId) ?? { name: item.product.name, image: item.product.image, quantity: 0, revenue: 0 }

      products.set(item.productId, {
        name: item.product.name,
        image: item.product.image,
        quantity: current.quantity + item.quantity,
        revenue: current.revenue + item.product.price * item.quantity,
      })
    }
  }

  return Array.from(products.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5)
}

export default async function AdminTopPage() {
  const orders = await getCompletedOrders()
  const { weekStart, monthStart } = getDateRanges()
  const topSold = aggregateProducts(orders, () => true)
  const topWeek = aggregateProducts(orders, (date) => date >= weekStart)
  const topMonth = aggregateProducts(orders, (date) => date >= monthStart)
  const totalUnitsSold = topSold.reduce((total, item) => total + item.quantity, 0)
  const totalRevenue = topSold.reduce((total, item) => total + item.revenue, 0)

  const sections = [
    { eyebrow: 'Top vendido', title: 'Histórico general', items: topSold, showRevenue: true },
    { eyebrow: 'Producto de la semana', title: 'Últimos 7 días', items: topWeek, showRevenue: false },
    { eyebrow: 'Producto del mes', title: 'Mes actual', items: topMonth, showRevenue: false },
  ]

  const getMedalStyles = (index: number) => {
    if (index === 0) {
      return 'bg-amber-50 text-amber-700 ring-amber-200'
    }

    if (index === 1) {
      return 'bg-slate-100 text-slate-700 ring-slate-300'
    }

    if (index === 2) {
      return 'bg-orange-50 text-orange-700 ring-orange-200'
    }

    return 'bg-white text-slate-500 ring-slate-200'
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Top</p>
        <Heading>Productos destacados</Heading>
        <p className="max-w-2xl text-base leading-7 text-slate-600">
          Revisa qué productos lideran en ventas, cuáles destacan esta semana y qué se está moviendo más en el mes actual.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel rounded-[1.75rem] px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Órdenes completadas</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{orders.length}</p>
        </div>
        <div className="panel rounded-[1.75rem] px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Unidades top</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{totalUnitsSold}</p>
        </div>
        <div className="panel rounded-[1.75rem] px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Ventas top</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {topSold[0] ? (
        <section className="panel overflow-hidden rounded-[2.25rem]">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[18rem] bg-slate-100 lg:min-h-[24rem]">
              <Image
                fill
                className="object-cover"
                src={getImagePath(topSold[0].image)}
                alt={`Imagen de ${topSold[0].name}`}
              />
            </div>

            <div className="flex flex-col justify-center px-6 py-8 lg:px-10">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                <StarIcon className="h-4 w-4" />
                Producto estrella
              </div>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl">{topSold[0].name}</h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Lidera el historial de ventas del quiosco con <span className="font-semibold text-slate-900">{topSold[0].quantity} unidades</span> y una recaudación acumulada de <span className="font-semibold text-slate-900">{formatCurrency(topSold[0].revenue)}</span>.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Unidades vendidas</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{topSold[0].quantity}</p>
                </div>
                <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50/70 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Recaudación</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{formatCurrency(topSold[0].revenue)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        {sections.map((section) => (
          <section key={section.title} className="panel flex h-full flex-col rounded-[2rem] p-6 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{section.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{section.title}</h2>

            {section.items.length ? (
              <div className="mt-6 space-y-3">
                {section.items.map((item, index) => (
                  <div key={`${section.title}-${item.name}`} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 min-h-[8.25rem]">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] bg-white ring-1 ring-slate-200">
                        <Image
                          fill
                          className="object-cover"
                          src={getImagePath(item.image)}
                          alt={`Imagen de ${item.name}`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ring-1 ${getMedalStyles(index)}`}>
                              <StarIcon className={`h-3.5 w-3.5 ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-500' : index === 2 ? 'text-orange-500' : 'text-slate-300'}`} />
                              #{index + 1}
                            </div>
                            <p className="mt-1 text-base font-semibold tracking-tight text-slate-900">{item.name}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-semibold tracking-tight text-slate-900">{item.quantity}</p>
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Unidades</p>
                          </div>
                        </div>

                        <p className="mt-3 text-sm text-slate-500">
                          {section.showRevenue ? (
                            <>Ventas: <span className="font-semibold text-slate-900">{formatCurrency(item.revenue)}</span></>
                          ) : (
                            <>Periodo activo: <span className="font-semibold text-slate-900">{section.title}</span></>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="panel mt-6 rounded-[1.5rem] px-4 py-5 text-sm text-slate-500">
                Todavía no hay suficientes ventas para mostrar este ranking.
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
