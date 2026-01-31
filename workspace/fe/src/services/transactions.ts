import type {
  PagedResult,
  RefundRequest,
  Transaction,
  TransactionFilters,
  TransactionStatus,
} from '../components/business/transactions/types'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function pad(n: number, size = 3) {
  return String(n).padStart(size, '0')
}

function formatId(date: Date, idx: number) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `T-${y}${m}${d}-${pad(idx)}`
}

function toISO(date: Date) {
  return date.toISOString()
}

function cents(amount: number) {
  return Math.round(amount * 100)
}

const merchants = [
  { id: 'm_acme', name: 'Acme Corp' },
  { id: 'm_beta', name: 'Beta Inc' },
  { id: 'm_gamma', name: 'Gamma Ltd' },
  { id: 'm_delta', name: 'Delta Co' },
  { id: 'm_epsilon', name: 'Epsilon LLC' },
]

function buildTimeline(status: TransactionStatus, createdAtISO: string) {
  const base = new Date(createdAtISO)
  const t1 = new Date(base.getTime() + 30 * 1000)
  const t2 = new Date(base.getTime() + 70 * 1000)
  const t3 = new Date(base.getTime() + 120 * 1000)
  const t4 = new Date(base.getTime() + 2 * 60 * 60 * 1000)

  const events: Transaction['timeline'] = [
    { id: 'created', label: 'Created', timestamp: toISO(base), tone: 'neutral' },
    { id: 'risk', label: 'Risk check passed', timestamp: toISO(t1), tone: 'success' },
    { id: 'auth', label: 'Authorization approved', timestamp: toISO(t2), tone: 'success' },
  ]

  if (status === 'failed') {
    events.push({ id: 'failed', label: 'Authorization failed', timestamp: toISO(t3), tone: 'error' })
    return events
  }

  events.push({ id: 'captured', label: 'Captured', timestamp: toISO(t3), tone: 'success' })

  if (status === 'pending') {
    events.push({ id: 'pending', label: 'Settlement pending', timestamp: toISO(t4), tone: 'warning' })
    return events
  }

  events.push({ id: 'settled', label: 'Settled', timestamp: toISO(t4), tone: 'success' })

  if (status === 'refunded') {
    const t5 = new Date(base.getTime() + 4 * 60 * 60 * 1000)
    events.push({ id: 'refund', label: 'Refunded', timestamp: toISO(t5), tone: 'info' })
  }
  return events
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const networks = ['Visa', 'Mastercard', 'Amex']
const methods = ['Visa •••• 1234', 'Mastercard •••• 8899', 'Amex •••• 0005']

function generateMockTransactions(): Transaction[] {
  const now = new Date()
  const statuses: TransactionStatus[] = ['success', 'failed', 'pending', 'refunded']

  const list: Transaction[] = []
  for (let i = 1; i <= 36; i += 1) {
    const created = new Date(now.getTime() - i * 6 * 60 * 60 * 1000)
    const status = statuses[i % statuses.length]
    const merchant = merchants[i % merchants.length]
    const amount = randomBetween(10, 50000)
    const fee = Math.max(0.3, amount * 0.029)
    const amountCents = cents(amount)
    const feeCents = cents(fee)
    const netCents = amountCents - feeCents

    const id = formatId(created, i)
    const reference = `REF-${created.getFullYear()}-${pad(i, 4)}`
    const createdAt = toISO(created)

    list.push({
      id,
      reference,
      createdAt,
      merchantId: merchant.id,
      merchantName: merchant.name,
      amountCents,
      currency: 'USD',
      feeCents,
      netCents,
      method: pick(methods),
      network: pick(networks),
      status,
      timeline: buildTimeline(status, createdAt),
      raw: {
        request: {
          id,
          reference,
          merchantId: merchant.id,
          amount: amountCents,
          currency: 'USD',
          createdAt,
        },
        response: {
          id,
          status,
          fee: feeCents,
          net: netCents,
          network: pick(networks),
          risk: { score: Math.round(randomBetween(1, 99)), decision: 'allow' },
        },
      },
    })
  }
  return list
}

// In-memory mock DB
let mockDb: Transaction[] = generateMockTransactions()

export function listMerchants() {
  return merchants
}

export async function fetchTransactions(
  filters: TransactionFilters,
  page: number,
  pageSize: number,
): Promise<PagedResult<Transaction>> {
  await delay(300)

  // Simulate occasional error (opt-in via query)
  if (filters.query.trim().toLowerCase() === 'error') {
    throw new Error('Mock network error')
  }

  const q = filters.query.trim().toLowerCase()
  const now = Date.now()

  let items = [...mockDb]

  if (filters.status !== 'all') {
    items = items.filter((t) => t.status === filters.status)
  }

  if (q) {
    items = items.filter(
      (t) => t.id.toLowerCase().includes(q) || t.reference.toLowerCase().includes(q),
    )
  }

  if (filters.merchantId !== 'any') {
    items = items.filter((t) => t.merchantId === filters.merchantId)
  }

  if (filters.dateRange !== 'any') {
    const ms = filters.dateRange === 'last7d' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000
    items = items.filter((t) => now - new Date(t.createdAt).getTime() <= ms)
  }

  if (filters.amountRange !== 'any') {
    items = items.filter((t) => {
      const dollars = t.amountCents / 100
      switch (filters.amountRange) {
        case 'lt100':
          return dollars < 100
        case '100to1000':
          return dollars >= 100 && dollars <= 1000
        case '1000to10000':
          return dollars >= 1000 && dollars <= 10000
        case 'gt10000':
          return dollars > 10000
        default:
          return true
      }
    })
  }

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const total = items.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return { items: items.slice(start, end), total }
}

export async function fetchTransactionById(id: string): Promise<Transaction | null> {
  await delay(200)
  if (id.trim().toLowerCase() === 'error') throw new Error('Mock server error')
  return mockDb.find((t) => t.id === id) ?? null
}

export async function refundTransaction(id: string, req: RefundRequest): Promise<Transaction> {
  await delay(300)
  const idx = mockDb.findIndex((t) => t.id === id)
  if (idx < 0) throw new Error('Transaction not found')

  const current = mockDb[idx]
  const next: Transaction = {
    ...current,
    status: 'refunded',
    timeline: buildTimeline('refunded', current.createdAt),
    raw: {
      ...current.raw,
      response: {
        ...current.raw.response,
        refund: {
          amount: req.amountCents,
          reason: req.reason,
          refundedAt: new Date().toISOString(),
        },
      },
    },
  }

  mockDb[idx] = next
  return next
}
