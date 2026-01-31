'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { CreatePaymentPayload, Merchant } from '../components/business/transactions/types'
import { createPayment, fetchMerchants } from '../services/transactions'

export type CreatePaymentStep = 0 | 1

export interface CreatePaymentFieldErrors {
  merchantId?: string
  amountCents?: string
  currency?: string
  method?: string
  referenceId?: string
  description?: string
  'card.number'?: string
  'card.expiry'?: string
  'card.cvv'?: string
  'card.cardholder'?: string
  metadata?: string
}

function luhnCheck(num: string) {
  const digits = num.replace(/\D/g, '')
  if (digits.length < 12) return false
  let sum = 0
  let shouldDouble = false
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let d = Number(digits[i])
    if (shouldDouble) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}

function isFutureExpiry(mmYY: string) {
  const m = mmYY.match(/^(\d{2})\/(\d{2})$/)
  if (!m) return false
  const mm = Number(m[1])
  const yy = Number(m[2])
  if (mm < 1 || mm > 12) return false
  const now = new Date()
  const fullYear = 2000 + yy
  // card valid through end of month
  const exp = new Date(fullYear, mm, 0, 23, 59, 59, 999)
  return exp.getTime() >= now.getTime()
}

function defaultPayload(): CreatePaymentPayload {
  return {
    merchantId: '',
    amountCents: 0,
    currency: 'USD',
    referenceId: '',
    description: '',
    method: 'card',
    card: { number: '', expiry: '', cvv: '', cardholder: '' },
    metadata: [],
  }
}

export function useCreatePayment() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState<CreatePaymentStep>(0)
  const [value, setValue] = useState<CreatePaymentPayload>(defaultPayload())
  const [errors, setErrors] = useState<CreatePaymentFieldErrors>({})
  const [dirty, setDirty] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false)

  /* ── Merchants ── */
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [merchantsLoading, setMerchantsLoading] = useState(true)
  const [merchantsError, setMerchantsError] = useState<string | null>(null)

  const loadMerchants = useCallback(async () => {
    setMerchantsLoading(true)
    setMerchantsError(null)
    try {
      const list = await fetchMerchants()
      setMerchants(list)
    } catch (e) {
      setMerchantsError('Failed to load merchants')
    } finally {
      setMerchantsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMerchants()
  }, [loadMerchants])

  /* ── Prefill (Retry Payment) ── */
  useEffect(() => {
    const prefill = searchParams.get('prefill')
    if (prefill !== '1') return
    try {
      const raw = sessionStorage.getItem('createPaymentPrefill')
      if (!raw) return
      const data = JSON.parse(raw) as CreatePaymentPayload
      setValue(data)
      sessionStorage.removeItem('createPaymentPrefill')
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const merchant = useMemo(() => merchants.find((m) => m.id === value.merchantId) ?? null, [merchants, value.merchantId])

  const validateAll = useCallback(
    (v: CreatePaymentPayload): CreatePaymentFieldErrors => {
      const next: CreatePaymentFieldErrors = {}

      if (!v.merchantId) next.merchantId = 'Please select a merchant'

      if (!v.currency) next.currency = 'Please select currency'

      const amount = v.amountCents / 100
      if (!v.amountCents || amount <= 0 || !Number.isFinite(amount)) {
        next.amountCents = 'Enter a valid amount'
      } else {
        // max 2 decimals implied by cents
        const limit = merchant?.limitCents
        if (limit != null && v.amountCents > limit) {
          next.amountCents = `Amount exceeds merchant limit (${(limit / 100).toFixed(2)} ${v.currency})`
        }
      }

      if (!v.method) next.method = 'Please select a payment method'

      if (v.method === 'card') {
        const num = v.card?.number ?? ''
        const exp = v.card?.expiry ?? ''
        const cvv = v.card?.cvv ?? ''
        const holder = v.card?.cardholder ?? ''

        if (!num || !luhnCheck(num)) next['card.number'] = 'Invalid card number'
        if (!exp || !isFutureExpiry(exp)) next['card.expiry'] = 'Card has expired'
        if (!/^(\d{3,4})$/.test(cvv)) next['card.cvv'] = 'Invalid CVV'
        if (!holder.trim()) next['card.cardholder'] = 'Enter cardholder name'
      }

      if (v.metadata.length > 0) {
        const keys = v.metadata.map((m) => m.key.trim()).filter(Boolean)
        const set = new Set<string>()
        for (const k of keys) {
          if (!/^[a-zA-Z0-9_]+$/.test(k)) {
            next.metadata = 'Invalid key format'
            break
          }
          if (set.has(k)) {
            next.metadata = 'Duplicate key'
            break
          }
          set.add(k)
        }
      }

      return next
    },
    [merchant?.limitCents, merchant, value.currency],
  )

  const validateField = useCallback(
    (field: string) => {
      const all = validateAll(value)
      if (field === 'metadata') {
        setErrors((prev) => ({ ...prev, metadata: all.metadata }))
        return
      }
      setErrors((prev) => ({ ...prev, [field]: (all as any)[field] }))
    },
    [validateAll, value],
  )

  const setNextValue = useCallback((next: CreatePaymentPayload) => {
    setValue(next)
    setDirty(true)
    // clear errors while typing (keep other fields)
  }, [])

  const openCancel = useCallback(() => {
    if (dirty) setCancelConfirmOpen(true)
    else router.push('/transactions')
  }, [dirty, router])

  const closeCancel = useCallback(() => setCancelConfirmOpen(false), [])

  const confirmCancel = useCallback(() => {
    setCancelConfirmOpen(false)
    router.push('/transactions')
  }, [router])

  const continueToReview = useCallback(() => {
    const nextErrors = validateAll(value)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return
    setStep(1)
  }, [validateAll, value])

  const backToEdit = useCallback(() => setStep(0), [])

  const submit = useCallback(async () => {
    const nextErrors = validateAll(value)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return
    setSubmitting(true)
    try {
      const res = await createPayment(value)
      setDirty(false)
      router.push(`/transactions/${encodeURIComponent(res.id)}/result`)
    } finally {
      setSubmitting(false)
    }
  }, [router, validateAll, value])

  return {
    step,
    setStep,
    value,
    setValue: setNextValue,
    merchant,
    merchants,
    merchantsLoading,
    merchantsError,
    retryMerchants: loadMerchants,
    errors,
    validateField,
    validateAll,
    dirty,
    submitting,
    cancelConfirmOpen,
    openCancel,
    closeCancel,
    confirmCancel,
    continueToReview,
    backToEdit,
    submit,
  }
}

export default useCreatePayment

