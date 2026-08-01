import Link from "next/link";

type ProductsPaginationProps = {
    page: number
    totalPages: number
    search?: string
    categoryId?: string
}


export default function ProductsPagination({page, totalPages, search = '', categoryId = ''} : ProductsPaginationProps) {
   const pages = Array.from({length: totalPages}, (_, i) => i + 1)
   const buildHref = (targetPage: number) => {
      const params = new URLSearchParams()

      params.set('page', String(targetPage))

      if (search) {
        params.set('search', search)
      }

      if (categoryId) {
        params.set('categoryId', categoryId)
      }

      return `/admin/products?${params.toString()}`
   }

  return (
    <nav className="flex justify-center py-10">
        {page > 1 && (
            <Link
            href={buildHref(page - 1)}
            className="bg-white px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
        >&laquo;</Link>
        )}

        {pages.map(currentPage => (
            <Link
            key={currentPage}
            href={buildHref(currentPage)}
            className={`${page === currentPage && 'font-black'} bg-white px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
            >{currentPage}</Link>
        ))}

        {page < totalPages && (
            <Link
            href={buildHref(page + 1)}
            className="bg-white px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
        >&raquo;</Link>
        )}
    </nav>
  )
}
