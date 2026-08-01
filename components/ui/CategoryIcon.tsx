"use client"
import { Category } from "@prisma/client"
import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"

type CategoryIconProps = {
    category: Category
}
export default function CategoryIcon({category} : CategoryIconProps ) {
  const params = useParams<{category: string}>()
  
  return (
    <Link
        href={`/order/${category.slug}`}
        className={`${
          category.slug === params.category
            ? 'border-amber-300 bg-amber-50 text-amber-950 shadow-sm'
            : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50'
        } mx-3 flex items-center gap-4 rounded-2xl border px-4 py-3 transition`}
    >
      <div className="relative h-14 w-14 rounded-2xl bg-white">
        <Image
        fill
        src={`/icon_${category.slug}.svg`} 
        alt="Imagen Categoria"
        />
        </div>

        <span className="text-base font-semibold tracking-tight">
        {category.name}
        </span>
    </Link>
  )
}
