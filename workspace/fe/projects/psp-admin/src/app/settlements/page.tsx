'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency } from '@/lib/utils'
import { SettlementService, type Settlement } from '@/services/secondary-services'

const columns = [
  {
    key: 'id',
    label: 'ID',
    render: (row: Settlement) => <span className="font-mono text-xs">{row.id}</span>,
  },
  {
    key: 'merchantName',
    label: 'Merchant',
    render: (row: Settlement) => <span className="font-medium">{row.merchantName}</span>,
  },
  {
    key: 'amount',
    label: 'Amount',
    render: (row: Settlement) => <span>{formatCurrency(row.amount, row.currency)}</span>,
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: Settlement) => <StatusBadge status={row.status === 'paid' ? 'success' : row.status === 'processing' ? 'pending' : 'failed'} text={row.status} />,
  },
  {
    key: 'payoutDate',
    label: 'Payout Date',
    render: (row: Settlement) => <span className="text-xs text-text-muted">{row.payoutDate}</span>,
  },
]

export default function SettlementsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Settlement[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await SettlementService.getAll()
        setData(res)
      } catch {
        setError('Failed to load settlements')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-text">Settlements</h2>
      </div>
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <DataTable columns={columns} data={data} loading={loading} error={error} />
      </div>
    </div>
  )
}
