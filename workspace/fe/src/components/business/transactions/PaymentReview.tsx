'use client'

import { Button, Dialog } from '../../design'
import type { CreatePaymentPayload, Merchant } from './types'

export interface PaymentReviewProps {
  value: CreatePaymentPayload
  merchant: Merchant | null
  disabled?: boolean
  dirty?: boolean
  onBack: () => void
  onCancel: () => void
  onConfirmCancel: () => void
  cancelConfirmOpen: boolean
  onSubmit: () => void
  submitting?: boolean
}

const WarningIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

const BackIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)

function maskCard(num: string) {
  const digits = num.replace(/\D/g, '')
  const last4 = digits.slice(-4)
  return last4 ? `•••• ${last4}` : ''
}

export function PaymentReview({
  value,
  merchant,
  disabled,
  dirty,
  onBack,
  onCancel,
  onConfirmCancel,
  cancelConfirmOpen,
  onSubmit,
  submitting,
}: PaymentReviewProps) {
  const merchantLabel = merchant ? `${merchant.name} (${merchant.id})` : value.merchantId
  const amount = (value.amountCents / 100).toFixed(2)

  const rows: Array<{ label: string; value: string }> = [
    { label: 'Merchant', value: merchantLabel },
    { label: 'Amount', value: `${amount} ${value.currency}` },
    { label: 'Reference', value: value.referenceId || '—' },
    { label: 'Description', value: value.description || '—' },
  ]

  const methodRows: Array<{ label: string; value: string }> = [
    {
      label: 'Method',
      value:
        value.method === 'card'
          ? 'Card'
          : value.method === 'bank_transfer'
            ? 'Bank Transfer'
            : 'E-Wallet',
    },
  ]

  if (value.method === 'card') {
    methodRows.push({
      label: 'Card',
      value: `${maskCard(value.card?.number ?? '')}`,
    })
    methodRows.push({ label: 'Cardholder', value: value.card?.cardholder ?? '—' })
  }

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <section className="rounded-[var(--radius-lg)] bg-[var(--color-white)] p-[var(--space-6)] shadow-[var(--shadow-sm)]">
        <h2 className="mb-[var(--space-4)] text-[var(--font-xl)] font-semibold text-[var(--color-gray-900)]">
          Review Payment
        </h2>

        <div className="text-[var(--font-sm)] font-medium uppercase tracking-[0.05em] text-[var(--color-gray-500)]">
          Payment Summary
        </div>
        <div className="mt-[var(--space-3)] flex flex-col">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex h-9 items-center justify-between border-b border-[var(--color-gray-100)] last:border-0"
            >
              <span className="w-[40%] text-[var(--font-sm)] text-[var(--color-gray-500)]">{r.label}</span>
              <span className="w-[60%] text-right text-[var(--font-sm)] text-[var(--color-gray-700)]">
                {r.label === 'Amount' ? (
                  <span className="text-[var(--font-lg)] font-semibold text-[var(--color-gray-900)]">
                    {r.value}
                  </span>
                ) : (
                  r.value
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="my-[var(--space-6)] h-px w-full bg-[var(--color-gray-100)]" />

        <div className="text-[var(--font-sm)] font-medium uppercase tracking-[0.05em] text-[var(--color-gray-500)]">
          Payment Method
        </div>
        <div className="mt-[var(--space-3)] flex flex-col">
          {methodRows.map((r) => (
            <div
              key={r.label}
              className="flex h-9 items-center justify-between border-b border-[var(--color-gray-100)] last:border-0"
            >
              <span className="w-[40%] text-[var(--font-sm)] text-[var(--color-gray-500)]">{r.label}</span>
              <span className="w-[60%] text-right text-[var(--font-sm)] text-[var(--color-gray-700)]">
                {r.value}
              </span>
            </div>
          ))}
        </div>

        {value.metadata.length > 0 && (
          <>
            <div className="my-[var(--space-6)] h-px w-full bg-[var(--color-gray-100)]" />
            <div className="text-[var(--font-sm)] font-medium uppercase tracking-[0.05em] text-[var(--color-gray-500)]">
              Metadata
            </div>
            <div className="mt-[var(--space-3)] flex flex-col">
              {value.metadata.map((m) => (
                <div
                  key={m.key}
                  className="flex h-9 items-center justify-between border-b border-[var(--color-gray-100)] last:border-0"
                >
                  <span className="w-[40%] text-[var(--font-sm)] text-[var(--color-gray-500)] font-mono">
                    {m.key}
                  </span>
                  <span className="w-[60%] text-right text-[var(--font-sm)] text-[var(--color-gray-700)]">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <div
          className="mt-[var(--space-6)] flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--color-warning-light)] p-[var(--space-3)] text-[var(--color-warning)]"
          role="note"
        >
          <span className="mt-0.5" aria-hidden="true">
            {WarningIcon}
          </span>
          <div className="text-[var(--font-sm)]">
            Please verify the details before submitting.
          </div>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-[var(--space-3)]">
        <Button variant="ghost" icon={BackIcon} onClick={onBack} disabled={disabled || submitting}>
          Back to Edit
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={disabled || submitting}>
          Cancel
        </Button>
        <Button onClick={onSubmit} loading={!!submitting} disabled={disabled || submitting} aria-busy={submitting}>
          Submit Payment
        </Button>
      </div>

      <Dialog
        open={cancelConfirmOpen}
        onClose={onCancel}
        variant="confirm"
        title="Discard changes?"
        footer={
          <>
            <Button variant="ghost" onClick={onCancel}>
              Keep editing
            </Button>
            <Button variant="danger" onClick={onConfirmCancel}>
              Discard
            </Button>
          </>
        }
      >
        <div className="text-[var(--font-base)] text-[var(--color-text-secondary)]">
          {dirty ? 'You have unsaved changes. Are you sure you want to discard them?' : 'Discard this payment draft?'}
        </div>
      </Dialog>
    </div>
  )
}

export default PaymentReview

