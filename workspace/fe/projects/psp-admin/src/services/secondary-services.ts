// projects/psp-admin/src/services/secondary-services.ts
// Quick mocks for P2 modules

const LATENCY_MS = 400

// --- Settlements ---
export interface Settlement {
  id: string
  merchantName: string
  amount: number
  currency: string
  status: 'paid' | 'processing' | 'failed'
  payoutDate: string
}

const mockSettlements: Settlement[] = [
  { id: 'set_1', merchantName: 'Acme Corp', amount: 5000.00, currency: 'USD', status: 'paid', payoutDate: '2023-10-25' },
  { id: 'set_2', merchantName: 'Globex', amount: 1250.50, currency: 'USD', status: 'processing', payoutDate: '2023-10-26' },
]

export const SettlementService = {
  async getAll(): Promise<Settlement[]> {
    await new Promise(r => setTimeout(r, LATENCY_MS))
    return mockSettlements
  }
}

// --- Risk ---
export interface RiskRule {
  id: string
  name: string
  type: 'velocity' | 'amount' | 'country'
  status: 'active' | 'disabled'
  threshold: string
}

const mockRules: RiskRule[] = [
  { id: 'rule_1', name: 'High Value Txn', type: 'amount', status: 'active', threshold: '> $10,000' },
  { id: 'rule_2', name: 'Velocity Check', type: 'velocity', status: 'active', threshold: '> 10 txn/min' },
  { id: 'rule_3', name: 'Sanctioned Country', type: 'country', status: 'disabled', threshold: 'Block list' },
]

export const RiskService = {
  async getRules(): Promise<RiskRule[]> {
    await new Promise(r => setTimeout(r, LATENCY_MS))
    return mockRules
  }
}

// --- Developers ---
export interface Webhook {
  id: string
  url: string
  events: string[]
  status: 'active' | 'failed'
  lastTriggered: string
}

const mockWebhooks: Webhook[] = [
  { id: 'wh_1', url: 'https://api.acme.com/hooks', events: ['payment.success', 'payment.failed'], status: 'active', lastTriggered: '2 mins ago' },
  { id: 'wh_2', url: 'https://globex.io/callbacks', events: ['payout.paid'], status: 'failed', lastTriggered: '1 day ago' },
]

export const DeveloperService = {
  async getWebhooks(): Promise<Webhook[]> {
    await new Promise(r => setTimeout(r, LATENCY_MS))
    return mockWebhooks
  }
}

// --- System ---
export interface User {
  id: string
  name: string
  role: 'admin' | 'support' | 'viewer'
  email: string
}

const mockUsers: User[] = [
  { id: 'u_1', name: 'Pleamon Li', role: 'admin', email: 'pleamon@psp.com' },
  { id: 'u_2', name: 'Support Team', role: 'support', email: 'help@psp.com' },
]

export const SystemService = {
  async getUsers(): Promise<User[]> {
    await new Promise(r => setTimeout(r, LATENCY_MS))
    return mockUsers
  }
}
