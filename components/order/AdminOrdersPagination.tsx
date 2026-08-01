import Link from 'next/link'

type AdminOrdersPaginationProps = {
  currentPage: number
  totalPages: number
  activeTab: 'pending' | 'completed' | 'cancelled'
}

export default function AdminOrdersPagination({ currentPage, totalPages, activeTab }: AdminOrdersPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="mt-6 flex flex-wrap items-center gap-2" aria-label="Paginación de pedidos">
      {currentPage > 1 ? (
        <Link
          href={`/admin/orders?tab=${activeTab}&page=${currentPage - 1}`}
          className="inline-flex rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Anterior
        </Link>
      ) : null}

      {pages.map((page) => (
        <Link
          key={page}
          href={`/admin/orders?tab=${activeTab}&page=${page}`}
          className={`inline-flex min-w-11 items-center justify-center rounded-2xl border px-4 py-2 text-sm font-semibold transition ${page === currentPage ? 'border-amber-300 bg-amber-50 text-slate-900 ring-1 ring-amber-200' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={`/admin/orders?tab=${activeTab}&page=${currentPage + 1}`}
          className="inline-flex rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Siguiente
        </Link>
      ) : null}
    </nav>
  )
}
