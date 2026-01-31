// projects/psp-admin/src/services/transaction-service.ts
import { transactions as mockData } from '@/lib/mock-data'
import type { Transaction } from '@/types'

export interface FetchTransactionsParams {
  page?: number
  limit?: number
  status?: string
  type?: string
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface FetchTransactionsResponse {
  data: Transaction[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const LATENCY_MS = 600 // Simulate network delay

export const TransactionService = {
  async getAll(params: FetchTransactionsParams = {}): Promise<FetchTransactionsResponse> {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      search,
      sort = 'createdAt',
      order = 'desc'
    } = params

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, LATENCY_MS))

    let filtered = [...mockData]

    // 1. Filter by Status
    if (status && status !== 'all') {
      filtered = filtered.filter(t => t.status === status)
    }

    // 2. Filter by Type
    if (type && type !== 'all') {
      filtered = filtered.filter(t => t.type === type)
    }

    // 3. Search (ID, Merchant, Ref)
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(q) ||
        t.merchantName.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q)
      )
    }

    // 4. Sort
    filtered.sort((a, b) => {
      const valA = a[sort as keyof Transaction]
      const valB = b[sort as keyof Transaction]
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }
      return 0
    })

    // 5. Pagination
    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedData = filtered.slice(start, start + limit)

    return {
      data: paginatedData,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    }
  },

  async getById(id: string): Promise<Transaction | null> {
    await new Promise((resolve) => setTimeout(resolve, LATENCY_MS))
    return mockData.find(t => t.id === id) || null
  }
}
