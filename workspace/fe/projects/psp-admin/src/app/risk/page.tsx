'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { RiskService, type RiskRule } from '@/services/secondary-services'

const columns = [
  {
    key: 'name',
    label: 'Rule Name',
    render: (row: RiskRule) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: 'type',
    label: 'Type',
    render: (row: RiskRule) => <span className="capitalize px-2 py-1 bg-gray-100 rounded text-xs">{row.type}</span>,
  },
  {
    key: 'threshold',
    label: 'Threshold',
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: RiskRule) => (
      <span className={`text-xs font-medium ${row.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
        {row.status.toUpperCase()}
      </span>
    ),
  },
]

export default function RiskPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<RiskRule[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await RiskService.getRules()
        setData(res)
      } catch {
        setError('Failed to load rules')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-text">Risk Management</h2>
      </div>
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <DataTable columns={columns} data={data} loading={loading} error={error} />
      </div>
    </div>
  )
}
