import { OrderStatus } from "@prisma/client"

export function getOrderStatusLabel(status: OrderStatus) {
  switch (status) {
    case 'COMPLETED':
      return 'Listo'
    case 'CANCELLED':
      return 'Cancelado'
    default:
      return 'Pendiente'
  }
}

export function getOrderStatusBadgeClassName(status: OrderStatus) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-700 ring-rose-200'
    default:
      return 'bg-amber-50 text-amber-800 ring-amber-200'
  }
}
