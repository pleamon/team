'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer, useToast } from '../../../components/design'
import StepIndicator from '../../../components/business/transactions/StepIndicator'
import PaymentForm from '../../../components/business/transactions/PaymentForm'
import PaymentReview from '../../../components/business/transactions/PaymentReview'
import { useCreatePayment } from '../../../hooks/useCreatePayment'

export default function TransactionsCreatePaymentPage() {
  const router = useRouter()
  const { toasts, close, error: toastError } = useToast()

  const {
    step,
    value,
    setValue,
    merchant,
    merchants,
    merchantsLoading,
    merchantsError,
    retryMerchants,
    errors,
    validateField,
    dirty,
    submitting,
    cancelConfirmOpen,
    openCancel,
    closeCancel,
    confirmCancel,
    continueToReview,
    backToEdit,
    submit,
  } = useCreatePayment()

  const steps = useMemo(
    () => [
      { key: 'details', label: 'Payment Details' },
      { key: 'review', label: 'Review & Confirm' },
      { key: 'done', label: 'Done' },
    ],
    [],
  )

  const handleSubmit = async () => {
    try {
      await submit()
    } catch (e) {
      toastError('Failed to create payment', 'Please try again.')
    }
  }

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <ToastContainer toasts={toasts} onClose={close} />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-[var(--space-4)] flex items-center gap-2 text-[var(--font-sm)] text-[var(--color-gray-500)]"
      >
        <button
          type="button"
          onClick={() => router.push('/transactions')}
          className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]"
        >
          Transactions
        </button>
        <span className="text-[var(--color-gray-300)]">/</span>
        <span className="text-[var(--color-gray-700)]">Create Payment</span>
      </nav>

      {/* Page Header */}
      <h1 className="mb-[var(--space-6)] text-[var(--font-2xl)] font-semibold text-[var(--color-gray-900)]">
        Create Payment
      </h1>

      <StepIndicator steps={steps} current={step} />

      <div className="w-full xl:mx-auto xl:max-w-[720px]">
        {step === 0 ? (
          <PaymentForm
            value={value}
            merchants={merchants}
            merchantsLoading={merchantsLoading}
            merchantsError={merchantsError}
            onRetryMerchants={retryMerchants}
            disabled={submitting}
            errors={errors}
            dirty={dirty}
            onChange={setValue}
            onValidateField={validateField}
            onCancel={cancelConfirmOpen ? closeCancel : openCancel}
            onConfirmCancel={confirmCancel}
            cancelConfirmOpen={cancelConfirmOpen}
            onContinue={continueToReview}
          />
        ) : (
          <PaymentReview
            value={value}
            merchant={merchant}
            disabled={submitting}
            dirty={dirty}
            onBack={backToEdit}
            onCancel={cancelConfirmOpen ? closeCancel : openCancel}
            onConfirmCancel={confirmCancel}
            cancelConfirmOpen={cancelConfirmOpen}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  )
}

