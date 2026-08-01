import { Product } from "@prisma/client"
import AddProductButton from "./AddProductButton"
import ProductQuickView from "./ProductQuickView"

type ProductCardProps = {
    product: Product
}

export default function ProductCard({product} : ProductCardProps) {
  const isOutOfStock = product.stock <= 0

  return (
    <article className={`panel relative flex h-full flex-col overflow-hidden rounded-[2rem] transition ${isOutOfStock ? 'opacity-95' : 'hover:-translate-y-1 hover:shadow-lg'}`}>
        {isOutOfStock ? (
          <div className="pointer-events-none absolute z-10 m-4 inline-flex w-fit rounded-full border border-rose-200 bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700 shadow-sm">
            Agotado
          </div>
        ) : null}
        <ProductQuickView product={product} />

        <div className="mt-auto px-6 pb-6">
            <AddProductButton
                product={product}
            />
        </div>

    </article>
  )
}
