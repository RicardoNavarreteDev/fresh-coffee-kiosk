"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { completeOrder } from "@/actions/complete-order-action"
import { deleteOrder } from "@/actions/delete-order-action"
import { OrderWithProducts } from "@/src/types"
import { formatCurrency, formatDate } from "@/src/utils"
import { getOrderStatusBadgeClassName, getOrderStatusLabel } from "@/src/utils/order-status"

type AdminOrderDetailsModalProps = {
    order: OrderWithProducts
}

export default function AdminOrderDetailsModal({ order }: AdminOrderDetailsModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
                Ver detalle
            </button>

            {isOpen ? createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 px-4 py-6">
                    <div className="relative w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-2xl shadow-slate-900/30">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-slate-700 shadow-sm transition hover:bg-white"
                            aria-label="Cerrar detalle del pedido"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>

                        <div className="border-b border-slate-200 bg-gradient-to-br from-white via-slate-50 to-stone-50 px-6 py-5 lg:px-7">
                            <div className="flex flex-col gap-4 pr-14 sm:flex-row sm:items-start sm:justify-between sm:pr-16">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Pedido #{order.id}</p>
                                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{order.name}</h3>
                                    <p className="mt-1 text-sm text-slate-500">{formatDate(order.date)}</p>
                                </div>

                                <span className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] ring-1 ${getOrderStatusBadgeClassName(order.status)}`}>
                                    {order.status === 'COMPLETED' ? 'Pedido listo' : order.status === 'CANCELLED' ? 'Pedido cancelado' : 'Pedido pendiente'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-5 px-6 py-6 lg:px-7 lg:py-7">
                            <section>
                                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Productos</p>
                                <div className="mt-4 space-y-2.5">
                                    {order.orderProducts.map((item) => (
                                        <div key={item.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 px-4 py-3.5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900">{item.product.name}</p>
                                                    <p className="mt-1 text-sm text-slate-500">Cantidad: {item.quantity}</p>
                                                </div>

                                                <p className="shrink-0 text-sm font-semibold text-slate-800">
                                                    {formatCurrency(item.product.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 px-5 py-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Resumen</p>
                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                                    <div className="rounded-[1.1rem] border border-slate-200 bg-white px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Productos</p>
                                        <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{order.orderProducts.length}</p>
                                    </div>
                                    <div className="rounded-[1.1rem] border border-slate-200 bg-white px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Unidades</p>
                                        <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{order.orderProducts.reduce((total, item) => total + item.quantity, 0)}</p>
                                    </div>
                                    <div className="rounded-[1.1rem] border border-slate-200 bg-white px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Estado</p>
                                        <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{getOrderStatusLabel(order.status)}</p>
                                    </div>
                                    <div className="rounded-[1.1rem] border border-amber-200 bg-amber-50/70 px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">Total</p>
                                        <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{formatCurrency(order.total)}</p>
                                    </div>
                                </div>
                            </section>

                            {order.status === 'PENDING' ? (
                                <section className="grid gap-3 sm:grid-cols-2">
                                    <form action={completeOrder}>
                                        <input type="hidden" name="order_id" value={order.id} />
                                        <button type="submit" className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800">
                                            Marcar como listo
                                        </button>
                                    </form>

                                    <form action={deleteOrder}>
                                        <input type="hidden" name="order_id" value={order.id} />
                                        <button type="submit" className="inline-flex w-full items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-700 transition hover:bg-rose-100">
                                            Cancelar pedido
                                        </button>
                                    </form>
                                </section>
                            ) : null}
                        </div>
                    </div>
                </div>,
                document.body
            ) : null}
        </>
    )
}
