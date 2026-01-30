import { formatPercent } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  change: number
  icon: React.ReactNode
}

export function StatCard({ label, value, change, icon }: StatCardProps) {
  const isPositive = change >= 0
  return (
    <div className="rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          {icon}
        </div>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
            isPositive ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          <svg
            className={`h-3 w-3 ${isPositive ? '' : 'rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          {formatPercent(change)}
        </span>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight text-text">{value}</p>
        <p className="mt-0.5 text-sm text-text-muted">{label}</p>
      </div>
    </div>
  )
}
