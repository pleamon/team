import { StatusBadge } from '@/components/ui/StatusBadge'
import { DataTable } from '@/components/ui/DataTable'
import { merchants } from '@/lib/mock-data'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { Merchant } from '@/types'
import Link from 'next/link'

const columns = [
  {
    key: 'name',
    label: 'Merchant',
    render: (row: Merchant) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary-600">
          {row.name.charAt(0)}
        </div>
        <div>
          <Link href={`/merchants/${row.id}`} className="font-medium text-text hover:text-primary-600 transition-colors">
            {row.name}
          </Link>
          <p className="text-xs text-text-muted">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: Merchant) => <StatusBadge status={row.status} />,
  },
  {
    key: 'balance',
    label: 'Balance',
    align: 'right' as const,
    render: (row: Merchant) => (
      <span className="font-semibold text-text tabular-nums">
        {formatCurrency(row.balance, row.currency)}
      </span>
    ),
  },
  {
    key: 'transactionCount',
    label: 'Transactions',
    align: 'right' as const,
    render: (row: Merchant) => (
      <span className="text-text-secondary tabular-nums">{formatNumber(row.transactionCount)}</span>
    ),
  },
  {
    key: 'totalVolume',
    label: 'Total Volume',
    align: 'right' as const,
    render: (row: Merchant) => (
      <span className="tabular-nums text-text-secondary">
        {formatCurrency(row.totalVolume, row.currency)}
      </span>
    ),
  },
  {
    key: 'createdAt',
    label: 'Joined',
    render: (row: Merchant) => (
      <span className="text-xs text-text-muted">{row.createdAt}</span>
    ),
  },
]

export default function MerchantsPage() {
  const statusCounts = {
    all: merchants.length,
    active: merchants.filter((m) => m.status === 'active').length,
    pending: merchants.filter((m) => m.status === 'pending').length,
    suspended: merchants.filter((m) => m.status === 'suspended').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">Merchant Management</h2>
          <p className="text-sm text-text-muted mt-0.5">Manage your payment merchants</p>
        </div>
        <Link
          href="/merchants/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Merchant
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg bg-surface-dim p-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'pending', label: 'Pending' },
          { key: 'suspended', label: 'Suspended' },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab.key === 'all'
                ? 'bg-surface text-text shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-text-muted">
              {statusCounts[tab.key as keyof typeof statusCounts]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface">
        <DataTable columns={columns} data={merchants} />
      </div>
    </div>
  )
}
