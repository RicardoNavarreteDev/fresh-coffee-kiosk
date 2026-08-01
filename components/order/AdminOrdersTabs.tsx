import Link from 'next/link'

type AdminOrdersTabsProps = {
  activeTab: 'pending' | 'completed' | 'cancelled'
  counts: {
    pending: number
    completed: number
    cancelled: number
  }
}

const tabs = [
  { key: 'pending', label: 'Pendientes' },
  { key: 'completed', label: 'Listos' },
  { key: 'cancelled', label: 'Cancelados' },
] as const

export default function AdminOrdersTabs({ activeTab, counts }: AdminOrdersTabsProps) {
  return (
    <div className="flex flex-wrap items-end gap-2">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab
        const count = counts[tab.key]

        return (
          <Link
            key={tab.key}
            href={`/admin/orders?tab=${tab.key}`}
            className={`inline-flex items-center gap-3 rounded-t-2xl border border-b-0 px-4 py-3 text-sm font-semibold tracking-tight transition ${isActive ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <span>{tab.label}</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isActive ? 'bg-slate-100 text-slate-900' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>
              {count}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
