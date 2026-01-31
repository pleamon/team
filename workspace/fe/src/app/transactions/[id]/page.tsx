'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Badge, Button, Skeleton, ToastContainer, useToast } from '../../../components/design'
import { RefundDialog } from '../../../components/business/transactions/RefundDialog'
import { TransactionTimeline } from '../../../components/business/transactions/TransactionTimeline'
import { fetchTransactionById, refundTransaction } from '../../../services/transactions'
import type { Transaction } from '../../../components/business/transactions/types'

/* ── Icons ── */
const BackIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)

const RefundIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
)

const CopyIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
    />
  </svg>
)

const ChevronRightIcon = (
  <svg className="h-4 w-4 text-[var(--color-gray-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const ChevronDownIcon = (
  <svg className="h-4 w-4 text-[var(--color-gray-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

/* ── Helpers ── */
function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100)
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(iso))
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const map: Record<string, { variant: 'success' | 'error' | 'warning' | 'info'; label: string }> = {
    success: { variant: 'success', label: 'Success' },
    failed: { variant: 'error', label: 'Failed' },
    pending: { variant: 'warning', label: 'Pending' },
    refunded: { variant: 'info', label: 'Refunded' },
  }
  const cfg = map[status] || { variant: 'info', label: status }

  return (
    <span aria-label={`Status: ${cfg.label}`}>
      <Badge variant={cfg.variant} dot>
        {cfg.label}
      </Badge>
    </span>
  )
}

export default function TransactionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toasts, success, error, close } = useToast()

  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const decodedId = id ? decodeURIComponent(id) : ''

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [refundOpen, setRefundOpen] = useState(false)
  const [rawOpen, setRawOpen] = useState(false)

  const load = async () => {
    if (!decodedId) return
    setLoading(true)
    setLoadError(null)
    try {
      const data = await fetchTransactionById(decodedId)
      if (!data) {
        setLoadError('Transaction not found')
      } else {
        setTransaction(data)
      }
    } catch (err) {
      setLoadError('Failed to load transaction details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedId])

  const handleCopyId = () => {
    if (!transaction) return
    navigator.clipboard.writeText(transaction.id)
    success('Copied', 'Transaction ID copied to clipboard')
  }

  const handleRefundConfirm = async (req: { amountCents: number; reason: any }) => {
    if (!transaction) return
    try {
      const updated = await refundTransaction(transaction.id, req)
      setTransaction(updated)
      success('Refund successful', 'The transaction has been refunded.')
    } catch (e) {
      error('Refund failed', 'Unable to process refund. Please try again.')
      throw e
    }
  }

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="flex flex-col gap-[var(--space-6)]">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-[var(--space-4)]">
          <Skeleton variant="text" width={60} />
          <div className="flex items-center justify-between">
            <Skeleton variant="text" width={200} height={36} />
            <div className="flex gap-2">
              <Skeleton variant="text" width={100} height={36} />
            </div>
          </div>
        </div>
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 gap-[var(--space-6)] xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Skeleton variant="card" height={300} />
          </div>
          <div className="xl:col-span-1">
            <Skeleton variant="card" height={300} />
          </div>
        </div>
      </div>
    )
  }

  /* ── Error State ── */
  if (loadError || !transaction) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-[var(--space-4)] text-center">
        <div className="rounded-full bg-[var(--color-error-light)] p-4">
          <svg className="h-8 w-8 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-[var(--font-xl)] font-semibold text-[var(--color-gray-900)]">
          {loadError || 'Transaction not found'}
        </h2>
        <div className="flex gap-[var(--space-4)]">
          <Button variant="ghost" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={load}>Retry</Button>
        </div>
      </div>
    )
  }

  /* ── Normal State ── */
  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <ToastContainer toasts={toasts} onClose={close} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[var(--font-sm)] text-[var(--color-gray-500)]">
        <span className="hover:text-[var(--color-gray-700)]">Transactions</span>
        <span className="text-[var(--color-gray-300)]">/</span>
        <span className="font-mono text-[var(--color-gray-900)]">{transaction.id}</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col gap-[var(--space-4)] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => router.back()}
            className="mb-2 flex w-fit items-center gap-1 text-[var(--font-sm)] text-[var(--color-gray-500)] hover:text-[var(--color-gray-900)]"
            aria-label="Back to transaction list"
          >
            {BackIcon} Back
          </button>
          <div className="flex items-center gap-[var(--space-4)]">
            <h1 className="text-[var(--font-3xl)] font-bold text-[var(--color-gray-900)]">
              {formatMoney(transaction.amountCents, transaction.currency)}
            </h1>
            <StatusBadge status={transaction.status} />
          </div>
          <div className="flex items-center gap-2 text-[var(--font-sm)] text-[var(--color-gray-500)]">
            <span className="font-mono">{transaction.id}</span>
            <button
              onClick={handleCopyId}
              className="flex items-center justify-center rounded-[var(--radius-sm)] p-1 hover:bg-[var(--color-gray-100)] hover:text-[var(--color-primary-600)]"
              aria-label="Copy Transaction ID"
              title="Copy ID"
            >
              {CopyIcon}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-[var(--space-3)]">
          {transaction.status === 'success' && (
            <Button variant="secondary" icon={RefundIcon} onClick={() => setRefundOpen(true)}>
              Refund
            </Button>
          )}
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 gap-[var(--space-6)] xl:grid-cols-3">
        {/* Summary Card */}
        <section className="rounded-[var(--radius-lg)] bg-[var(--color-white)] p-[var(--space-6)] shadow-[var(--shadow-sm)] xl:col-span-2">
          <h2 className="mb-[var(--space-4)] text-[var(--font-lg)] font-semibold text-[var(--color-gray-900)]">
            Summary
          </h2>
          <div className="flex flex-col">
            {[
              { label: 'Merchant', value: <span className="text-[var(--color-primary-600)] cursor-pointer hover:underline">{transaction.merchantName}</span> },
              { label: 'Date & Time', value: formatDateTime(transaction.createdAt) },
              { label: 'Payment Method', value: transaction.method },
              { label: 'Network', value: transaction.network },
              { label: 'Amount', value: formatMoney(transaction.amountCents, transaction.currency) },
              { label: 'Fee', value: formatMoney(transaction.feeCents, transaction.currency) },
              { label: 'Net Amount', value: <span className="font-medium text-[var(--color-gray-900)]">{formatMoney(transaction.netCents, transaction.currency)}</span> },
            ].map((row, i) => (
              <div
                key={row.label}
                className="flex h-[36px] items-center justify-between border-b border-[var(--color-gray-100)] last:border-0"
              >
                <span className="text-[var(--font-sm)] text-[var(--color-gray-500)]">{row.label}</span>
                <span className="text-[var(--font-sm)] text-[var(--color-gray-700)]">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Card */}
        <section className="rounded-[var(--radius-lg)] bg-[var(--color-white)] p-[var(--space-6)] shadow-[var(--shadow-sm)] xl:col-span-1">
          <h2 className="mb-[var(--space-4)] text-[var(--font-lg)] font-semibold text-[var(--color-gray-900)]">
            Timeline
          </h2>
          <TransactionTimeline events={transaction.timeline} />
        </section>
      </div>

      {/* Raw Data */}
      <section className="rounded-[var(--radius-lg)] bg-[var(--color-white)] shadow-[var(--shadow-sm)]">
        <button
          onClick={() => setRawOpen(!rawOpen)}
          className="flex w-full items-center justify-between px-[var(--space-6)] py-[var(--space-4)] text-[var(--font-base)] font-medium text-[var(--color-gray-900)] hover:bg-[var(--color-gray-50)]"
          aria-expanded={rawOpen}
        >
          <span>Raw Data</span>
          {rawOpen ? ChevronDownIcon : ChevronRightIcon}
        </button>
        {rawOpen && (
          <div className="border-t border-[var(--color-gray-200)] p-[var(--space-6)]">
            <pre className="overflow-x-auto rounded-[var(--radius-md)] bg-[var(--color-gray-900)] p-[var(--space-4)] font-mono text-[var(--font-xs)] text-[var(--color-gray-100)]">
              {JSON.stringify(transaction.raw, null, 2)}
            </pre>
          </div>
        )}
      </section>

      {/* Refund Dialog */}
      <RefundDialog
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        originalAmountCents={transaction.amountCents}
        currency={transaction.currency}
        onConfirm={handleRefundConfirm}
      />
    </div>
  )
}
