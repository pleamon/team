import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { DataTable } from '@/components/ui/DataTable'
import { RevenueChart } from '@/components/charts/RevenueChart'
import { MethodChart } from '@/components/charts/MethodChart'
import { dashboardStats, transactions } from '@/lib/mock-data'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { Transaction } from '@/types'

const recentTxnColumns = [
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
      <span className="capitalize text-text-secondary">{row.type}</span>
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
    key: 'createdAt',
    label: 'Time',
    render: (row: Transaction) => (
      <span className="text-xs text-text-muted">{row.createdAt}</span>
    ),
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(dashboardStats.totalRevenue)}
          change={dashboardStats.revenueChange}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Transactions"
          value={formatNumber(dashboardStats.totalTransactions)}
          change={dashboardStats.transactionChange}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          }
        />
        <StatCard
          label="Active Merchants"
          value={String(dashboardStats.activeMerchants)}
          change={dashboardStats.merchantChange}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0020.25 9.35m-18.5 0A2.25 2.25 0 013 7.1V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25V7.1a2.25 2.25 0 01-1.25 2.25" />
            </svg>
          }
        />
        <StatCard
          label="Success Rate"
          value={`${dashboardStats.successRate}%`}
          change={dashboardStats.rateChange}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <MethodChart />
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-text">Recent Transactions</h3>
            <p className="text-xs text-text-muted mt-0.5">Latest payment activity</p>
          </div>
          <a
            href="/transactions"
            className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all →
          </a>
        </div>
        <DataTable columns={recentTxnColumns} data={transactions.slice(0, 6)} />
      </div>
    </div>
  )
}
