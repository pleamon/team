import type {
  CreatePaymentPayload,
  Merchant,
  PagedResult,
  PaymentResult,
  PaymentResultStatus,
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

const merchantDb: Merchant[] = [
  { id: 'm_acme', name: 'Acme Corp', limitCents: 2500000, currencies: ['USD', 'EUR'], defaultCurrency: 'USD' },
  { id: 'm_beta', name: 'Beta Inc', limitCents: 5000000, currencies: ['USD', 'GBP'], defaultCurrency: 'USD' },
  { id: 'm_gamma', name: 'Gamma Ltd', limitCents: 1000000, currencies: ['USD'], defaultCurrency: 'USD' },
  { id: 'm_delta', name: 'Delta Co', limitCents: 8000000, currencies: ['USD', 'EUR', 'JPY'], defaultCurrency: 'USD' },
  { id: 'm_epsilon', name: 'Epsilon LLC', limitCents: 2000000, currencies: ['USD', 'CNY'], defaultCurrency: 'USD' },
  { id: 'm_zen', name: 'Zenith Market', limitCents: 12000000, currencies: ['USD', 'EUR', 'GBP'], defaultCurrency: 'USD' },
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

// pending resolution state: after 3-4 polls, pending -> success/failed
const pendingResolution = new Map<
  string,
  {
    remaining: number
    finalStatus: Exclude<PaymentResultStatus, 'pending'>
    error?: { message: string; code: string }
  }
>()

export function listMerchants() {
  return merchants
}

export async function fetchMerchants(): Promise<Merchant[]> {
  await delay(250)
  return merchantDb
}

function randomOutcome(): PaymentResultStatus {
  const r = Math.random()
  if (r < 0.5) return 'success'
  if (r < 0.8) return 'pending'
  return 'failed'
}

function nextError() {
  const errors = [
    { code: 'E-4001', message: 'Insufficient funds' },
    { code: 'E-4012', message: 'Card declined' },
    { code: 'E-4220', message: 'Invalid recipient details' },
  ]
  return pick(errors)
}

export async function createPayment(
  data: CreatePaymentPayload,
): Promise<{ id: string; status: PaymentResultStatus }> {
  await delay(450)

  const now = new Date()
  const idx = mockDb.length + 1
  const id = formatId(now, idx)
  const merchant = merchantDb.find((m) => m.id === data.merchantId)
  const merchantName = merchant?.name ?? data.merchantId

  const status = randomOutcome()
  const feeCents = Math.max(30, Math.round(data.amountCents * 0.029))
  const netCents = data.amountCents - feeCents
  const methodLabel =
    data.method === 'card'
      ? `Card •••• ${data.card?.number.replace(/\D/g, '').slice(-4) || '0000'}`
      : data.method === 'bank_transfer'
        ? 'Bank Transfer'
        : 'E-Wallet'

  const error = status === 'failed' ? nextError() : undefined

  const tx: Transaction = {
    id,
    reference: data.referenceId || `REF-${now.getFullYear()}-${pad(idx, 4)}`,
    createdAt: toISO(now),
    merchantId: data.merchantId,
    merchantName,
    amountCents: data.amountCents,
    currency: data.currency,
    feeCents,
    netCents,
    method: methodLabel,
    network: pick(networks),
    status: status === 'failed' ? 'failed' : status === 'pending' ? 'pending' : 'success',
    timeline: buildTimeline(status === 'failed' ? 'failed' : status === 'pending' ? 'pending' : 'success', toISO(now)),
    raw: {
      request: { ...data },
      response: {
        id,
        status,
        feeCents,
        netCents,
        error,
      },
    },
  }

  mockDb = [tx, ...mockDb]

  if (status === 'pending') {
    const finalStatus: 'success' | 'failed' = Math.random() < 0.7 ? 'success' : 'failed'
    pendingResolution.set(id, {
      remaining: Math.random() < 0.5 ? 3 : 4,
      finalStatus,
      error: finalStatus === 'failed' ? nextError() : undefined,
    })
  }

  return { id, status }
}

export async function fetchPaymentResult(id: string): Promise<PaymentResult | null> {
  await delay(250)
  const tx = mockDb.find((t) => t.id === id)
  if (!tx) return null

  // mutate pending after 3-4 polls
  if (tx.status === 'pending') {
    const state = pendingResolution.get(id)
    if (state) {
      state.remaining -= 1
      if (state.remaining <= 0) {
        pendingResolution.delete(id)
        const nextStatus: TransactionStatus = state.finalStatus
        const idx = mockDb.findIndex((t) => t.id === id)
        const updated: Transaction = {
          ...tx,
          status: nextStatus,
          timeline: buildTimeline(nextStatus, tx.createdAt),
          raw: {
            ...tx.raw,
            response: {
              ...tx.raw.response,
              status: nextStatus,
              error: state.error,
            },
          },
        }
        if (idx >= 0) mockDb[idx] = updated
      } else {
        pendingResolution.set(id, state)
      }
    }
  }

  const latest = mockDb.find((t) => t.id === id)!
  const payload = latest.raw?.request as CreatePaymentPayload | undefined
  const resStatus: PaymentResultStatus =
    latest.status === 'pending' ? 'pending' : latest.status === 'failed' ? 'failed' : 'success'

  const err = (latest.raw?.response as any)?.error as { message: string; code: string } | undefined
  return {
    id: latest.id,
    status: resStatus,
    createdAt: latest.createdAt,
    merchantId: latest.merchantId,
    merchantName: latest.merchantName,
    amountCents: latest.amountCents,
    currency: latest.currency,
    method: payload?.method ?? 'card',
    referenceId: payload?.referenceId ?? latest.reference,
    feeCents: latest.feeCents,
    netCents: latest.netCents,
    error: resStatus === 'failed' && err ? err : undefined,
    payload,
  }
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
