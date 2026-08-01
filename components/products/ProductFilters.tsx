"use client"

import { Category } from '@prisma/client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useDeferredValue, useEffect, useState } from 'react'

type ProductFiltersProps = {
  categories: Category[]
  initialSearch: string
  initialCategoryId: string
}

export default function ProductFilters({ categories, initialSearch, initialCategoryId }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch)
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (deferredSearch.trim()) {
      params.set('search', deferredSearch.trim())
    } else {
      params.delete('search')
    }

    if (categoryId) {
      params.set('categoryId', categoryId)
    } else {
      params.delete('categoryId')
    }

    params.delete('page')

    startTransition(() => {
      router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname)
    })
  }, [categoryId, deferredSearch, pathname, router, searchParams])

  return (
    <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar producto"
        className="field-input w-full lg:min-w-72"
      />

      <select
        value={categoryId}
        onChange={(event) => setCategoryId(event.target.value)}
        className="field-input w-full lg:min-w-56"
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={String(category.id)}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  )
}
