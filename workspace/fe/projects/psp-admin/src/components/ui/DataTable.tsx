/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'

interface Column<T = any> {
  key: string
  label: string
  render?: (row: T) => ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
}

interface DataTableProps<T = any> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  onRetry?: () => void
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  error = null,
  emptyMessage = 'No data found',
  onRetry,
}: DataTableProps<T>) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center mb-3">
          <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-text font-medium">Failed to load data</p>
        <p className="text-sm text-text-muted mt-1">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Try again
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-semibold tracking-wide text-text-muted uppercase ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {loading ? (
             Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j} className="px-4 py-3.5">
                    <div className="h-4 w-full bg-gray-100 animate-pulse rounded"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-surface-hover">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3.5 text-sm ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.render ? col.render(row) : String((row as any)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
