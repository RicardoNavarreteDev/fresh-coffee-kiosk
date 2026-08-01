"use client"
import { useStore } from "@/src/store"
import { toast } from "react-toastify"
import ProductDetails from "./ProductDetails"
import { FormEvent, useMemo, useState } from "react"
import { formatCurrency } from "@/src/utils"
import { createOrder } from "@/actions/create-order-action"
import { OrderSchema } from "@/src/schema"



export default function OrderSummary() {
  const order = useStore((state) => state.order)
  const clearOrder = useStore((state) => state.clearOrder)
  const total = useMemo(() => order.reduce((total, item) => total + (item.quantity * item.price), 0), [order])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget

    const formData = new FormData(form)
    const data = {
      name: formData.get('name'),
      total,
      order
    }
    const result = OrderSchema.safeParse(data)
    if(!result.success){
      result.error.issues.forEach((issue) => {
        toast.error(issue.message)
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await createOrder(data)

      if(response?.errors){
        response.errors.forEach((issue) => {
          toast.error(issue.message)
        })
        return
      }

      toast.success('Pedido realizado correctamente')
      clearOrder()
      form.reset()
    } catch {
      toast.error('Ocurrio un error al enviar el pedido')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <aside className="border-slate-200 bg-white/80 p-5 backdrop-blur md:w-72 md:border-l lg:h-screen lg:w-[28rem] lg:overflow-y-scroll lg:p-8">
        <div className="panel-muted p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Resumen</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Mi Pedido</h1>
          <p className="mt-3 text-sm text-slate-500">Revisá tus productos antes de confirmar la orden.</p>
        </div>

        {order.length === 0 ? <p className="my-10 text-center text-slate-500">Tu pedido esta vacio</p> : (
          <div className="mt-6 space-y-5">
            {order.map(item =>(
              <ProductDetails
                key={item.id}
                item={item}
              />
            ))}

            <div className="panel-muted mt-10 p-6 text-center"> 
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Total</p>
              <p className="mt-3 text-3xl"> 
              Total a pagar: {''}
              <span className="font-bold">{formatCurrency(total)}</span>
              </p>
            </div>

            <form 
              className="panel mt-6 w-full space-y-5 p-6"
              onSubmit={handleCreateOrder}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Confirmacion</p>
                <p className="mt-2 text-sm text-slate-500">Ingresá tu nombre para enviar el pedido a cocina.</p>
              </div>

              <input 
                type="text" 
                placeholder="Tu Nombre"
                className="field-input"
                name="name"
              />

              <input 
                type="submit"
                disabled={isSubmitting}
                className="button-primary w-full"
                value={isSubmitting ? 'Enviando...' : 'Confirmar Pedido'}
              />
            </form>
          </div>
        )}
    </aside>
  )
}
