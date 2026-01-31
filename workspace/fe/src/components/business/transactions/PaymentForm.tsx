'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, Dialog, Input, Select, Textarea } from '../../design'
import type { SelectOption } from '../../design'
import type {
  CardDetails,
  CreatePaymentPayload,
  Merchant,
  MetadataItem,
  PaymentMethod,
} from './types'

export type PaymentFormErrors = Partial<Record<keyof CreatePaymentPayload | 'card.number' | 'card.expiry' | 'card.cvv' | 'card.cardholder' | 'metadata', string>>

export interface PaymentFormProps {
  value: CreatePaymentPayload
  merchants: Merchant[]
  merchantsLoading: boolean
  merchantsError?: string | null
  disabled?: boolean
  errors?: PaymentFormErrors
  dirty?: boolean
  onChange: (next: CreatePaymentPayload) => void
  onValidateField?: (field: string) => void
  onRetryMerchants?: () => void
  onCancel: () => void
  onConfirmCancel: () => void
  cancelConfirmOpen: boolean
  onContinue: () => void
}

const PlusIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const TrashIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
  </svg>
)

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 19)
  const parts: string[] = []
  for (let i = 0; i < digits.length; i += 4) parts.push(digits.slice(i, i + 4))
  return parts.join(' ')
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function detectBrand(num: string): 'visa' | 'mastercard' | 'amex' | 'unknown' {
  const n = num.replace(/\s/g, '')
  if (/^4\d{0,}$/.test(n)) return 'visa'
  if (/^(5[1-5]|2[2-7])\d{0,}$/.test(n)) return 'mastercard'
  if (/^3[47]\d{0,}$/.test(n)) return 'amex'
  return 'unknown'
}

function BrandIcon({ brand }: { brand: ReturnType<typeof detectBrand> }) {
  if (brand === 'unknown') return null
  const label = brand === 'amex' ? 'Amex' : brand === 'mastercard' ? 'Mastercard' : 'Visa'
  return (
    <span
      className="text-[12px] font-medium text-[var(--color-text-tertiary)]"
      aria-label={label}
    >
      {label}
    </span>
  )
}

function getCurrencySymbol(code: string) {
  const map: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CNY: '¥', JPY: '¥' }
  return map[code] ?? '$'
}

export function PaymentForm({
  value,
  merchants,
  merchantsLoading,
  merchantsError,
  disabled = false,
  errors,
  dirty,
  onChange,
  onValidateField,
  onRetryMerchants,
  onCancel,
  onConfirmCancel,
  cancelConfirmOpen,
  onContinue,
}: PaymentFormProps) {
  const selectedMerchant = useMemo(
    () => merchants.find((m) => m.id === value.merchantId) ?? null,
    [merchants, value.merchantId],
  )

  /* ── Merchant search debounce (300ms) ── */
  const [merchantSearch, setMerchantSearch] = useState('')
  const [merchantSearchDebounced, setMerchantSearchDebounced] = useState('')
  useEffect(() => {
    const t = window.setTimeout(() => setMerchantSearchDebounced(merchantSearch), 300)
    return () => window.clearTimeout(t)
  }, [merchantSearch])

  const merchantOptions = useMemo<SelectOption[]>(() => {
    const kw = merchantSearchDebounced.trim().toLowerCase()
    const filtered = kw
      ? merchants.filter(
          (m) => m.name.toLowerCase().includes(kw) || m.id.toLowerCase().includes(kw),
        )
      : merchants

    return filtered.map((m) => ({
      value: m.id,
      label: `${m.name}  (${m.id})`,
    }))
  }, [merchants, merchantSearchDebounced])

  const currencyOptions = useMemo<SelectOption[]>(() => {
    const list = selectedMerchant?.currencies?.length ? selectedMerchant.currencies : ['USD']
    return list.map((c) => ({ value: c, label: c }))
  }, [selectedMerchant])

  const methodOptions: SelectOption[] = [
    { value: 'card', label: 'Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'e_wallet', label: 'E-Wallet' },
  ]

  const amountStr = useMemo(() => {
    if (!value.amountCents) return ''
    return (value.amountCents / 100).toFixed(2)
  }, [value.amountCents])

  const brand = detectBrand(value.card?.number ?? '')

  const setCard = (next: Partial<CardDetails>) => {
    const current: CardDetails = value.card ?? { number: '', expiry: '', cvv: '', cardholder: '' }
    onChange({ ...value, card: { ...current, ...next } })
  }

  const updateMetadata = (items: MetadataItem[]) => {
    onChange({ ...value, metadata: items })
  }

  const canAddMetadata = value.metadata.length < 10

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      {/* Form Card */}
      <section className="rounded-[var(--radius-lg)] bg-[var(--color-white)] p-[var(--space-6)] shadow-[var(--shadow-sm)]">
        <h2 className="mb-[var(--space-4)] text-[var(--font-lg)] font-semibold text-[var(--color-gray-900)]">
          Payment Details
        </h2>

        <form aria-label="Create payment form" className="flex flex-col gap-[var(--space-4)]">
          {/* Merchant */}
          <div className="flex flex-col gap-1">
            <label className="text-[var(--font-sm)] font-medium text-[var(--color-gray-700)]">
              Merchant <span className="text-[var(--color-error)]">*</span>
            </label>
            <Select
              variant="searchable"
              fullWidth
              placeholder={merchantsLoading ? 'Loading merchants…' : 'Select merchant'}
              options={merchantOptions}
              value={value.merchantId}
              onChange={(v) => {
                const merchantId = String(v ?? '')
                const m = merchants.find((x) => x.id === merchantId)
                onChange({
                  ...value,
                  merchantId,
                  currency: m?.defaultCurrency ?? value.currency,
                })
              }}
              loading={merchantsLoading}
              error={!!errors?.merchantId}
              errorMessage={errors?.merchantId}
              emptyText={merchantsError ? 'Failed to load merchants' : 'No merchants found'}
              onSearch={(kw) => setMerchantSearch(kw)}
              disabled={disabled}
            />
            {merchantsError && onRetryMerchants && (
              <button
                type="button"
                onClick={onRetryMerchants}
                className="w-fit text-[var(--font-xs)] text-[var(--color-primary-600)] hover:underline"
                disabled={disabled}
              >
                Retry
              </button>
            )}
          </div>

          {/* Amount composite */}
          <div className="flex flex-col gap-1">
            <label className="text-[var(--font-sm)] font-medium text-[var(--color-gray-700)]">
              Amount <span className="text-[var(--color-error)]">*</span>
            </label>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="flex w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-primary)] bg-[var(--color-bg-container)] md:flex-1">
                <span className="flex h-10 w-10 items-center justify-center border-r border-[var(--color-border-primary)] bg-[var(--color-gray-50)] text-[var(--color-gray-500)]">
                  {getCurrencySymbol(value.currency)}
                </span>
                <input
                  value={amountStr}
                  disabled={disabled}
                  onChange={(e) => {
                    const nextRaw = e.target.value
                    const cleaned = nextRaw.replace(/[^\d.]/g, '')
                    const num = Number(cleaned)
                    if (Number.isNaN(num)) {
                      onChange({ ...value, amountCents: 0 })
                      return
                    }
                    const cents = Math.round(num * 100)
                    onChange({ ...value, amountCents: cents })
                  }}
                  onBlur={() => onValidateField?.('amountCents')}
                  inputMode="decimal"
                  className={[
                    'h-10 flex-1 bg-transparent px-3 text-right font-mono text-[16px] outline-none',
                    errors?.amountCents ? 'ring-2 ring-[var(--color-error-light)]' : '',
                    disabled ? 'cursor-not-allowed text-[var(--color-text-disabled)]' : '',
                  ].join(' ')}
                  aria-invalid={!!errors?.amountCents || undefined}
                />
              </div>
              <div className="w-full md:w-20">
                <Select
                  fullWidth
                  options={currencyOptions}
                  value={value.currency}
                  onChange={(v) => onChange({ ...value, currency: String(v ?? '') })}
                  disabled={disabled || !selectedMerchant}
                  error={!!errors?.currency}
                  errorMessage={errors?.currency}
                />
              </div>
            </div>
            {errors?.amountCents && (
              <span className="text-[var(--font-xs)] text-[var(--color-error)]" role="alert">
                {errors.amountCents}
              </span>
            )}
          </div>

          {/* Reference + Description */}
          <div className="grid grid-cols-1 gap-[var(--space-4)] md:grid-cols-2">
            <Input
              fullWidth
              label="Reference ID"
              placeholder="Auto or manual"
              value={value.referenceId}
              disabled={disabled}
              onChange={(e) => onChange({ ...value, referenceId: e.target.value })}
              onBlur={() => onValidateField?.('referenceId')}
              error={!!errors?.referenceId}
              errorMessage={errors?.referenceId}
            />
            <div className="md:col-span-1" />
          </div>
          <Textarea
            fullWidth
            label="Description"
            placeholder="Payment description"
            value={value.description}
            disabled={disabled}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            onBlur={() => onValidateField?.('description')}
            error={!!errors?.description}
            errorMessage={errors?.description}
          />

          <div className="my-[var(--space-6)] h-px w-full bg-[var(--color-gray-100)]" />

          <div className="text-[var(--font-sm)] font-medium uppercase tracking-[0.05em] text-[var(--color-gray-500)]">
            Payment Method
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[var(--font-sm)] font-medium text-[var(--color-gray-700)]">
              Method <span className="text-[var(--color-error)]">*</span>
            </label>
          <Select
            fullWidth
            options={methodOptions}
            value={value.method}
            onChange={(v) => onChange({ ...value, method: v as PaymentMethod })}
            disabled={disabled}
            error={!!errors?.method}
            errorMessage={errors?.method}
          />
          </div>

          {/* Card details (conditional) */}
          <div
            className={[
              'overflow-hidden transition-all duration-200 ease-in-out',
              value.method === 'card' ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0',
            ].join(' ')}
            aria-hidden={value.method !== 'card'}
          >
            <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-4)]">
              <div className="text-[var(--font-sm)] font-medium uppercase tracking-[0.05em] text-[var(--color-gray-500)]">
                Card Details
              </div>
              <Input
                fullWidth
                label="Card Number *"
                placeholder="•••• •••• •••• ••••"
                value={value.card?.number ?? ''}
                disabled={disabled}
                onChange={(e) => setCard({ number: formatCardNumber(e.target.value) })}
                onBlur={() => onValidateField?.('card.number')}
                error={!!errors?.['card.number']}
                errorMessage={errors?.['card.number']}
                inputMode="numeric"
                autoComplete="cc-number"
                iconRight={<BrandIcon brand={brand} />}
              />
              <div className="grid grid-cols-1 gap-[var(--space-4)] md:grid-cols-3">
                <Input
                  fullWidth
                  label="Expiry *"
                  placeholder="MM/YY"
                  value={value.card?.expiry ?? ''}
                  disabled={disabled}
                  onChange={(e) => setCard({ expiry: formatExpiry(e.target.value) })}
                  onBlur={() => onValidateField?.('card.expiry')}
                  error={!!errors?.['card.expiry']}
                  errorMessage={errors?.['card.expiry']}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                />
                <Input
                  fullWidth
                  label="CVV *"
                  placeholder="•••"
                  type="password"
                  value={value.card?.cvv ?? ''}
                  disabled={disabled}
                  onChange={(e) => setCard({ cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  onBlur={() => onValidateField?.('card.cvv')}
                  error={!!errors?.['card.cvv']}
                  errorMessage={errors?.['card.cvv']}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                />
                <Input
                  fullWidth
                  label="Cardholder *"
                  placeholder="Name on card"
                  value={value.card?.cardholder ?? ''}
                  disabled={disabled}
                  onChange={(e) => setCard({ cardholder: e.target.value })}
                  onBlur={() => onValidateField?.('card.cardholder')}
                  error={!!errors?.['card.cardholder']}
                  errorMessage={errors?.['card.cardholder']}
                  autoComplete="cc-name"
                />
              </div>
            </div>
          </div>

          <div className="my-[var(--space-6)] h-px w-full bg-[var(--color-gray-100)]" />

          <div className="flex items-center justify-between">
            <div className="text-[var(--font-sm)] font-medium uppercase tracking-[0.05em] text-[var(--color-gray-500)]">
              Metadata (Optional)
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={PlusIcon}
              onClick={() => {
                if (!canAddMetadata) return
                updateMetadata([...value.metadata, { key: '', value: '' }])
              }}
              disabled={disabled || !canAddMetadata}
            >
              Add metadata
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {value.metadata.length === 0 && (
              <div className="text-[var(--font-xs)] text-[var(--color-gray-500)]">No metadata</div>
            )}
            {value.metadata.map((row, idx) => (
              <div key={idx} className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="md:w-[40%]">
                  <Input
                    fullWidth
                    placeholder="key"
                    value={row.key}
                    disabled={disabled}
                    onChange={(e) => {
                      const next = [...value.metadata]
                      next[idx] = { ...next[idx], key: e.target.value }
                      updateMetadata(next)
                    }}
                    onBlur={() => onValidateField?.('metadata')}
                  />
                </div>
                <div className="md:w-[50%]">
                  <Input
                    fullWidth
                    placeholder="value"
                    value={row.value}
                    disabled={disabled}
                    onChange={(e) => {
                      const next = [...value.metadata]
                      next[idx] = { ...next[idx], value: e.target.value }
                      updateMetadata(next)
                    }}
                    onBlur={() => onValidateField?.('metadata')}
                  />
                </div>
                <div className="md:w-[10%] md:flex md:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const next = value.metadata.filter((_, i) => i !== idx)
                      updateMetadata(next)
                    }}
                    disabled={disabled}
                    className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-gray-400)] hover:bg-[var(--color-gray-50)] hover:text-[var(--color-error)] disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Delete metadata row"
                  >
                    {TrashIcon}
                  </button>
                </div>
              </div>
            ))}
            {errors?.metadata && (
              <span className="text-[var(--font-xs)] text-[var(--color-error)]" role="alert">
                {errors.metadata}
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-[var(--space-3)]">
        <Button variant="ghost" onClick={onCancel} disabled={disabled}>
          Cancel
        </Button>
        <Button onClick={onContinue} disabled={disabled}>
          Continue to Review →
        </Button>
      </div>

      {/* Cancel confirmation */}
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

export default PaymentForm
