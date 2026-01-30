// ===== Merchant Types =====
export type MerchantStatus = 'active' | 'pending' | 'suspended' | 'rejected'

export interface Merchant {
  id: string
  name: string
  email: string
  status: MerchantStatus
  balance: number
  currency: string
  createdAt: string
  lastTransaction: string
  transactionCount: number
  totalVolume: number
}

// ===== Transaction Types =====
export type TransactionStatus = 'success' | 'pending' | 'failed' | 'refunded'
export type TransactionType = 'payment' | 'payout' | 'refund' | 'chargeback'

export interface Transaction {
  id: string
  merchantId: string
  merchantName: string
  amount: number
  currency: string
  status: TransactionStatus
  type: TransactionType
  method: string
  createdAt: string
  reference: string
}

// ===== Dashboard Types =====
export interface DashboardStats {
  totalRevenue: number
  totalTransactions: number
  activeMerchants: number
  successRate: number
  revenueChange: number
  transactionChange: number
  merchantChange: number
  rateChange: number
}

export interface ChartDataPoint {
  name: string
  revenue: number
  transactions: number
}

export interface MethodDistribution {
  name: string
  value: number
  color: string
}

// ===== Navigation =====
export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}
