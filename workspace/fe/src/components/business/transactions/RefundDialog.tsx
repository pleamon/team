'use client'

import { useMemo, useState } from 'react'
import { Button, Dialog, Input, Select } from '../../design'
import type { SelectOption } from '../../design'
import type { RefundRequest } from './types'

export interface RefundDialogProps {
  open: boolean
  onClose: () => void
  originalAmountCents: number
  currency: string
  onConfirm: (req: RefundRequest) => Promise<void> | void
}

function formatMoney(amountCents: number, currency: string) {
  const value = amountCents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const reasonOptions: SelectOption[] = [
  { value: 'customer_request', label: 'Customer Request' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'fraud', label: 'Fraud' },
  { value: 'other', label: 'Other' },
]

export function RefundDialog({
  open,
  onClose,
  originalAmountCents,
  currency,
  onConfirm,
}: RefundDialogProps) {
  const [amount, setAmount] = useState(() => String((originalAmountCents / 100).toFixed(2)))
  const [reason, setReason] = useState<RefundRequest['reason'] | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)

  const parsed = useMemo(() => {
    const num = Number(amount)
    if (!Number.isFinite(num)) return null
    const cents = Math.round(num * 100)
    return cents
  }, [amount])

  const validation = useMemo(() => {
    if (!touched) return null
    if (parsed == null) return 'Enter a valid amount'
    if (parsed <= 0) return 'Amount must be greater than 0'
    if (parsed > originalAmountCents) return 'Amount cannot exceed original amount'
    return null
  }, [parsed, originalAmountCents, touched])

  const canSubmit = parsed != null && parsed > 0 && parsed <= originalAmountCents && !!reason && !submitting

  const handleConfirm = async () => {
    setTouched(true)
    if (!canSubmit || parsed == null || !reason) return
    setSubmitting(true)
    try {
      await onConfirm({ amountCents: parsed, reason })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={submitting ? () => {} : onClose}
      title="Refund Transaction"
      variant="confirm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={!canSubmit} loading={submitting}>
            Confirm Refund
          </Button>
        </>
      }
    >
      <div className="space-y-[var(--space-4)]">
        <div>
          <div className="text-[var(--font-sm)] text-[var(--color-gray-700)] font-medium">Amount</div>
          <div className="mt-2">
            <Input
              size="sm"
              fullWidth
              value={amount}
              onChange={(e) => {
                setTouched(true)
                setAmount(e.target.value)
              }}
              placeholder={formatMoney(originalAmountCents, currency)}
              error={!!validation}
              errorMessage={validation ?? undefined}
            />
          </div>
          <div className="mt-2 text-[var(--font-xs)] text-[var(--color-gray-500)]">
            Original: {formatMoney(originalAmountCents, currency)}
          </div>
        </div>

        <div>
          <div className="text-[var(--font-sm)] text-[var(--color-gray-700)] font-medium">Reason</div>
          <div className="mt-2">
            <Select
              size="sm"
              fullWidth
              placeholder="Select a reason"
              options={reasonOptions}
              value={reason ?? undefined}
              onChange={(v) => setReason((v as any) ?? null)}
              clearable
            />
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] bg-[var(--color-error-light)] px-[var(--space-4)] py-[var(--space-3)]">
          <div className="text-[var(--font-sm)] text-[var(--color-gray-700)]">
            This action cannot be undone.
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default RefundDialog

