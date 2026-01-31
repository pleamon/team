export type TransactionStatus = 'success' | 'failed' | 'pending' | 'refunded'

export interface TransactionTimelineEvent {
  id: string
  label: string
  timestamp: string // ISO
  tone?: 'neutral' | 'success' | 'error' | 'warning' | 'info'
}

export interface TransactionRawData {
  request: Record<string, any>
  response: Record<string, any>
}

export interface Transaction {
  id: string
  reference: string
  createdAt: string // ISO
  merchantId: string
  merchantName: string
  amountCents: number
  currency: string
  feeCents: number
  netCents: number
  method: string
  network: string
  status: TransactionStatus
  timeline: TransactionTimelineEvent[]
  raw: TransactionRawData
}

export type TransactionStatusTab = 'all' | 'success' | 'failed' | 'pending'

export interface TransactionFilters {
  status: TransactionStatusTab
  query: string
  dateRange: 'any' | 'last7d' | 'last30d'
  merchantId: 'any' | string
  amountRange: 'any' | 'lt100' | '100to1000' | '1000to10000' | 'gt10000'
}

export interface PagedResult<T> {
  items: T[]
  total: number
}

export interface RefundRequest {
  amountCents: number
  reason: 'customer_request' | 'duplicate' | 'fraud' | 'other'
}

