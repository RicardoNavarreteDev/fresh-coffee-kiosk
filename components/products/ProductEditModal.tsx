"use client"

import { Category, Product } from '@prisma/client'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { updateProduct } from '@/actions/update-product-action'
import { ProductSchema } from '@/src/schema'
import ImageUpload from '@/components/products/ImageUpload'

type ProductEditModalProps = {
  product: Product
  categories: Category[]
}

export default function ProductEditModal({ product, categories }: ProductEditModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    const data = {
      name: formData.get('name'),
      price: formData.get('price'),
      categoryId: formData.get('categoryId'),
      stock: formData.get('stock'),
      description: formData.get('description'),
      image: formData.get('image'),
    }

    const result = ProductSchema.safeParse(data)

    if (!result.success) {
      result.error.issues.forEach((issue) => toast.error(issue.message))
      return
    }

    const response = await updateProduct(result.data, product.id)

    if (response?.errors) {
      response.errors.forEach((issue) => toast.error(issue.message))
      return
    }

    toast.success('Producto actualizado correctamente')
    setIsOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
      >
        Editar
      </button>

      {isOpen ? createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-6">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/25">
            <div className="max-h-[85vh] overflow-y-auto p-6 lg:p-8">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              aria-label="Cerrar edición de producto"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Editar producto</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{product.name}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">Actualiza el contenido visible del catálogo sin salir del listado principal.</p>
            </div>

            <form action={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor={`edit-name-${product.id}`}>Nombre</label>
                <input id={`edit-name-${product.id}`} type="text" name="name" className="field-input" defaultValue={product.name} />
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor={`edit-price-${product.id}`}>Precio (CLP)</label>
                  <input id={`edit-price-${product.id}`} name="price" className="field-input" defaultValue={product.price} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor={`edit-stock-${product.id}`}>Stock</label>
                  <input id={`edit-stock-${product.id}`} name="stock" className="field-input" defaultValue={product.stock} />
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor={`edit-category-${product.id}`}>Categoría</label>
                  <select id={`edit-category-${product.id}`} name="categoryId" className="field-input" defaultValue={product.categoryId}>
                    <option value="">-- Seleccione --</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor={`edit-description-${product.id}`}>Descripción</label>
                <textarea
                  id={`edit-description-${product.id}`}
                  name="description"
                  className="field-input min-h-32 resize-y"
                  defaultValue={product.description ?? ''}
                />
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Foto del producto</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">Sube una imagen nueva o conserva la actual. Usa formatos optimizados para evitar problemas en el catálogo.</p>

                <div className="mt-5">
                  <ImageUpload image={product.image} />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setIsOpen(false)} className="button-secondary">
                  Cancelar
                </button>
                <button type="submit" className="button-primary">
                  Guardar cambios
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </>
  )
}
