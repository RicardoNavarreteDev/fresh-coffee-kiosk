import { Category } from "@prisma/client"
import { ProductsWithCategory } from "@/app/admin/products/page"
import { toggleProductStock } from "@/actions/toggle-product-stock-action"
import { formatCurrency, getImagePath } from "@/src/utils"
import Image from "next/image"
import ProductEditModal from "@/components/products/ProductEditModal"


type ProductTableProps = {
    products: ProductsWithCategory
    categories: Category[]
}

export default function ProductTable({products, categories} : ProductTableProps) {
    return (
        <div className="mt-14 px-3 sm:px-4 lg:px-2">
            <div className="flow-root">
                <div className="overflow-x-auto">
                    <div className="panel inline-block min-w-full overflow-hidden rounded-[2rem] py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-4 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 sm:pl-0">
                                        Producto
                                    </th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Precio
                                    </th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Categoría
                                    </th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Descripción
                                    </th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Stock
                                    </th>
                                    <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {products.map(product => (
                                    <tr key={product.id}>
                                    <td className="py-5 pl-4 pr-3 text-sm font-semibold text-slate-900 sm:pl-0">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 overflow-hidden rounded-[1rem] bg-slate-100 ring-1 ring-slate-200">
                                                <Image fill className="object-cover" src={getImagePath(product.image)} alt={`Imagen de ${product.name}`} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-base font-semibold tracking-tight text-slate-900">{product.name}</p>
                                                <p className="mt-1 text-sm text-slate-500">ID #{product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-slate-600">
                                        {formatCurrency(product.price)}
                                    </td> 
                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-slate-600">
                                        {product.category.name}
                                    </td>
                                    <td className="px-3 py-5 text-sm text-slate-600">
                                        <p className="line-clamp-2 max-w-xs">{product.description ?? 'Sin descripción'}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-slate-600">
                                        <div className="space-y-2">
                                            <p className="font-semibold text-slate-900">{product.stock}</p>
                                            <form
                                              action={async () => {
                                                'use server'
                                                await toggleProductStock(product.id, product.stock)
                                              }}
                                            >
                                              <button
                                                type="submit"
                                                className={`inline-flex rounded-2xl border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition ${product.stock > 0 ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100' : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                                              >
                                                {product.stock > 0 ? 'Marcar agotado' : 'Reactivar'}
                                              </button>
                                            </form>
                                        </div>
                                    </td>
                                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        <ProductEditModal product={product} categories={categories} />
                                     </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
