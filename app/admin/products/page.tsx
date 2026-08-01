import { redirect } from "next/navigation";
import ProductCreateModal from "@/components/products/ProductCreateModal";
import ProductFilters from "@/components/products/ProductFilters";
import ProductsPagination from "@/components/products/ProductsPagination";
import ProductTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import { Category, Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic'

async function categoryCount() {
  return await prisma.category.count()
}

async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}

function getProductFilters(search: string, categoryId: string): Prisma.ProductWhereInput {
  return {
    ...(search ? {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    } : {}),
    ...(categoryId ? {
      categoryId: Number.parseInt(categoryId, 10),
    } : {}),
  }
}

async function getProducts(page: number, pageSize:number, search: string, categoryId: string) {
  const skip = (page - 1) * pageSize
  const products = await prisma.product.findMany({
    take: pageSize,
    skip,
    where: getProductFilters(search, categoryId),
    include: {
      category: true
    },
    orderBy: {
      id: 'asc',
    },
  })

  return products
}

async function getFilteredProductCount(search: string, categoryId: string) {
  return prisma.product.count({ where: getProductFilters(search, categoryId) })
}

export type ProductsWithCategory = Awaited<ReturnType<typeof getProducts>>

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; categoryId?: string }>
}) {
  const { page: pageParam, search = '', categoryId = '' } = await searchParams
  const page = +(pageParam ?? '') || 1
  const pageSize = 10

  if(page < 0) redirect('/admin/products')

  const productsData = getProducts(page, pageSize, search, categoryId)
  const totalProductsData = getFilteredProductCount(search, categoryId)
  const totalCategoriesData = categoryCount()
  const categoriesData = getCategories()
  const [products, totalProducts, totalCategories, categories] = await Promise.all([productsData, totalProductsData, totalCategoriesData, categoriesData])
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize))
  
  if(page > totalPages){
    redirect('/admin/products')
  }
  
  return (
    <>
      <Heading>Administrar Productos</Heading>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="panel rounded-[1.75rem] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Productos</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{totalProducts}</p>
        </div>
        <div className="panel rounded-[1.75rem] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Categorías</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{totalCategories}</p>
        </div>
      </div>

      <div className="panel mt-6 rounded-[1.75rem] p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Catálogo</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Gestiona tu vitrina de productos</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">Crea productos nuevos, encuentra ítems rápidamente y mantén el menú siempre actualizado.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ProductCreateModal categories={categories} />

            <ProductFilters
              categories={categories}
              initialSearch={search}
              initialCategoryId={categoryId}
            />
          </div>
        </div>
      </div>


      <ProductTable
        products={products}
        categories={categories}
      />

      <ProductsPagination
        page={page}
        totalPages={totalPages}
        search={search}
        categoryId={categoryId}
      />
    </>
  )
}
