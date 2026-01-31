'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PaymentResult } from '../components/business/transactions/types'
import { fetchPaymentResult } from '../services/transactions'

export interface UsePaymentResultOptions {
  id: string
}

export function usePaymentResult({ id }: UsePaymentResultOptions) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PaymentResult | null>(null)

  const [attempts, setAttempts] = useState(0)
  const maxAttempts = 12
  const intervalMs = 5000

  const [countdownSeconds, setCountdownSeconds] = useState(5)
  const [timedOut, setTimedOut] = useState(false)

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const attemptsRef = useRef(0)

  const stopTimers = useCallback(() => {
    if (pollTimerRef.current) window.clearInterval(pollTimerRef.current)
    if (tickTimerRef.current) window.clearInterval(tickTimerRef.current)
    pollTimerRef.current = null
    tickTimerRef.current = null
  }, [])

  const fetchOnce = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const r = await fetchPaymentResult(id)
      if (!r) {
        router.push('/transactions')
        return
      }
      setResult(r)
    } catch (e) {
      setError('Unable to load payment result')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  const startPolling = useCallback(() => {
    stopTimers()
    attemptsRef.current = 0
    setAttempts(0)
    setTimedOut(false)
    setCountdownSeconds(Math.ceil(intervalMs / 1000))

    tickTimerRef.current = window.setInterval(() => {
      setCountdownSeconds((s) => (s <= 1 ? Math.ceil(intervalMs / 1000) : s - 1))
    }, 1000)

    pollTimerRef.current = window.setInterval(async () => {
      attemptsRef.current += 1
      setAttempts(attemptsRef.current)
      if (attemptsRef.current > maxAttempts) {
        stopTimers()
        setTimedOut(true)
        return
      }
      try {
        const r = await fetchPaymentResult(id)
        if (!r) return
        setResult(r)
        if (r.status !== 'pending') {
          stopTimers()
        }
      } catch {
        // ignore transient
      }
    }, intervalMs)
  }, [id, stopTimers])

  useEffect(() => {
    void fetchOnce()
  }, [fetchOnce])

  useEffect(() => {
    if (!result || result.status !== 'pending') {
      stopTimers()
      return
    }
    startPolling()
    return () => stopTimers()
  }, [result?.status, startPolling, stopTimers])

  const manualRefresh = useCallback(async () => {
    setTimedOut(false)
    attemptsRef.current = 0
    setAttempts(0)
    setCountdownSeconds(Math.ceil(intervalMs / 1000))
    await fetchOnce()
    if (result?.status === 'pending') startPolling()
  }, [fetchOnce, result?.status, startPolling])

  const canPoll = useMemo(() => result?.status === 'pending' && !timedOut, [result?.status, timedOut])

  return {
    loading,
    error,
    result,
    countdownSeconds,
    timedOut,
    canPoll,
    retry: fetchOnce,
    manualRefresh,
  }
}

export default usePaymentResult
