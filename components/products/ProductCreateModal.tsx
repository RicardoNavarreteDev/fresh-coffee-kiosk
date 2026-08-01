"use client"

import { Category } from '@prisma/client'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { createProduct } from '@/actions/create-product-action'
import { ProductSchema } from '@/src/schema'
import ImageUpload from '@/components/products/ImageUpload'

type ProductCreateModalProps = {
  categories: Category[]
}

export default function ProductCreateModal({ categories }: ProductCreateModalProps) {
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

    const response = await createProduct(result.data)

    if (response?.errors) {
      response.errors.forEach((issue) => toast.error(issue.message))
      return
    }

    toast.success('Producto creado correctamente')
    setIsOpen(false)
    router.refresh()
  }

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="button-primary w-full lg:w-auto">
        Crear producto
      </button>

      {isOpen ? createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-6">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/25">
            <div className="max-h-[85vh] overflow-y-auto p-6 lg:p-8">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              aria-label="Cerrar creación de producto"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Nuevo producto</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Agregar producto al catálogo</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">Crea un producto nuevo sin salir del panel y define su precio, stock, categoría y descripción.</p>
            </div>

            <form action={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="create-name">Nombre</label>
                <input id="create-name" type="text" name="name" className="field-input" placeholder="Nombre del producto" />
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                <div className="space-y-2 lg:col-span-1">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="create-price">Precio (CLP)</label>
                  <input id="create-price" name="price" className="field-input" placeholder="Ej: 5.990" />
                </div>

                <div className="space-y-2 lg:col-span-1">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="create-stock">Stock</label>
                  <input id="create-stock" name="stock" className="field-input" placeholder="Ej: 20" defaultValue="20" />
                </div>

                <div className="space-y-2 lg:col-span-1">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="create-category">Categoría</label>
                  <select id="create-category" name="categoryId" className="field-input" defaultValue="">
                    <option value="">-- Seleccione --</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="create-description">Descripción</label>
                <textarea id="create-description" name="description" className="field-input min-h-32 resize-y" placeholder="Describe el producto para el cliente" />
              </div>

              <ImageUpload image={undefined} />

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setIsOpen(false)} className="button-secondary">
                  Cancelar
                </button>
                <button type="submit" className="button-primary">
                  Crear producto
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
