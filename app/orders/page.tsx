"use client"

import useSWR from "swr";
import Logo from "@/components/ui/Logo";
import { OrderWithProducts } from "@/src/types";
import LatestOrderItem from "@/components/order/LatestOrderItem";


export default function OrdersPage() {
    
  const url = '/orders/api'
  const fetcher = () => fetch(url).then(res => res.json()).then(data => data)
  const {data, isLoading} = useSWR<OrderWithProducts[]>(url, fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false
  })
  if(isLoading) return  'Cargando'

  if (data)
    return (
      <>
        <h1 className="mt-20 text-center text-5xl font-semibold tracking-tight text-slate-900 lg:text-6xl">
          Pedidos Listos
        </h1>

        <Logo />

        {data.length ? (
            <div className="grid grid-cols-2 gap-5 max-w-5xl mx-auto mt-10">
                {data.map(order => (
                    <LatestOrderItem
                        key={order.id}
                        order={order}
                    />
                ))}
            </div>
        ) : <p className="my-10 text-center text-slate-500">No hay pedidos listos</p>}
      </>
    );
}
