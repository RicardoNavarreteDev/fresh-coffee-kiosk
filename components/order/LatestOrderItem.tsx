import { OrderWithProducts } from "@/src/types"

type LatestOrderItemProps = {
    order: OrderWithProducts
}

export default function LatestOrderItem({order} : LatestOrderItemProps) {
  return (
    <div className="panel space-y-5 rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-semibold tracking-tight text-slate-900">
            Cliente: {order.name}
          </p>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">Lista</span>
        </div>

        <ul 
            className="divide-y divide-slate-200 border-t border-slate-200 text-sm font-medium text-slate-500"
            role="list">
                {order.orderProducts.map(product => (
                    <li
                        key={product.id}
                        className="flex py-5 text-lg"
                    >
                        <p>
                            <span className="font-bold">
                                ({product.quantity}) {''}
                            </span>
                            {product.product.name}
                        </p>
                    </li>
                ))}
        </ul>

    </div>
  )
}
