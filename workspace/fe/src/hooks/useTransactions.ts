'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Transaction, TransactionFilters } from '../components/business/transactions/types'
import { fetchTransactions } from '../services/transactions'

export interface UseTransactionsState {
  items: Transaction[]
  total: number
  page: number
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  filters: TransactionFilters
  setFilters: (next: TransactionFilters) => void
  loading: boolean
  error: string | null
  retry: () => void
  showing: { from: number; to: number }
}

const defaultFilters: TransactionFilters = {
  status: 'all',
  query: '',
  dateRange: 'any',
  merchantId: 'any',
  amountRange: 'any',
}

export function useTransactions(initial?: Partial<TransactionFilters>): UseTransactionsState {
  const [filters, setFilters] = useState<TransactionFilters>({ ...defaultFilters, ...initial })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [items, setItems] = useState<Transaction[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const seq = useRef(0)

  const params = useMemo(() => ({ filters, page, pageSize }), [filters, page, pageSize])

  const load = async () => {
    const current = ++seq.current
    setLoading(true)
    setError(null)
    try {
      const res = await fetchTransactions(params.filters, params.page, params.pageSize)
      if (current !== seq.current) return
      setItems(res.items)
      setTotal(res.total)
    } catch (e) {
      if (current !== seq.current) return
      setError(e instanceof Error ? e.message : 'Failed to load transactions')
    } finally {
      if (current !== seq.current) return
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const retry = () => {
    void load()
  }

  const showing = useMemo(() => {
    if (total === 0) return { from: 0, to: 0 }
    const from = (page - 1) * pageSize + 1
    const to = Math.min(page * pageSize, total)
    return { from, to }
  }, [page, pageSize, total])

  return {
    items,
    total,
    page,
    pageSize,
    setPage,
    setPageSize: (size) => {
      setPage(1)
      setPageSize(size)
    },
    filters,
    setFilters: (next) => {
      setPage(1)
      setFilters(next)
    },
    loading,
    error,
    retry,
    showing,
  }
}

