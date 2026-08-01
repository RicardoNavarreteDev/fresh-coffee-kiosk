import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'

async function getFirstCategory() {
  return prisma.category.findFirst({
    orderBy: { id: 'asc' },
    select: { slug: true },
  })
}

export default async function Home() {
  const firstCategory = await getFirstCategory()

  if (firstCategory) {
    redirect(`/order/${firstCategory.slug}`)
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">No hay categorias disponibles</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Crea o restaura categorias en la base de datos para habilitar el flujo principal de pedidos.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/login" className="button-secondary">
            Ir al admin
          </Link>
        </div>
      </div>
    </main>
  )
}
