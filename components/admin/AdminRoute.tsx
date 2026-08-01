"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

type AdminRouteProps = {
   link: {
        url: string;
        text: string;
        blank: boolean;
    }
}

export default function AdminRoute({link}: AdminRouteProps) {

  const pathname = usePathname()
  const isActive = !link.blank && pathname.startsWith(link.url)
  const isExternal = link.blank

  return (
    <Link
        className={`${isActive ? 'border-amber-300 bg-amber-50 text-slate-900 shadow-sm ring-1 ring-amber-200' : isExternal ? 'border-slate-200 bg-slate-50/80 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900' : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50'} mx-3 flex items-center justify-between rounded-2xl border px-4 py-3 text-base font-semibold tracking-tight transition`}
        href={link.url}
        target={link.blank ? '_blank' : ''}
    >
        <span>{link.text}</span>
        {isExternal ? <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Web</span> : null}
    </Link>
  )
}
