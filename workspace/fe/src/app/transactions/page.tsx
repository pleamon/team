'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Empty, Select } from '../../components/design'
import type { SelectOption } from '../../components/design'
import { TransactionFilters } from '../../components/business/transactions/TransactionFilters'
import { TransactionTable } from '../../components/business/transactions/TransactionTable'
import type { TransactionFilters as Filters } from '../../components/business/transactions/types'
import { useTransactions } from '../../hooks/useTransactions'
import { fetchTransactions } from '../../services/transactions'

const DownloadIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v3h16v-3" />
  </svg>
)

function buildPageButtons(current: number, totalPages: number) {
  const pages: (number | '…')[] = []
  const push = (p: number | '…') => pages.push(p)

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) push(i)
    return pages
  }

  push(1)
  const start = Math.max(2, current - 1)
  const end = Math.min(totalPages - 1, current + 1)
  if (start > 2) push('…')
  for (let i = start; i <= end; i += 1) push(i)
  if (end < totalPages - 1) push('…')
  push(totalPages)
  return pages
}

export default function TransactionsListPage() {
  const router = useRouter()
  const {
    items,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    filters,
    setFilters,
    loading,
    error,
    retry,
    showing,
  } = useTransactions()

  const [exporting, setExporting] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageButtons = useMemo(() => buildPageButtons(page, totalPages), [page, totalPages])

  const pageSizeOptions: SelectOption[] = [
    { value: '10', label: '10 / page' },
    { value: '20', label: '20 / page' },
    { value: '50', label: '50 / page' },
  ]

  const hasActiveFilters = useMemo(() => {
    const d: Filters = {
      status: 'all',
      query: '',
      dateRange: 'any',
      merchantId: 'any',
      amountRange: 'any',
    }
    return JSON.stringify(filters) !== JSON.stringify(d)
  }, [filters])

  const clearFilters = () => {
    setFilters({
      status: 'all',
      query: '',
      dateRange: 'any',
      merchantId: 'any',
      amountRange: 'any',
    })
  }

  const exportCsv = async () => {
    setExporting(true)
    try {
      const all = await fetchTransactions(filters, 1, Math.max(total, 1000))
      const lines = [
        ['ID', 'Date', 'Merchant', 'Amount', 'Currency', 'Status', 'Reference'].join(','),
        ...all.items.map((t) =>
          [
            t.id,
            t.createdAt,
            t.merchantName,
            (t.amountCents / 100).toFixed(2),
            t.currency,
            t.status,
            t.reference,
          ]
            .map((v) => `"${String(v).replaceAll('"', '""')}"`)
            .join(','),
        ),
      ]
      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[var(--font-2xl)] font-semibold text-[var(--color-gray-900)]">Transactions</h1>
        <div className="flex items-center gap-[var(--space-3)]">
          <Button onClick={() => router.push('/transactions/new')}>Create Payment</Button>
          <Button variant="secondary" icon={DownloadIcon} onClick={exportCsv} loading={exporting}>
            Export
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <TransactionFilters
        value={filters}
        onChange={setFilters}
        disabled={loading}
        onClear={clearFilters}
      />

      {/* Table */}
      <TransactionTable
        items={items}
        loading={loading}
        error={!!error}
        onRowClick={(t) => router.push(`/transactions/${encodeURIComponent(t.id)}`)}
        emptyContent={
          <Empty
            variant={hasActiveFilters ? 'empty-filter' : 'empty-default'}
            title="No transactions found"
            description="Try adjusting your filters"
            action={
              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            }
          />
        }
        errorContent={
          <Empty
            variant="error-network"
            title="Failed to load transactions"
            description="Please check your connection and try again."
            action={
              <Button onClick={retry}>
                Retry
              </Button>
            }
          />
        }
      />

      {/* Pagination */}
      <div className="flex flex-col gap-[var(--space-3)] md:flex-row md:items-center md:justify-between">
        <div className="text-[var(--font-sm)] text-[var(--color-gray-500)]">
          Showing {showing.from}-{showing.to} of {total.toLocaleString('en-US')}
        </div>

        <div className="flex flex-wrap items-center gap-[var(--space-3)]">
          <Select
            size="sm"
            options={pageSizeOptions}
            value={String(pageSize)}
            onChange={(v) => setPageSize(Number(v))}
          />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="h-8 w-8 rounded-[var(--radius-md)] border border-[var(--color-gray-200)] bg-[var(--color-white)] text-[var(--color-gray-700)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[var(--color-info-light)]"
              aria-label="Previous page"
            >
              ‹
            </button>
            {pageButtons.map((p, idx) =>
              p === '…' ? (
                <span key={`e-${idx}`} className="px-2 text-[var(--color-gray-500)]">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={[
                    'h-8 w-8 rounded-[var(--radius-md)] text-[var(--font-sm)] font-medium outline-none',
                    'focus-visible:ring-2 focus-visible:ring-[var(--color-info-light)]',
                    p === page
                      ? 'bg-[var(--color-primary-500)] text-[var(--color-white)]'
                      : 'border border-[var(--color-gray-200)] bg-[var(--color-white)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]',
                  ].join(' ')}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="h-8 w-8 rounded-[var(--radius-md)] border border-[var(--color-gray-200)] bg-[var(--color-white)] text-[var(--color-gray-700)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[var(--color-info-light)]"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
