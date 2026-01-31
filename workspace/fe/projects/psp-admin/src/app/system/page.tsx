'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { SystemService, type User } from '@/services/secondary-services'

const columns = [
  {
    key: 'name',
    label: 'User Name',
    render: (row: User) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: 'email',
    label: 'Email',
    render: (row: User) => <span className="text-text-muted">{row.email}</span>,
  },
  {
    key: 'role',
    label: 'Role',
    render: (row: User) => <span className="capitalize px-2 py-1 bg-gray-100 rounded text-xs">{row.role}</span>,
  },
]

export default function SystemPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await SystemService.getUsers()
        setData(res)
      } catch {
        setError('Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-text">System Users</h2>
      </div>
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <DataTable columns={columns} data={data} loading={loading} error={error} />
      </div>
    </div>
  )
}
