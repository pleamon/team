'use client'

import { useMemo } from 'react'
import { Button, Empty, Skeleton } from '../../design'
import type { PaymentResult, PaymentResultStatus } from './types'

const CheckIcon = (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const XIcon = (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ClockIcon = (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CopyIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
    />
  </svg>
)

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100)
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

function methodLabel(r: PaymentResult) {
  if (r.method === 'card') {
    const num = r.payload?.card?.number ?? ''
    const last4 = num.replace(/\D/g, '').slice(-4)
    return last4 ? `Card •••• ${last4}` : 'Card'
  }
  return r.method === 'bank_transfer' ? 'Bank Transfer' : 'E-Wallet'
}

export interface PaymentResultProps {
  loading: boolean
  error?: string | null
  result?: PaymentResult | null
  countdownSeconds?: number
  timedOut?: boolean
  onManualRefresh?: () => void
  onRetryFetch?: () => void
  onCopyId?: (id: string) => void
  onNavigateView?: (id: string) => void
  onNavigateList?: () => void
  onNavigateNew?: (opts?: { prefill?: any }) => void
}

export function PaymentResultCard({
  loading,
  error,
  result,
  countdownSeconds,
  timedOut,
  onManualRefresh,
  onRetryFetch,
  onCopyId,
  onNavigateView,
  onNavigateList,
  onNavigateNew,
}: PaymentResultProps) {
  const status: PaymentResultStatus | null = result?.status ?? null

  const statusCfg = useMemo(() => {
    if (status === 'success') return { title: 'Payment Successful', color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: CheckIcon }
    if (status === 'failed') return { title: 'Payment Failed', color: 'var(--color-error)', bg: 'var(--color-error-light)', icon: XIcon }
    return { title: 'Payment Processing', color: 'var(--color-warning)', bg: 'var(--color-warning-light)', icon: ClockIcon }
  }, [status])

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[560px] rounded-[var(--radius-lg)] bg-[var(--color-white)] p-[var(--space-8)] shadow-[var(--shadow-sm)]">
        <div className="flex flex-col items-center gap-[var(--space-4)]">
          <Skeleton variant="avatar" size="lg" />
          <Skeleton variant="text" width={220} height={24} />
          <Skeleton variant="text" width={180} height={34} />
          <div className="w-full">
            <Skeleton variant="text" width={320} />
            <Skeleton variant="text" width={260} />
            <Skeleton variant="text" width={300} />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-[var(--space-6)]">
        <Empty
          variant="error-network"
          title="Unable to load payment result"
          description={error}
          action={
            <div className="flex gap-[var(--space-3)]">
              <Button onClick={onRetryFetch}>Retry</Button>
              <Button variant="ghost" onClick={onNavigateList}>
                Back to Transactions
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  if (!result) return null

  const amountText = `${formatMoney(result.amountCents, result.currency)} ${result.currency}`
  const infoRows = [
    {
      label: 'Transaction ID',
      value: (
        <span className="inline-flex items-center gap-2 font-mono text-[var(--color-gray-500)]">
          {result.id}
          <button
            type="button"
            onClick={() => onCopyId?.(result.id)}
            className="flex items-center justify-center rounded-[var(--radius-sm)] p-1 text-[var(--color-gray-400)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-primary-600)]"
            aria-label="Copy transaction ID"
            title="Copy ID"
          >
            {CopyIcon}
          </button>
        </span>
      ),
    },
    { label: 'Merchant', value: <span className="text-[var(--color-gray-700)]">{result.merchantName}</span> },
    { label: 'Time', value: <span className="text-[var(--color-gray-500)]">{formatDateTime(result.createdAt)}</span> },
  ]

  const showSummary = result.status === 'success'
  const showError = result.status === 'failed'

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); }
          to { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @keyframes spin1500 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        className="mx-auto w-full max-w-[560px] rounded-[var(--radius-lg)] bg-[var(--color-white)] p-[var(--space-8)] text-center shadow-[var(--shadow-sm)]"
        role="status"
        aria-live="polite"
      >
        {/* Icon */}
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: statusCfg.bg, animation: `fadeIn 300ms ease both` }}
          aria-hidden="true"
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              color: statusCfg.color,
              animation:
                status === 'success'
                  ? `scaleIn 300ms ease both`
                  : status === 'failed'
                    ? `shake 200ms ease both`
                    : `spin1500 1500ms linear infinite`,
            }}
          >
            {statusCfg.icon}
          </div>
        </div>

        {/* Title */}
        <div
          className="mt-[var(--space-4)] text-[var(--font-xl)] font-semibold"
          style={{ color: statusCfg.color, animation: `fadeIn 300ms ease 100ms both` }}
        >
          {statusCfg.title}
        </div>

        {status === 'pending' && (
          <div
            className="mt-2 text-[var(--font-sm)] text-[var(--color-gray-500)]"
            style={{ animation: `fadeIn 300ms ease 200ms both` }}
          >
            This may take a few moments...
          </div>
        )}

        {/* Amount */}
        <div
          className="mt-[var(--space-2)] font-mono text-[var(--font-3xl)] font-bold text-[var(--color-gray-900)]"
          style={{ animation: `fadeIn 300ms ease 200ms both` }}
        >
          {amountText}
        </div>

        {showError && result.error && (
          <div
            className="mt-[var(--space-6)] rounded-[var(--radius-md)] border border-[var(--color-error-light)] bg-[var(--color-error-light)] p-[var(--space-3)] text-left"
            style={{ animation: `fadeIn 300ms ease 300ms both` }}
          >
            <div className="text-[var(--font-sm)] text-[var(--color-error)]">
              Error: {result.error.message}
            </div>
            <div className="mt-1 font-mono text-[var(--font-xs)] text-[var(--color-gray-500)]">({result.error.code})</div>
          </div>
        )}

        {/* Info */}
        <div
          className="mt-[var(--space-6)] flex flex-col gap-2 text-left"
          style={{ animation: `fadeIn 300ms ease 300ms both` }}
        >
          {infoRows.map((r) => (
            <div key={r.label} className="flex items-start justify-between gap-3">
              <span className="text-[var(--font-sm)] text-[var(--color-gray-500)]">{r.label}:</span>
              <span className="text-[var(--font-sm)] text-[var(--color-gray-700)]">{r.value}</span>
            </div>
          ))}
        </div>

        {/* Pending auto-refresh */}
        {result.status === 'pending' && (
          <div className="mt-[var(--space-4)] text-[var(--font-xs)] text-[var(--color-gray-500)]">
            {timedOut ? (
              <div className="flex flex-col items-center gap-2">
                <div>Taking longer than expected.</div>
                <Button variant="secondary" size="sm" onClick={onManualRefresh}>
                  Refresh
                </Button>
              </div>
            ) : (
              <div aria-live="polite">Auto-refreshing in {countdownSeconds ?? 5}s...</div>
            )}
          </div>
        )}

        {/* Quick Summary */}
        {showSummary && (
          <>
            <div className="my-[var(--space-6)] h-px w-full bg-[var(--color-gray-100)]" />
            <div className="text-left">
              <div className="text-[var(--font-sm)] font-medium uppercase tracking-[0.05em] text-[var(--color-gray-500)]">
                Quick Summary
              </div>
              <div className="mt-[var(--space-3)]">
                {[
                  { label: 'Method', value: methodLabel(result) },
                  { label: 'Reference', value: result.referenceId || '—' },
                  { label: 'Fee', value: result.feeCents != null ? formatMoney(result.feeCents, result.currency) : '—' },
                  {
                    label: 'Net Amount',
                    value: result.netCents != null ? formatMoney(result.netCents, result.currency) : '—',
                    strong: true,
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex h-9 items-center justify-between border-b border-[var(--color-gray-100)] last:border-0"
                  >
                    <span className="text-[var(--font-sm)] text-[var(--color-gray-500)]">{r.label}</span>
                    <span
                      className={[
                        'text-[var(--font-sm)] text-[var(--color-gray-700)]',
                        r.strong ? 'font-semibold text-[var(--color-gray-900)]' : '',
                      ].join(' ')}
                    >
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="mt-[var(--space-8)] flex flex-col items-stretch justify-center gap-[var(--space-3)] sm:flex-row">
        {result.status === 'success' && (
          <>
            <Button onClick={() => onNavigateView?.(result.id)}>View Transaction</Button>
            <Button variant="secondary" onClick={() => onNavigateNew?.({})}>
              Create Another
            </Button>
            <Button variant="ghost" onClick={onNavigateList}>
              ← List
            </Button>
          </>
        )}
        {result.status === 'failed' && (
          <>
            <Button onClick={() => onNavigateNew?.({ prefill: result.payload })}>Retry Payment</Button>
            <Button variant="secondary" onClick={() => onNavigateView?.(result.id)}>
              View Details
            </Button>
            <Button variant="ghost" onClick={onNavigateList}>
              ← List
            </Button>
          </>
        )}
        {result.status === 'pending' && (
          <>
            <Button onClick={() => onNavigateView?.(result.id)}>View Transaction</Button>
            <Button variant="ghost" onClick={onNavigateList}>
              ← Back to List
            </Button>
          </>
        )}
      </div>
    </>
  )
}

export default PaymentResultCard
