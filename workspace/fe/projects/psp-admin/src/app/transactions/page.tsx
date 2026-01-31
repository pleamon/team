'use client'

import { useState, useEffect, useCallback } from 'react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { DataTable } from '@/components/ui/DataTable'
import { formatCurrency } from '@/lib/utils'
import { TransactionService, type FetchTransactionsResponse } from '@/services/transaction-service'
import type { Transaction } from '@/types'
import Link from 'next/link'
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react'

const columns = [
  {
    key: 'id',
    label: 'Transaction ID',
    render: (row: Transaction) => (
      <Link href={`/transactions/${row.id}`} className="font-mono text-xs text-primary-600 hover:text-primary-700 hover:underline">
        {row.id}
      </Link>
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
    key: 'createdAt',
    label: 'Date',
    render: (row: Transaction) => (
      <span className="text-xs text-text-muted">{row.createdAt}</span>
    ),
  },
]

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<FetchTransactionsResponse | null>(null)
  
  // Filters
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await TransactionService.getAll({
        page,
        limit: 10,
        search,
        status: status === 'all' ? undefined : status,
        type: type === 'all' ? undefined : type,
      })
      setResponse(res)
    } catch (err) {
      setError('Failed to fetch transactions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search, status, type])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Debounce search input? For now simple effect dependency
  
  const handleRetry = () => {
    fetchData()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchData() // Trigger fetch immediately on submit if preferred, currently effect handles it
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">Transaction History</h2>
          <p className="text-sm text-text-muted mt-0.5">View and manage all payment transactions</p>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-border shadow-sm">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by ID, merchant..."
            className="w-full rounded-lg border border-border bg-gray-50 pl-9 pr-3 py-2 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </form>
        
        <div className="h-8 w-px bg-border mx-1" />

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-muted" />
          <select 
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-gray-50 px-3 py-2 text-sm text-text-secondary outline-none focus:border-primary-400 cursor-pointer hover:bg-white transition-colors"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-gray-50 px-3 py-2 text-sm text-text-secondary outline-none focus:border-primary-400 cursor-pointer hover:bg-white transition-colors"
          >
            <option value="all">All Types</option>
            <option value="payment">Payment</option>
            <option value="payout">Payout</option>
            <option value="refund">Refund</option>
          </select>
        </div>
        
        <button className="ml-auto inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        <DataTable 
          columns={columns} 
          data={response?.data || []} 
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
        
        {/* Pagination */}
        {response && !loading && !error && (
           <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-gray-50/50">
             <div className="text-xs text-text-muted">
               Showing <span className="font-medium">{(response.meta.page - 1) * response.meta.limit + 1}</span> to <span className="font-medium">{Math.min(response.meta.page * response.meta.limit, response.meta.total)}</span> of <span className="font-medium">{response.meta.total}</span> results
             </div>
             <div className="flex items-center gap-2">
               <button
                 onClick={() => setPage(p => Math.max(1, p - 1))}
                 disabled={page === 1}
                 className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary"
               >
                 <ChevronLeft className="h-4 w-4" />
               </button>
               <span className="text-xs font-medium text-text px-2">Page {page} of {response.meta.totalPages}</span>
               <button
                 onClick={() => setPage(p => Math.min(response.meta.totalPages, p + 1))}
                 disabled={page === response.meta.totalPages}
                 className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary"
               >
                 <ChevronRight className="h-4 w-4" />
               </button>
             </div>
           </div>
        )}
      </div>
    </div>
  )
}
