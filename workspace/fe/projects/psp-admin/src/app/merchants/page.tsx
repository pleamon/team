'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, MoreHorizontal } from 'lucide-react'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MerchantService, type Merchant } from '@/services/merchant-service'

const columns = [
  {
    key: 'name',
    label: 'Merchant Name',
    render: (row: Merchant) => (
      <div className="flex flex-col">
        <span className="font-medium text-text">{row.name}</span>
        <span className="text-xs text-text-muted">{row.email}</span>
      </div>
    ),
  },
  {
    key: 'region',
    label: 'Region',
    render: (row: Merchant) => (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
        {row.region}
      </span>
    ),
  },
  {
    key: 'businessType',
    label: 'Type',
    render: (row: Merchant) => <span className="capitalize">{row.businessType}</span>,
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: Merchant) => <StatusBadge status={row.status === 'active' ? 'success' : row.status === 'pending' ? 'pending' : 'failed'} text={row.status} />,
  },
  {
    key: 'actions',
    label: '',
    align: 'right' as const,
    render: () => (
      <button className="p-1 hover:bg-gray-100 rounded text-text-muted">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    ),
  },
]

export default function MerchantsPage() {
  const [loading, setLoading] = useState(true)
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await MerchantService.getAll()
        setMerchants(data)
      } catch {
        setError('Failed to load merchants')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">Merchants</h2>
          <p className="text-sm text-text-muted mt-0.5">Manage merchant accounts and onboarding</p>
        </div>
        <Link 
          href="/merchants/create" 
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Onboard Merchant
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <DataTable 
          columns={columns} 
          data={merchants} 
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
