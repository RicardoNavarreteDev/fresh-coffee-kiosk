import { completeOrder } from "@/actions/complete-order-action"
import AdminOrderDetailsModal from "@/components/order/AdminOrderDetailsModal"
import { OrderWithProducts } from "@/src/types"
import { formatCurrency, formatDate } from "@/src/utils"
import { getOrderStatusBadgeClassName, getOrderStatusLabel } from "@/src/utils/order-status"


type OrderCardProps = {
    order: OrderWithProducts
}

export default function OrderCard({ order }: OrderCardProps) {
    const visibleProducts = order.orderProducts.slice(0, 2)
    const hiddenProductsCount = order.orderProducts.length - visibleProducts.length


    return (
        <section
            aria-labelledby="summary-heading"
            className="panel flex h-full flex-col rounded-[1.75rem] border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/50 to-stone-50/70 px-5 py-5 shadow-sm sm:p-5 lg:mt-0 lg:p-6"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Pedido #{order.id}</p>
                    <p className='mt-2 text-xl font-semibold tracking-tight text-slate-900'>{order.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{formatDate(order.date)}</p>
                </div>
                <span className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] ring-1 ${getOrderStatusBadgeClassName(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[1.25rem] border border-slate-200 bg-white/90 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Productos</p>
                    <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{order.orderProducts.length}</p>
                </div>
                <div className="rounded-[1.25rem] border border-slate-200 bg-white/90 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Total</p>
                    <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{formatCurrency(order.total)}</p>
                </div>
            </div>

            <div className="mt-5 flex-1">
                <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-500'>Productos ordenados</p>
                <dl className="mt-3 space-y-2.5">
                {visibleProducts.map(product => (
                    <div 
                    key={product.id} 
                    className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-slate-200 bg-white/95 px-4 py-3"
                    >
                        <dd className="min-w-0 truncate pr-2 text-sm font-medium text-slate-900">{product.product.name}</dd>
                        <dt className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                            x{product.quantity}
                        </dt>
                    </div>
                ))}

                {hiddenProductsCount > 0 ? (
                    <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-500">
                        + {hiddenProductsCount} producto(s) más en Ver detalle
                    </div>
                ) : null}
                </dl>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <AdminOrderDetailsModal order={order} />

                {order.status === 'PENDING' ? (
                    <form action={completeOrder} className="w-full">
                        <input type="hidden" 
                            value={order.id}
                            name="order_id"
                        />
                        <input
                            type="submit"
                            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800"
                            value='Marcar como listo'
                        />
                    </form>
                ) : null}
            </div>
        </section>
    )
}
