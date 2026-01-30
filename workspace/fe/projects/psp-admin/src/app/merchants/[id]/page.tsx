import { StatusBadge } from '@/components/ui/StatusBadge'
import { merchants, transactions } from '@/lib/mock-data'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { DataTable } from '@/components/ui/DataTable'
import Link from 'next/link'
import type { Transaction } from '@/types'

const txnColumns = [
  {
    key: 'id',
    label: 'ID',
    render: (row: Transaction) => (
      <span className="font-mono text-xs text-text-secondary">{row.id}</span>
    ),
  },
  {
    key: 'type',
    label: 'Type',
    render: (row: Transaction) => (
      <span className="capitalize text-text-secondary">{row.type}</span>
    ),
  },
  {
    key: 'amount',
    label: 'Amount',
    align: 'right' as const,
    render: (row: Transaction) => (
      <span className="font-semibold tabular-nums">{formatCurrency(row.amount)}</span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: Transaction) => <StatusBadge status={row.status} />,
  },
  {
    key: 'createdAt',
    label: 'Date',
    render: (row: Transaction) => (
      <span className="text-xs text-text-muted">{row.createdAt}</span>
    ),
  },
]

export default async function MerchantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const merchant = merchants.find((m) => m.id === id) ?? merchants[0]
  const merchantTxns = transactions.filter((t) => t.merchantId === merchant.id)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/merchants" className="hover:text-text transition-colors">Merchants</Link>
        <span>/</span>
        <span className="text-text">{merchant.name}</span>
      </div>

      {/* Info Card */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-xl font-bold text-primary-600">
              {merchant.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">{merchant.name}</h2>
              <p className="text-sm text-text-muted">{merchant.email}</p>
            </div>
          </div>
          <StatusBadge status={merchant.status} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { label: 'Balance', value: formatCurrency(merchant.balance) },
            { label: 'Total Volume', value: formatCurrency(merchant.totalVolume) },
            { label: 'Transactions', value: formatNumber(merchant.transactionCount) },
            { label: 'Joined', value: merchant.createdAt },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-text-muted">{item.label}</p>
              <p className="mt-1 text-base font-semibold text-text">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-text">Transaction History</h3>
          <p className="text-xs text-text-muted mt-0.5">All transactions for this merchant</p>
        </div>
        <DataTable
          columns={txnColumns}
          data={merchantTxns}
          emptyMessage="No transactions found for this merchant"
        />
      </div>
    </div>
  )
}
