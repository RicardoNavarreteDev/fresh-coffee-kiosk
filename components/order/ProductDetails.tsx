import { useStore } from "@/src/store";
import { OrderItem } from "@/src/types"
import { formatCurrency, getImagePath } from "@/src/utils";
import { XCircleIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useMemo } from "react";


type ProductDetailsProps = {
    item: OrderItem
}

const MIN_ITEMS = 1
const MAX_ITEMS = 5

export default function ProductDetails({ item }: ProductDetailsProps) {

  const increaseQuantity = useStore((state) => state.increaseQuantity)
  const decreaseQuantity = useStore((state) => state.decreaseQuantity)
  const removeItem = useStore((state) => state.removeItem)
  const disableDecreaseButton = useMemo(() =>item.quantity === MIN_ITEMS, [item])
  const disableIncreaseButton = useMemo(() =>item.quantity === Math.min(MAX_ITEMS, item.stock), [item])

  return (
    <div className="panel rounded-[2rem] p-5">
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.5rem] bg-slate-100 shadow-sm ring-1 ring-slate-200">
          <Image
            fill
            className="object-cover"
            src={getImagePath(item.image)}
            alt={`Imagen de ${item.name}`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 pt-4">
              <p className="text-xl font-semibold tracking-tight text-slate-900">{item.name}</p>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
              aria-label={`Quitar ${item.name} del pedido`}
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="inline-flex w-fit rounded-full bg-amber-50 px-4 py-2 text-2xl font-black text-amber-600 ring-1 ring-amber-100">
          {formatCurrency(item.price)}
        </p>

        <div className="flex items-center gap-5 rounded-[1.5rem] bg-slate-100 px-4 py-3 ring-1 ring-slate-200">
          <button type="button" onClick={() => decreaseQuantity(item.id)} disabled={disableDecreaseButton} className="rounded-full bg-white p-2 text-slate-700 shadow-sm transition disabled:opacity-20">
            <MinusIcon className="h-5 w-5" />
          </button>

          <p className="min-w-8 text-center text-lg font-black text-slate-900">{item.quantity}</p>

          <button type="button" onClick={() => increaseQuantity(item.id)} disabled={disableIncreaseButton} className="rounded-full bg-white p-2 text-slate-700 shadow-sm transition disabled:opacity-20">
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
