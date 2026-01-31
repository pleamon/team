'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { DeveloperService, type Webhook } from '@/services/secondary-services'

const columns = [
  {
    key: 'url',
    label: 'Endpoint URL',
    render: (row: Webhook) => <span className="font-mono text-xs">{row.url}</span>,
  },
  {
    key: 'events',
    label: 'Events',
    render: (row: Webhook) => (
      <div className="flex gap-1">
        {row.events.map(e => (
          <span key={e} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px]">{e}</span>
        ))}
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: Webhook) => (
      <span className={`text-xs font-medium ${row.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
        {row.status.toUpperCase()}
      </span>
    ),
  },
  {
    key: 'lastTriggered',
    label: 'Last Activity',
    render: (row: Webhook) => <span className="text-xs text-text-muted">{row.lastTriggered}</span>,
  },
]

export default function DevelopersPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Webhook[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await DeveloperService.getWebhooks()
        setData(res)
      } catch {
        setError('Failed to load webhooks')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-text">Developers</h2>
      </div>
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <DataTable columns={columns} data={data} loading={loading} error={error} />
      </div>
    </div>
  )
}
