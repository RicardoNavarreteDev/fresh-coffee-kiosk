"use client"

import { Product } from "@prisma/client";
import { useStore } from "@/src/store";

type AddProductButtonProps = {
    product: Product
    className?: string
    onAdd?: () => void
}

export default function AddProductButton({product, className = 'button-primary mt-6 w-full', onAdd} : AddProductButtonProps) {

  const addToOrder = useStore((state) => state.addToOrder)
  const isOutOfStock = product.stock <= 0
  return (
    <button
      type="button"
      className={className}
      disabled={isOutOfStock}
      onClick={() => {
        addToOrder(product)
        onAdd?.()
      }}
     >{isOutOfStock ? 'Agotado' : 'Agregar'}
     </button>
  );
}
