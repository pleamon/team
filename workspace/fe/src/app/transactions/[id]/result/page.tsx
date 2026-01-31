'use client'

import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import StepIndicator from '../../../../components/business/transactions/StepIndicator'
import PaymentResultCard from '../../../../components/business/transactions/PaymentResult'
import { ToastContainer, useToast } from '../../../../components/design'
import { usePaymentResult } from '../../../../hooks/usePaymentResult'
import type { CreatePaymentPayload } from '../../../../components/business/transactions/types'

export default function TransactionResultPage() {
  const params = useParams()
  const router = useRouter()
  const { toasts, close, success } = useToast()

  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const decodedId = id ? decodeURIComponent(id) : ''

  const { loading, error, result, countdownSeconds, timedOut, retry, manualRefresh } = usePaymentResult({
    id: decodedId,
  })

  const steps = useMemo(
    () => [
      { key: 'details', label: 'Payment Details' },
      { key: 'review', label: 'Review & Confirm' },
      { key: 'done', label: 'Done' },
    ],
    [],
  )

  const current = result?.status === 'pending' ? 2 : 2
  const completed = useMemo(() => {
    if (!result) return [true, true, false]
    if (result.status === 'pending') return [true, true, false]
    return [true, true, true]
  }, [result])

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <ToastContainer toasts={toasts} onClose={close} />

      <StepIndicator steps={steps} current={current} completed={completed} />

      <PaymentResultCard
        loading={loading}
        error={error}
        result={result}
        countdownSeconds={countdownSeconds}
        timedOut={timedOut}
        onRetryFetch={retry}
        onManualRefresh={manualRefresh}
        onCopyId={(txId) => {
          navigator.clipboard.writeText(txId)
          success('Copied', 'Transaction ID copied')
        }}
        onNavigateView={(txId) => router.push(`/transactions/${encodeURIComponent(txId)}`)}
        onNavigateList={() => router.push('/transactions')}
        onNavigateNew={({ prefill } = {}) => {
          if (prefill) {
            sessionStorage.setItem('createPaymentPrefill', JSON.stringify(prefill as CreatePaymentPayload))
            router.push('/transactions/new?prefill=1')
          } else {
            router.push('/transactions/new')
          }
        }}
      />
    </div>
  )
}

