'use client'

import { useEffect, useMemo, useState } from 'react'
import { Input, Select } from '../../design'
import type { SelectOption } from '../../design'
import type { TransactionFilters, TransactionStatusTab } from './types'
import { listMerchants } from '../../../services/transactions'

export interface TransactionFiltersProps {
  value: TransactionFilters
  onChange: (next: TransactionFilters) => void
  disabled?: boolean
  onClear: () => void
}

const statusTabs: { key: TransactionStatusTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'success', label: 'Success' },
  { key: 'failed', label: 'Failed' },
  { key: 'pending', label: 'Pending' },
]

export function TransactionFilters({ value, onChange, disabled = false, onClear }: TransactionFiltersProps) {
  const [localQuery, setLocalQuery] = useState(value.query)

  useEffect(() => {
    setLocalQuery(value.query)
  }, [value.query])

  // Debounce search 300ms
  useEffect(() => {
    const t = window.setTimeout(() => {
      const nextQuery = localQuery
      if (nextQuery !== value.query) {
        onChange({ ...value, query: nextQuery })
      }
    }, 300)
    return () => window.clearTimeout(t)
  }, [localQuery, onChange, value])

  const merchantOptions = useMemo<SelectOption[]>(() => {
    const base: SelectOption[] = [{ value: 'any', label: 'Merchant: Any' }]
    return base.concat(listMerchants().map((m) => ({ value: m.id, label: m.name })))
  }, [])

  const dateOptions: SelectOption[] = [
    { value: 'any', label: 'Date: Any' },
    { value: 'last7d', label: 'Last 7 days' },
    { value: 'last30d', label: 'Last 30 days' },
  ]

  const amountOptions: SelectOption[] = [
    { value: 'any', label: 'Amount: Any' },
    { value: 'lt100', label: 'Under $100' },
    { value: '100to1000', label: '$100 – $1,000' },
    { value: '1000to10000', label: '$1,000 – $10,000' },
    { value: 'gt10000', label: 'Over $10,000' },
  ]

  return (
    <div className="rounded-[var(--radius-lg)] bg-[var(--color-white)] shadow-[var(--shadow-sm)]">
      {/* Tabs */}
      <div
        className="flex h-12 items-end justify-between border-b border-[var(--color-gray-200)] px-[var(--space-6)]"
      >
        <div className="flex gap-[var(--space-6)]">
          {statusTabs.map((t) => {
            const active = value.status === t.key
            return (
              <button
                key={t.key}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...value, status: t.key })}
                className={[
                  'h-10 px-1 text-[var(--font-sm)] font-medium outline-none',
                  'focus-visible:ring-2 focus-visible:ring-[var(--color-info-light)] rounded-[var(--radius-sm)]',
                  active
                    ? 'border-b-2 border-[var(--color-primary-500)] text-[var(--color-primary-600)]'
                    : 'text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)]',
                  disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                ].join(' ')}
                aria-pressed={active}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={onClear}
          className="text-[var(--font-sm)] text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] focus-visible:ring-2 focus-visible:ring-[var(--color-info-light)] rounded-[var(--radius-sm)] px-2 py-1"
        >
          Clear
        </button>
      </div>

      {/* Search + dropdowns */}
      <div className="flex flex-wrap items-center gap-[var(--space-3)] px-[var(--space-6)] py-[var(--space-3)]">
        <div className="w-full md:w-[240px]">
          <Input
            size="sm"
            disabled={disabled}
            fullWidth
            placeholder="Search by ID or Reference"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </div>
        <Select
          size="sm"
          disabled={disabled}
          options={dateOptions}
          value={value.dateRange}
          onChange={(v) => onChange({ ...value, dateRange: (v as any) ?? 'any' })}
        />
        <Select
          size="sm"
          disabled={disabled}
          options={merchantOptions}
          value={value.merchantId}
          onChange={(v) => onChange({ ...value, merchantId: (v as any) ?? 'any' })}
        />
        <Select
          size="sm"
          disabled={disabled}
          options={amountOptions}
          value={value.amountRange}
          onChange={(v) => onChange({ ...value, amountRange: (v as any) ?? 'any' })}
        />
      </div>
    </div>
  )
}

export default TransactionFilters

