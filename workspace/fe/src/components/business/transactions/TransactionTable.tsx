'use client'

import type { ReactNode } from 'react'
import { Badge, Table } from '../../design'
import type { TableColumn } from '../../design'
import type { Transaction } from './types'

function formatMoney(amountCents: number, currency: string) {
  const value = amountCents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

function statusBadge(status: Transaction['status']) {
  switch (status) {
    case 'success':
      return (
        <span aria-label="Status: Success">
          <Badge variant="success" dot>Success</Badge>
        </span>
      )
    case 'failed':
      return (
        <span aria-label="Status: Failed">
          <Badge variant="error" dot>Failed</Badge>
        </span>
      )
    case 'pending':
      return (
        <span aria-label="Status: Pending">
          <Badge variant="warning" dot>Pending</Badge>
        </span>
      )
    case 'refunded':
      return (
        <span aria-label="Status: Refunded">
          <Badge variant="info" dot>Refunded</Badge>
        </span>
      )
    default:
      return (
        <span aria-label="Status">
          <Badge variant="info" dot>{status}</Badge>
        </span>
      )
  }
}

export interface TransactionTableProps {
  items: Transaction[]
  loading?: boolean
  error?: boolean
  emptyContent?: ReactNode
  errorContent?: ReactNode
  onRowClick: (txn: Transaction) => void
}

export function TransactionTable({
  items,
  loading = false,
  error = false,
  emptyContent,
  errorContent,
  onRowClick,
}: TransactionTableProps) {
  const columns: TableColumn<Transaction>[] = [
    {
      key: 'id',
      title: <span className="text-[var(--font-xs)] uppercase tracking-wide text-[var(--color-gray-500)]">ID</span>,
      width: 180,
      render: (v, row) => (
        <span
          className="block max-w-[180px] truncate font-mono text-[var(--font-sm)] text-[var(--color-gray-700)]"
          title={row.id}
        >
          {row.id}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: <span className="text-[var(--font-xs)] uppercase tracking-wide text-[var(--color-gray-500)]">Date</span>,
      width: 140,
      render: (v, row) => (
        <span className="text-[var(--font-sm)] text-[var(--color-gray-700)]">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      key: 'merchantName',
      title: <span className="text-[var(--font-xs)] uppercase tracking-wide text-[var(--color-gray-500)]">Merchant</span>,
      render: (v, row) => (
        <span className="text-[var(--font-sm)] text-[var(--color-gray-700)]">{row.merchantName}</span>
      ),
    },
    {
      key: 'amount',
      title: <span className="text-[var(--font-xs)] uppercase tracking-wide text-[var(--color-gray-500)]">Amount</span>,
      width: 120,
      align: 'right',
      render: (v, row) => (
        <span className="font-mono text-[var(--font-sm)] text-[var(--color-gray-700)]">
          {formatMoney(row.amountCents, row.currency)}
        </span>
      ),
    },
    {
      key: 'status',
      title: <span className="text-[var(--font-xs)] uppercase tracking-wide text-[var(--color-gray-500)]">Status</span>,
      width: 100,
      align: 'center',
      render: (v, row) => statusBadge(row.status) as any,
    },
  ]

  return (
    <Table
      variant="compact"
      columns={columns}
      dataSource={items}
      rowKey="id"
      loading={loading}
      error={error}
      emptyContent={emptyContent}
      errorContent={errorContent}
      onRowClick={onRowClick}
      getRowAriaLabel={(row) => `Transaction ${row.id}`}
      className="rounded-[var(--radius-lg)] bg-[var(--color-white)] shadow-[var(--shadow-sm)]"
    />
  )
}

export default TransactionTable
