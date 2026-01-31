// projects/psp-admin/src/services/merchant-service.ts
// Mock merchants derived from transactions for now + some extras
const mockMerchants = [
  { id: 'mch_1', name: 'Acme Corp', region: 'SG', status: 'active', email: 'contact@acme.com', businessType: 'enterprise' },
  { id: 'mch_2', name: 'Globex', region: 'US', status: 'active', email: 'info@globex.com', businessType: 'enterprise' },
  { id: 'mch_3', name: 'Soylent Corp', region: 'US', status: 'inactive', email: 'ops@soylent.com', businessType: 'individual' },
]

export interface Merchant {
  id: string
  name: string
  region: string
  status: 'active' | 'inactive' | 'pending'
  email: string
  businessType: 'enterprise' | 'individual'
  createdAt?: string
}

export interface CreateMerchantPayload {
  // Step 1
  name: string
  email: string
  region: string
  // Step 2
  businessType: string
  registrationNumber: string
  website: string
  // Step 3
  bankName: string
  accountNumber: string
  currency: string
}

const LATENCY_MS = 600

export const MerchantService = {
  async getAll(): Promise<Merchant[]> {
    await new Promise(resolve => setTimeout(resolve, LATENCY_MS))
    return mockMerchants as Merchant[]
  },

  async create(payload: CreateMerchantPayload): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, LATENCY_MS))
    
    // Mock Validation based on Issue #4
    const errors = []
    if (payload.name.length < 2) errors.push({ field: 'name', message: 'Name must be at least 2 characters' })
    if (!payload.email.includes('@')) errors.push({ field: 'email', message: 'Invalid email format' })
    if (!payload.website.startsWith('http')) errors.push({ field: 'website', message: 'Website must start with http/https' })

    if (errors.length > 0) {
      // Simulate 422
      const error: any = new Error('Validation Failed')
      error.code = 'VALIDATION_ERROR'
      error.details = errors
      throw error
    }

    // Success
    console.log('Merchant Created:', payload)
  }
}
