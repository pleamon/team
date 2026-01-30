import { StatusBadge } from '@/components/ui/StatusBadge'
import { DataTable } from '@/components/ui/DataTable'
import { transactions } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import type { Transaction } from '@/types'

const columns = [
  {
    key: 'id',
    label: 'Transaction ID',
    render: (row: Transaction) => (
      <span className="font-mono text-xs text-text-secondary">{row.id}</span>
    ),
  },
  {
    key: 'merchantName',
    label: 'Merchant',
    render: (row: Transaction) => (
      <span className="font-medium text-text">{row.merchantName}</span>
    ),
  },
  {
    key: 'type',
    label: 'Type',
    render: (row: Transaction) => (
      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
        row.type === 'payment'
          ? 'bg-blue-50 text-blue-700'
          : row.type === 'payout'
          ? 'bg-purple-50 text-purple-700'
          : row.type === 'refund'
          ? 'bg-amber-50 text-amber-700'
          : 'bg-red-50 text-red-700'
      }`}>
        {row.type}
      </span>
    ),
  },
  {
    key: 'method',
    label: 'Method',
    render: (row: Transaction) => (
      <span className="text-text-secondary">{row.method}</span>
    ),
  },
  {
    key: 'amount',
    label: 'Amount',
    align: 'right' as const,
    render: (row: Transaction) => (
      <span className="font-semibold text-text tabular-nums">
        {formatCurrency(row.amount, row.currency)}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: Transaction) => <StatusBadge status={row.status} />,
  },
  {
    key: 'reference',
    label: 'Reference',
    render: (row: Transaction) => (
      <span className="font-mono text-xs text-text-muted">{row.reference}</span>
    ),
  },
  {
    key: 'createdAt',
    label: 'Date',
    render: (row: Transaction) => (
      <span className="text-xs text-text-muted">{row.createdAt}</span>
    ),
  },
]

export default function TransactionsPage() {
  const stats = {
    total: transactions.length,
    success: transactions.filter((t) => t.status === 'success').length,
    pending: transactions.filter((t) => t.status === 'pending').length,
    failed: transactions.filter((t) => t.status === 'failed').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-text">Transaction History</h2>
        <p className="text-sm text-text-muted mt-0.5">View and manage all payment transactions</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-slate-50 text-slate-700' },
          { label: 'Success', value: stats.success, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Pending', value: stats.pending, color: 'bg-amber-50 text-amber-700' },
          { label: 'Failed', value: stats.failed, color: 'bg-red-50 text-red-700' },
        ].map((s) => (
          <div key={s.label} className={`rounded-lg px-4 py-3 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by ID, merchant, reference..."
            className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2.5 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-secondary outline-none focus:border-primary-400">
          <option>All Status</option>
          <option>Success</option>
          <option>Pending</option>
          <option>Failed</option>
          <option>Refunded</option>
        </select>
        <select className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-secondary outline-none focus:border-primary-400">
          <option>All Types</option>
          <option>Payment</option>
          <option>Payout</option>
          <option>Refund</option>
        </select>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface">
        <DataTable columns={columns} data={transactions} />
      </div>
    </div>
  )
}
